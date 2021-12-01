import './WholeNote.scss';
import Note from './Note';

export class WholeNote extends Note {
    protected readonly Type = 'whole';
    protected readonly Domain = [1];
}

export default WholeNote;
