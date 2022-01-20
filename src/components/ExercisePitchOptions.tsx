import { useAppDispatch } from '../redux-hooks';
import './ExercisePitchOptions.scss';

function ExercisePitchOptions({
    options,
}: {
    options: { name: string, value: number }[];
}) {
    const dispatch = useAppDispatch();

    return (
        <div className="exercise-options-pitch">
            <h3>Exclude Pitches</h3>
            {options.map((pitch) => (<div>
                <input type="checkbox" id={`exclude-${pitch.name}`} />
                <label htmlFor={`exclude-${pitch.name}`}>{pitch.name}</label>
            </div>))}
        </div>
    );
}

export default ExercisePitchOptions;
