import React from 'react';
import { Clefs } from '../types';

import './ExerciseClefOptions.scss';

export class ExerciseClefOptions extends React.Component {
    render() {
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
}

export default ExerciseClefOptions;
