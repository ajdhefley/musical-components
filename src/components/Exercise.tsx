import './Exercise.scss';
import StaffMeasure from './StaffMeasure';

function Exercise() {
    return (
        <div>
            <StaffMeasure clef="treble" sharps={[3,0,4,1]} />
            <StaffMeasure clef="treble" flats={[6,2,5,1,4,0]} />
            <StaffMeasure clef="treble" flats={[6,2,5,1,4]} />
        </div>
    );
}

export default Exercise;
