import { Pitch } from '../types';
import { NotationModel } from './Notation.model';

export class NoteModel extends NotationModel {
    pitch: Pitch;
    octave: number;
    accidental?: 'sharp' | 'flat' | undefined;
}
