import { NotationType } from '@lib/core/models'

export abstract class Notation {
    type: NotationType
    startBeat: number
    active: boolean
    dotCount: number

    constructor (type: NotationType, startBeat: number = 0, dotCount: number = 0) {
        this.type = type
        this.startBeat = startBeat
        this.active = false
        this.dotCount = dotCount
    }

    get totalBeatValue (): number {
        let value = this.type.beatValue
        let augment = this.type.beatValue
        for (let i = 0; i < this.dotCount; i++) {
            augment /= 2
            value += augment
        }
        return value
    }
}
