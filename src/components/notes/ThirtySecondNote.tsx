import './ThirtySecondNote.scss';
import Note from './Note';

export class ThirtySecondNote extends Note {
    protected readonly type = '32nd';
    protected readonly domain = Array.from({ length: 32 }, (x, i) => 1 + i * 0.125);
}

export default ThirtySecondNote;
