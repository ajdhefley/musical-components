import { StaffModel } from '.';
import { ClefType, NoteType, OctaveType, PitchType } from '../types';

export class NoteModel {
    private static readonly TreblePositionC: number = 6;
    private static readonly BassLocationC: number = 4;
    private static readonly MiddleOctave: OctaveType = 4;
    private static readonly PitchTypes: Array<PitchType> = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    private static readonly NoteTypes: Array<NoteType> = ['32nd', '16th', '8th', 'quarter', 'half', 'whole'];

    constructor(
        public readonly type: NoteType,
        public readonly pitch: PitchType,
        public readonly octave: OctaveType,
        public readonly time: number
    ) {

    }

    public getPositionLeft() {
        return this.time * 100;
    }

    public getPositionBottom(clef: ClefType): number {
        let cPosition = 0;

        switch (clef) {
            case 'treble':
                cPosition = NoteModel.TreblePositionC;
                break;
            case 'bass':
                cPosition = NoteModel.BassLocationC;
                break;
        }

        const noteHeight = StaffModel.StaffSpaceHeight / 2;
        
        const cIndex = cPosition - 1;
        const basePosition = cIndex * noteHeight;

        const pitchIndex = NoteModel.PitchTypes.indexOf(this.pitch);
        const pitchPosition = pitchIndex * noteHeight;

        const octaveDiff = this.octave - NoteModel.MiddleOctave;
        const octaveDiffPosition = octaveDiff * noteHeight * NoteModel.PitchTypes.length;

        return basePosition + pitchPosition + octaveDiffPosition;
    }

    public toString() {
        return this.pitch + this.octave;
    }
}
