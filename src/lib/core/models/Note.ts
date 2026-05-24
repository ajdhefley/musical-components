import { Pitch, Notation, NotationType } from '@lib/core/models'

export class Note extends Notation {
    pitch: Pitch
    stemStretchFactor: number = 1.0 // TODO: Move out of model, UI logic should not be mixed with data
    isBeamed: boolean = false
    tieToNext: boolean

    constructor (type: NotationType, pitch: Pitch, startBeat: number = 0, dotCount: number = 0, tieToNext: boolean = false) {
        super(type, startBeat, dotCount)
        this.pitch = pitch
        this.tieToNext = tieToNext
    }

    getEndBeat () {
        return this.startBeat + this.totalBeatValue
    }
}
