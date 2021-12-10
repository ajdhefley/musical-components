import React from 'react';

import './ExercisePitchOptions.scss';
import { Pitches } from '../types';

export class ExercisePitchOptions extends React.Component {
    render() {
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
}

export default ExercisePitchOptions;
