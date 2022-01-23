import { NoteType } from '../types';

export abstract class NotationModel {
    type: NoteType;
    time: number;
}
