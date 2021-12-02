import './EighthNote.scss';
import Note from './Note';

export class EighthNote extends Note {
    protected readonly type = '8th';
    protected readonly domain = Array.from({ length: 8 }, (x, i) => 1 + i * 0.5);
}

export default EighthNote;
