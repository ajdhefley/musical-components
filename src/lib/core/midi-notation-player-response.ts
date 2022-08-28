import { MidiRelay } from './midi-relay'
import { Notation, Note } from './models'

export class MidiNotationPlayerResponse {
    private readonly eventCallbacks: any

    constructor (
        private readonly notations: Notation[],
        private readonly beatsPerMinute: number,
        private readonly midiRelay: MidiRelay
    ) {
        this.eventCallbacks = {}
        this.execute(this.notations)
    }

    on (event: string, callback: (value: any) => void) {
        this.eventCallbacks[event] = this.eventCallbacks[event] || new Array<any>()
        this.eventCallbacks[event].push(callback)
        return this
    }

    private async execute (notations: Notation[]) {
        const lastNote = notations[notations.length - 1]
        const lastTick = lastNote.startBeat + lastNote.type.getBeatValue()

        for (let i = 0; i < lastTick; i += 1 / 32) {
            await Promise.all(
                notations
                    .filter(n => n instanceof Note)
                    .filter(n => n.startBeat === i)
                    .map(async (note: any) => {
                        const baseBpm = 60
                        const baseCountDuration = 1000
                        const countDuration = (baseBpm / this.beatsPerMinute) * baseCountDuration
                        const noteDuration = note.type.getBeatsPerMeasure() * countDuration
                        this.midiRelay.sendMidi(note.pitch, noteDuration)
                        this.invokeEvent('message', note)
                        return await new Promise<void>((resolve) => setTimeout(resolve, noteDuration))
                    })
            )
        }

        this.invokeEvent('stop')
    }

    private invokeEvent (event: string, ...args: any[]) {
        if (this.eventCallbacks[event]) {
            this.eventCallbacks[event].forEach((callback: any) => callback.apply(window, args))
        }
    }
}
