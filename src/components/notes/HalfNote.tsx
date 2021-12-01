import './HalfNote.scss';
import Note from './Note';

export class HalfNote extends Note {
    protected readonly Type = 'half';
    protected readonly Domain = [1,3];
}

export default HalfNote;
