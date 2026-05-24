import { Score } from '@lib/core/Score'
import { Notation } from '@lib/core/models'
import { MidiNotationPlayer } from '@lib/core/MidiNotationPlayer'

/**
 * Manages playback for a full Score, merging all voices across all staves
 * into a single timeline and playing them simultaneously.
 **/
export class ScorePlayback {
    private _notations: Notation[] = []
    private readonly midiPlayer: MidiNotationPlayer

    constructor (beatsPerMeasure: number, beatsPerMinute: number) {
        this.midiPlayer = new MidiNotationPlayer(beatsPerMeasure, beatsPerMinute)
    }

    public setScore (score: Score) {
        const all = score.staves.flatMap((staff) =>
            staff.voices.flatMap((voice) => voice.notations as Notation[])
        )
        this._notations = [...all].sort((a, b) => a.startBeat - b.startBeat)
    }

    public activateNotation (notation: Notation) {
        this._notations.forEach((n) => { n.active = n === notation })
    }

    public deactivateNotations () {
        this._notations.forEach((n) => { n.active = false })
    }

    public async togglePlayback () {
        this.deactivateNotations()

        if (this.midiPlayer.running()) {
            this.midiPlayer.stop()
        } else {
            this.midiPlayer.play(this._notations, false)
                .on('message', (note) => this.activateNotation(note))
                .on('stop', () => this.deactivateNotations())
        }
    }
}
