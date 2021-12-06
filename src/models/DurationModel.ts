import { NoteType, Notes } from '../types';

export class DurationModel {
    constructor(public readonly noteType: NoteType, public readonly value: number) {
        const rawDurationValue = 1 / 2**Notes.indexOf(noteType);
        if (value % rawDurationValue !== 0)
            throw new Error(`Invalid duration: expected multiple of ${rawDurationValue} for "${noteType}"`);
    }
}