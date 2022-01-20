import { useAppDispatch } from '../redux-hooks';
import './ExerciseNoteOptions.scss';

function ExerciseNoteOptions({
    options,
}: {
    options: { name: string, value: number }[];
}) {
    const dispatch = useAppDispatch();

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
