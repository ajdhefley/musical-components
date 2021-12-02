import './QuarterNote.scss';
import Note from './Note';

export class QuarterNote extends Note {
    protected readonly type = 'quarter';
    protected readonly domain = Array.from({ length: 4 }, (x, i) => 1 + i);
}

export default QuarterNote;
