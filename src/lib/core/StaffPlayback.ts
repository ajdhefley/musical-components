import { Notation, MidiNotationPlayer } from '../..'

export class StaffPlayback {
    private _notations: Notation[]

    private readonly midiPlayer: MidiNotationPlayer

    constructor (beatsPerMeasure: number, beatsPerMinute: number) {
        this.midiPlayer = new MidiNotationPlayer(beatsPerMeasure, beatsPerMinute)
    }

    public setNotations(notations: Notation[]) {
        this._notations = notations
    }

    public activateNotation (notation: Notation) {
        this._notations = this._notations.map((iteratedNotation) => {
            if (iteratedNotation === notation) {
                iteratedNotation.active = true
                return iteratedNotation
            }

            iteratedNotation.active = false
            return iteratedNotation
        })
    }

    public deactivateNotations () {
        this._notations = this._notations.map((iteratedNotation) => {
            iteratedNotation.active = false
            return iteratedNotation
        })
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