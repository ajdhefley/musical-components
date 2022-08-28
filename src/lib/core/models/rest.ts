import { NotationType } from './notation-type'
import { Notation } from './notation'

export class Rest extends Notation {
    constructor (type: NotationType, startBeat: number = 0) {
        super(type, startBeat)
    }
}
