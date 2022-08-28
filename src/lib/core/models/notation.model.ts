import { Duration } from '../enums'

export abstract class NotationModel {
    durationType: Duration
    startBeat: number
    active: boolean
}
