import React from 'react';
import { Notes } from '../types';

import './ExerciseNoteOptions.scss';

export class ExerciseNoteOptions extends React.Component {
    render() {
        return (
            <div className="exercise-options-note">
                <h3>Exclude Notes</h3>
                {Notes.map((note) => (<div>
                    <input type="checkbox" id={`exclude-${note}`} />
                    <label htmlFor={`exclude-${note}`}>{note}</label>
                </div>))}
            </div>
        );
    }
}

export default ExerciseNoteOptions;
