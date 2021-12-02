import { NoteModel } from ".";
import { NoteType, Notes } from "../types";

export class BeatModel {
    private notes: NoteModel[];
    private oneBeatSum: number;

    constructor(public readonly oneBeatCount: NoteType) {
        this.notes = new Array<NoteModel>();
        this.oneBeatSum = 1 / 2**Notes.indexOf(oneBeatCount);
    }

    // public getWidth(): number {
    //     const sortedNotes = this.notes.sort((a,b) => a.time - b.time);

    //     sortedNotes.forEach((note) => {
            
    //     });
    // }
}