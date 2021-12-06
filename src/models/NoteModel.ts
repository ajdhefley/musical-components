import { NoteType, OctaveType, PitchType, Pitches } from '../types';
import { NotationModel } from './NotationModel';

export class NoteModel extends NotationModel {
    public static readonly TreblePositionC: number = 6;
    public static readonly BassLocationC: number = 4;
    public static readonly MiddleOctave: OctaveType = 4;

    constructor(
        public readonly type: NoteType,
        public readonly pitch: PitchType,
        public readonly octave: OctaveType,
        public readonly time: number
    ) {
        super(type, time);
    }

    public getOctavePosition(): number {
        const octaveNotes = (this.octave - 1) * Pitches.length;
        const offsetNotes = Pitches.indexOf(this.pitch);
        return octaveNotes + offsetNotes;
    }

    public toString() {
        return this.pitch + this.octave;
    }
}
