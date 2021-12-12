import { OctaveType, PitchType } from '../types';
import { NotationDto } from './Notation.dto';

export class NoteDto extends NotationDto {
    pitch: 0|1|2|3|4|5|6|7|8|9|10|11;
    octave: OctaveType;
}
