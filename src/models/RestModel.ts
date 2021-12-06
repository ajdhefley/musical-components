import { DurationType, NoteType } from '../types';
import { NotationModel } from './NotationModel';

export class RestModel extends NotationModel {
    public static fromDuration(duration: DurationType, time: number): RestModel {
        if (duration % 1 === 0)
            return new RestModel('whole', time);
        if (duration % 0.5 === 0)
            return new RestModel('half', time);
        if (duration % 0.25 === 0)
            return new RestModel('quarter', time);
        if (duration % 0.125 === 0)
            return new RestModel('8th', time);
        if (duration % 0.0625 === 0)
            return new RestModel('16th', time);
        if (duration % 0.03125 === 0)
            return new RestModel('32nd', time);

        throw new Error('Unrecognized duration');
    }

    constructor(public readonly type: NoteType, public readonly time: number) {
        super(type, time);
    }
}
