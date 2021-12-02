import { NoteType } from "../types";

export class TimeSignatureModel {
    constructor(public readonly beatsPerMeasure: number, public readonly beatValue: NoteType) {

    }
}