import { NoteType } from '../types';

export abstract class NotationDto {
    type: NoteType;
    time: number;
}
