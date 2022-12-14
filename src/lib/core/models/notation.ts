import { NotationType } from '@lib/core/models'

export abstract class Notation {
    type: NotationType
    startBeat: number
    active: boolean

    constructor (type: NotationType, startBeat: number = 0) {
        this.type = type
        this.startBeat = startBeat
        this.active = false
    }
}
