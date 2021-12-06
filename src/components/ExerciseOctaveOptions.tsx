import React from 'react';
import { Octaves } from '../types';

import './ExerciseOctaveOptions.scss';

export class ExerciseOctaveOptions extends React.Component {
    render() {
        return (
            <div>
                {Octaves.map((octave) => (<span>{octave}</span>))}
            </div>
        );
    }
}

export default ExerciseOctaveOptions;
