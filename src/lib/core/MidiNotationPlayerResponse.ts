import { MidiRelay } from '@lib/core/MidiRelay'
import { Notation, Note } from '@lib/core/models'

/**
 * Response controlling MIDI playback. Exposes playback events and the ability to cancel the current playback.
 **/
export class MidiNotationPlayerResponse {
    private eventCallbacks: any
    private cancelled: boolean

    constructor (
        private readonly notations: Notation[],
        private readonly beatsPerMinute: number,
        private readonly midiRelay: MidiRelay
    ) {
        this.eventCallbacks = {}
        this.execute(this.notations)
    }

    /**
     * Binds an event listener to playback. Available event identifiers are:
     *
     * - `message` is fired whenever a note is played (Note On MIDI message is sent)
     * - `stop` is fired whenever playback is stopped either by external source or reaching the end of playback
     *
     * @param event The event identifier.
     * @param callback The callback bound to the event, invoked when it fires.
     * @returns
     **/
    on (event: string, callback: (value: any) => void) {
        this.eventCallbacks[event] = this.eventCallbacks[event] || new Array<any>()
        this.eventCallbacks[event].push(callback)
        return this
    }

    /**
     * Stops current playback.
     **/
    cancel () {
        this.cancelled = true
    }

    /**
     * Sends MIDI messages containing pitch data.
     * Calculates and awaits duration in miliseconds in between notes based on note type and beat timing.
     *
     * @param notations The array of notations (notes and rests.)
     **/
    private async execute (notations: Notation[]) {
        const lastNote = notations[notations.length - 1]
        const lastTick = lastNote.startBeat + lastNote.type.beatValue

        for (let i = 0; i < lastTick; i += 1 / 32) {
            if (this.cancelled) {
                break
            }

            // Simultaneously fire all notes at this tick, but wait for them all to complete.
            await Promise.all(
                notations
                    .filter(n => n instanceof Note)
                    .filter(n => n.startBeat === i)
                    .map(async (note: any) => {
                        const baseBpm = 60
                        const baseCountDuration = 1000
                        const countDuration = (baseBpm / this.beatsPerMinute) * baseCountDuration
                        const noteDuration = note.type.beatValue * 4 * countDuration
                        this.midiRelay.sendMidi(note.pitch, noteDuration)
                        this.invokeEvent('message', note)
                        return await new Promise<void>((resolve) => setTimeout(resolve, noteDuration))
                    })
            )
        }

        this.invokeEvent('stop')
    }

    /**
     * Executes all callbacks bound to the event.
     *
     * @param event The event identifier.
     * @param args Optional args passed to the event listener.
     **/
    private invokeEvent (event: string, ...args: any[]) {
        if (this.eventCallbacks[event]) {
            this.eventCallbacks[event].forEach((callback: any) => callback.apply(window, args))
        }
    }
}
