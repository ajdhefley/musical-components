import './HalfNote.scss';
import Note from './Note';

export class HalfNote extends Note {
    protected readonly type = 'half';
    protected readonly domain = [1,3];
}

export default HalfNote;
