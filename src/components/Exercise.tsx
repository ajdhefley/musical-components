import React from 'react';
import { TimeSignatureModel } from '../models';

import './Exercise.scss';
import StaffMeasure from './StaffMeasure';

export class Exercise extends React.Component {
    render() {
        return (
            <div>
                <StaffMeasure clef="treble" timeSignature={new TimeSignatureModel(4, 0.25)} />
                <StaffMeasure clef="treble" timeSignature={new TimeSignatureModel(4, 0.25)} />
            </div>
        );
    }
}

export default Exercise;
