import './ExerciseClefOptions.scss';
import { Clefs } from '../types';

function ExerciseClefOptions() {
    return (
        <div className="exercise-options-octave">
            <h3>Use Clefs</h3>
            {Clefs.map((clef) => (<div>
                <input type="checkbox" id={`exclude-${clef}`} checked />
                <label htmlFor={`exclude-${clef}`}>{clef}</label>
            </div>))}
        </div>
    );
}

export default ExerciseClefOptions;
