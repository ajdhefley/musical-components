import './ExercisePitchOptions.scss';
import { Pitches } from '../types';

function ExercisePitchOptions() {
    return (
        <div className="exercise-options-pitch">
            <h3>Exclude Pitches</h3>
            {Pitches.map((pitch) => (<div>
                <input type="checkbox" id={`exclude-${pitch}`} />
                <label htmlFor={`exclude-${pitch}`}>{pitch}</label>
            </div>))}
        </div>
    );
}

export default ExercisePitchOptions;
