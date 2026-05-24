import { Notation } from './Notation'
import { NotationType } from './NotationType'
import { Pitch } from './Pitch'

export class Chord extends Notation {
    pitches: Pitch[]

    constructor (type: NotationType, pitches: Pitch[], startBeat: number = 0, dotCount: number = 0) {
        super(type, startBeat, dotCount)
        this.pitches = pitches
    }
}
