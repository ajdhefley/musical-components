import { Notation, NotationType } from '@lib/core/models'

export class Rest extends Notation {
    constructor (type: NotationType, startBeat: number = 0) {
        super(type, startBeat)
    }
}
