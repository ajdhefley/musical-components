import { Duration } from '../types'
import { NotationModel } from './notation.model'

export class RestModel extends NotationModel {
    constructor (durationType: Duration, startBeat: number = 0) {
        super()
        this.durationType = durationType
        this.startBeat = startBeat
        this.active = false
    }
}
