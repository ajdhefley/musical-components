import { NoteType, OctaveType, PitchType, Pitches } from '../types';

export class NoteModel {
    public static readonly TreblePositionC: number = 6;
    public static readonly BassLocationC: number = 4;
    public static readonly MiddleOctave: OctaveType = 4;

    constructor(
        public readonly type: NoteType,
        public readonly pitch: PitchType,
        public readonly octave: OctaveType,
        public readonly time: number
    ) { }

    public getOctavePosition(): number {
        const octaveNotes = (this.octave - 1) * Pitches.length;
        const offsetNotes = Pitches.indexOf(this.pitch);
        return octaveNotes + offsetNotes;
    }

    public getDomain(): number[] {
        switch (this.type) {
            case 'whole':
                return [1];
            case 'half':
                return [1,3];
            case 'quarter':
                return Array.from({ length: 4 }, (x, i) => 1 + i);
            case '8th':
                return Array.from({ length: 8 }, (x, i) => 1 + i * 0.5);
            case '16th':
                return Array.from({ length: 16 }, (x, i) => 1 + i * 0.25);
            case '32nd':
                return Array.from({ length: 32 }, (x, i) => 1 + i * 0.125);
        }
    }

    public toString() {
        return this.pitch + this.octave;
    }
}
