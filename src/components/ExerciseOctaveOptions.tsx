import './ExerciseOctaveOptions.scss';
import { Octaves } from '../types';

function ExerciseOctaveOptions() {
    return (
        <div className="exercise-options-octave">
            <h3>Exclude Octaves</h3>
            {Octaves.map((octave) => (<div>
                <input type="checkbox" id={`exclude-${octave}`} />
                <label htmlFor={`exclude-${octave}`}>{octave}</label>
            </div>))}
        </div>
    );
}

export default ExerciseOctaveOptions;
