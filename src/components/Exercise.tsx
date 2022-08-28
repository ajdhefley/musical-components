import React from 'react'

import './Exercise.scss'
import Staff from '../lib/components/Staff'
import { Clef, Notation, NotationType, Note, Pitch } from '../lib/core/models'

function Exercise (): React.ReactElement {
    const notes: Notation[] = [
        new Note(NotationType.Eighth, Pitch.E3),
        new Note(NotationType.Eighth, Pitch.F3),
        new Note(NotationType.Eighth, Pitch.D3),
        new Note(NotationType.Eighth, Pitch.F3),
        new Note(NotationType.Eighth, Pitch.E3),
        new Note(NotationType.Eighth, Pitch.D3),
        new Note(NotationType.Eighth, Pitch.C3)
    ]

    return (
        <div>
            {/* <Staff clef="treble" sharps={SharpKeys.EMajor} beatsPerMeasure={4} beatDuration={0.25} /> */}
            <Staff
                clef={Clef.TrebleClef}
                beatsPerMeasure={4}
                beatDuration={NotationType.Quarter}
                beatsPerMinute={120}
                initialNotations={notes}
            />
        </div>
    )
}

export default Exercise
