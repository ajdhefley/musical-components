import { Metronome } from '@lib/core/Metronome'
import { MidiAudio } from '@lib/core/MidiAudio'
import { MidiNotationPlayerResponse } from '@lib/core/MidiNotationPlayerResponse'
import { MidiRelay } from '@lib/core/MidiRelay'
import { Notation } from '@lib/core/models'

/**
 * Executes MIDI playback. Exposes playback events and the ability to stop the current playback.
 **/
export class MidiNotationPlayer {
    private currentPlayback?: MidiNotationPlayerResponse

    private readonly metronome: Metronome
    private readonly midiRelay: MidiRelay

    constructor (
        private readonly beatsPerMeasure: number,
        private readonly beatsPerMinute: number
    ) {
        this.metronome = new Metronome(this.beatsPerMeasure, this.beatsPerMinute)
        this.midiRelay = new MidiRelay()
        this.midiRelay.openAccess().then((midi) => new MidiAudio().listen(midi.inputs))
    }

    /**
     * Executes MIDI playback from notation models.
     *
     * @param notations Models containing musical data such as pitch and time.
     * @param useMetronome Whether metronome audio should play in timing with MIDI playback.
     * @returns {MidiNotationPlayerResponse} Player response, which exposes an event listener.
     **/
    play (notations: Notation[], useMetronome: boolean) {
        this.currentPlayback = new MidiNotationPlayerResponse(notations, this.beatsPerMinute, this.midiRelay)

        if (useMetronome) {
            this.metronome.start()
            this.currentPlayback.on('stop', () => {
                this.metronome.stop()
                this.stop()
            })
        }

        return this.currentPlayback
    }

    /**
     * Tells playback to stop executing and disposes it.
     **/
    stop () {
        if (this.currentPlayback) {
            this.currentPlayback.cancel()
            this.currentPlayback = undefined
        }
    }

    /**
     * If currently playback is executing, returns true.
     *
     * @returns {boolean} Whether this player currently contains playback in memory.
     **/
    running () {
        return typeof (this.currentPlayback) !== 'undefined'
    }
}
