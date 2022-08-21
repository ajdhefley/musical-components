import { Duration, Pitch } from '../types';
import { NotationModel } from './Notation.model';

export class NoteModel extends NotationModel {
    pitch: Pitch;

    constructor(pitch: Pitch, durationType: Duration, startBeat: number = 0) {
        super();
        this.pitch = pitch;
        this.durationType = durationType;
        this.startBeat = startBeat;
        this.active = false;
    }
}
