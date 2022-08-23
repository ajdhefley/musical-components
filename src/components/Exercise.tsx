import './Exercise.scss';
import Staff from '../lib/components/Staff';
import { ClefType, Duration, SharpKeys } from '../lib/types';

function Exercise() {
    return (
        <div>
            {/* <Staff clef="treble" sharps={SharpKeys.EMajor} beatsPerMeasure={4} beatDuration={0.25} /> */}
            <Staff clef={ClefType.Treble} sharps={SharpKeys.AMajor} beatsPerMeasure={4} beatDuration={Duration.Quarter} beatsPerMinute={120} /> 
        </div>
    );
}

export default Exercise;
