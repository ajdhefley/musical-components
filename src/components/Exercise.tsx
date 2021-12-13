import './Exercise.scss';
import StaffMeasure from './StaffMeasure';

function Exercise() {
    return (
        <div>
            <StaffMeasure clef="bass" sharps={[3,0,4,1]} beatsPerMeasure={4} beatDuration={0.25} />
            <StaffMeasure clef="treble" flats={[6,2,5,1,4,0]} beatsPerMeasure={3} beatDuration={0.125} />
            <StaffMeasure clef="bass" flats={[6,2,5,1,4]} beatsPerMeasure={2} beatDuration={0.5} />
        </div>
    );
}

export default Exercise;
