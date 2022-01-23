import { useAppDispatch } from '../redux-hooks';
import './ExerciseNoteOptions.scss';

function ExerciseNoteOptions() {
    const dispatch = useAppDispatch();

    const options = [
        { name: 'whole', value: 1 },
        { name: 'half', value: 2 },
        { name: 'quarter', value: 4 },
        { name: 'eighth', value: 8 },
        { name: 'sixteenth', value: 16 },
        { name: 'thirty-second', value: 32 }
    ];

    return (
        <div className="exercise-options-note">
            <h3>Exclude Notes</h3>
            {options.map((note) => (<div>
                <input type="checkbox" id={`exclude-${note.name}`} />
                <label htmlFor={`exclude-${note.name}`}>{note.name}</label>
            </div>))}
        </div>
    );
}

export default ExerciseNoteOptions;
