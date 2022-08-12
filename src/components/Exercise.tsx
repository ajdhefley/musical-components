import './Exercise.scss';
import Staff from '../lib/components/Staff';
import { ClefType } from '../lib/types';

function Exercise() {
    return (
        <div>
            {/* <Staff clef="treble" sharps={SharpKeys.EMajor} beatsPerMeasure={4} beatDuration={0.25} /> */}
            <Staff clef={ClefType.Treble} beatsPerMeasure={4} beatDuration={0.25} /> 
        </div>
    );
}

export default Exercise;
