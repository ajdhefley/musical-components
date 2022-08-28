import { Metronome } from './metronome'
import { MidiAudio } from './midi-audio'
import { MidiNotationPlayerResponse } from './midi-notation-player-response'
import { MidiRelay } from './midi-relay'
import { Notation } from './models'

export class MidiNotationPlayer {
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

    play (notations: Notation[], useMetronome: boolean) {
        const playback = new MidiNotationPlayerResponse(notations, this.beatsPerMinute, this.midiRelay)

        if (useMetronome) {
            this.metronome.start()
            playback.on('stop', () => this.metronome.stop())
        }

        return playback
    }
}
