import { Notes, NoteType } from '../types';
import { DurationModel } from './DurationModel';

export abstract class NotationModel {
    constructor(
        public readonly type: NoteType,
        public readonly time: number,
        public readonly dotted = false
    ) { }

    public getDomain(): number[] {
        switch (this.type) {
            case 'whole':
                return [1];
            case 'half':
                return [1,3];
            case 'quarter':
                return Array.from({ length: 4 }, (x, i) => i * 0.25);
            case '8th':
                return Array.from({ length: 8 }, (x, i) => i * 0.125);
            case '16th':
                return Array.from({ length: 16 }, (x, i) => i * 0.0625);
            case '32nd':
                return Array.from({ length: 32 }, (x, i) => i * 0.03125);
        }
    }

    public getDuration(): DurationModel {
        const baseDurationValue = 1 / 2**Notes.indexOf(this.type);
        return new DurationModel(this.type, this.dotted ? baseDurationValue * 1.5 : baseDurationValue);
    }
}