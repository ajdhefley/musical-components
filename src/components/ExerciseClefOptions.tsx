import { useAppDispatch } from '../redux-hooks';
import './ExerciseClefOptions.scss';

function ExerciseClefOptions() {
    const dispatch = useAppDispatch();

    const options = [
        { name: 'treble' },
        { name: 'bass' }
    ];

    return (
        <div className="exercise-options-octave">
            <h3>Use Clefs</h3>
            {options.map((clef) => (<div>
                <input type="checkbox" id={`exclude-${clef.name}`} checked />
                <label htmlFor={`exclude-${clef.name}`}>{clef.name}</label>
            </div>))}
        </div>
    );
}

export default ExerciseClefOptions;
