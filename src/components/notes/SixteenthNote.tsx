import './SixteenthNote.scss';
import Note from './Note';

export class SixteenthNote extends Note {
    protected readonly type = '16th';
    protected readonly domain = Array.from({ length: 16 }, (x, i) => 1 + i * 0.25);
}

export default SixteenthNote;
