import { OctaveType, PitchType } from '../types';
import { NotationDto } from './Notation.dto';

export class NoteDto extends NotationDto {
    pitch: PitchType;
    octave: OctaveType;
}
