import React from 'react';
import { Notes } from '../types';

import './ExerciseNoteOptions.scss';

export class ExerciseNoteOptions extends React.Component {
    render() {
        return (
            <div>
                {Notes.map((note) => (<span>{note}</span>))}
            </div>
        );
    }
}

export default ExerciseNoteOptions;
