import { useAppDispatch } from '../redux-hooks';
import './ExerciseOctaveOptions.scss';

function ExerciseOctaveOptions() {
    const dispatch = useAppDispatch();

    const options = [1,2,3,4,5,6];

    return (
        <div className="exercise-options-octave">
            <h3>Exclude Octaves</h3>
            {options.map((octave) => (<div>
                <input type="checkbox" id={`exclude-${octave}`} />
                <label htmlFor={`exclude-${octave}`}>{octave}</label>
            </div>))}
        </div>
    );
}

export default ExerciseOctaveOptions;
