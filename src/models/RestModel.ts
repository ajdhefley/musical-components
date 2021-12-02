import { NoteType } from '../types';

export class RestModel {
    constructor(public readonly type: NoteType, public readonly time: number) { }
}
