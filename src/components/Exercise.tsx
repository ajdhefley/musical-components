import './Exercise.scss';
import Staff from '../lib/components/Staff';
import { ClefType, Duration } from '../lib/types';

function Exercise() {
    return (
        <div>
            {/* <Staff clef="treble" sharps={SharpKeys.EMajor} beatsPerMeasure={4} beatDuration={0.25} /> */}
            <Staff clef={ClefType.Treble} beatsPerMeasure={4} beatDuration={Duration.Quarter} /> 
        </div>
    );
}

export default Exercise;
