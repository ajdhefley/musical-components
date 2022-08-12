import { Note } from '../types';
import { NotationModel } from './Notation.model';

export class NoteModel extends NotationModel {
    pitch: Note;
    octave: number;
    accidental?: 'sharp' | 'flat' | undefined;
}
