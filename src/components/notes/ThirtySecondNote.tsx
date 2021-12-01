import './ThirtySecondNote.scss';
import Note from './Note';

export class ThirtySecondNote extends Note {
    protected readonly Type = '32nd';
    protected readonly Domain = Array.from({ length: 32 }, (x, i) => 1 + i * 0.125);
}

export default ThirtySecondNote;
