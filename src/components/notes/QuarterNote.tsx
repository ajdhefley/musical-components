import './QuarterNote.scss';
import Note from './Note';

export class QuarterNote extends Note {
    protected readonly Type = 'quarter';
    protected readonly Domain = Array.from({ length: 4 }, (x, i) => 1 + i);
}

export default QuarterNote;
