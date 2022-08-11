import { FlatKeys, SharpKeys } from '../types';
import './Exercise.scss';
import Staff from './Staff';

function Exercise() {
    return (
        <div>
            {/* <Staff clef="treble" sharps={SharpKeys.EMajor} beatsPerMeasure={4} beatDuration={0.25} /> */}
            <Staff clef="treble" beatsPerMeasure={4} beatDuration={0.25} /> 
        </div>
    );
}

export default Exercise;
