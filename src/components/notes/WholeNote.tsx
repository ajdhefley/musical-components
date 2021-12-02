import './WholeNote.scss';
import Note from './Note';

export class WholeNote extends Note {
    protected readonly type = 'whole';
    protected readonly domain = [1];
}

export default WholeNote;
