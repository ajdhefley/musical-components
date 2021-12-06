import { TimeSignatureModel } from './TimeSignatureModel';
import { NoteModel } from './NoteModel';

export class StaffModel {
    private notes: NoteModel[];

    constructor(public readonly timeSignature: TimeSignatureModel) {
        this.notes = new Array<NoteModel>();
    }

    public getNotes(): NoteModel[] {
        return this.notes;
    }
}
