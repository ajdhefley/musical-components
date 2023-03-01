import { Pitch, Notation, NotationType } from '@lib/core/models'

export class Note extends Notation {
    pitch: Pitch
    stemStretchFactor: number = 1.0 // Move out of model, UI logic should not be mixed with data

    constructor (type: NotationType, pitch: Pitch, startBeat: number = 0) {
        super(type, startBeat)
        this.pitch = pitch
    }

    getEndBeat () {
        return this.startBeat + this.type.beatValue
    }
}
