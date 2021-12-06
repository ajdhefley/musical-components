import React from 'react';

import './ExerciseNoteOptions.scss';
import { Pitches } from '../types';

export class ExercisePitchOptions extends React.Component {
    render() {
        return (
            <div>
                {Pitches.map((pitch) => (<span>{pitch}</span>))}
            </div>
        );
    }
}

export default ExercisePitchOptions;
