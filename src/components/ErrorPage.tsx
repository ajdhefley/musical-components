import React from 'react'

import './ErrorPage.scss'
import Staff from '../lib/components/Staff'
import { Clef, Notation, NotationType, Note, Pitch, SharpKeys } from '../lib/core/models'

function ErrorPage (): React.ReactElement {
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
        <div className="content-wrapper">
            {/* <p className="introText">An unknown error occured.</p>
            <Link to={App.Routes.ExerciseSelections}>Go To Exercise Selection</Link> */}
            <Staff
                clef={Clef.BassClef}
                beatsPerMeasure={3}
                beatDuration={NotationType.Quarter}
                beatsPerMinute={120}
                initialNotations={notes}
                sharps={SharpKeys.AMajor}
            />
        </div>
    )
}

export default ErrorPage
