import React from 'react';
import { Octaves } from '../types';

import './ExerciseOctaveOptions.scss';

export class ExerciseOctaveOptions extends React.Component {
    render() {
        return (
            <div>
                <h3>Exclude Octaves</h3>
                {Octaves.map((octave) => (<div>
                    <input type="checkbox" id={`exclude-${octave}`} />
                    <label htmlFor={`exclude-${octave}`}>{octave}</label>
                </div>))}
            </div>
        );
    }
}

export default ExerciseOctaveOptions;
