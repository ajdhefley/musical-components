import { useAppDispatch } from '../redux-hooks';
import './ExerciseOctaveOptions.scss';

function ExerciseOctaveOptions({
    options,
}: {
    options: number[];
}) {
    const dispatch = useAppDispatch();

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
