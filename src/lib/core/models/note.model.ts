import { Duration, Pitch } from '../enums'
import { NotationModel } from './notation.model'

export class NoteModel extends NotationModel {
    pitch: Pitch
    stemStretchFactor: number = 1.0 // Move out of model, UI logic should not be mixed with data

    constructor (pitch: Pitch, durationType: Duration, startBeat: number = 0) {
        super()
        this.pitch = pitch
        this.durationType = durationType
        this.startBeat = startBeat
        this.active = false
    }
}