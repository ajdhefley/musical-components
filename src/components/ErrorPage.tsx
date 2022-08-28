import React from 'react'

import './ErrorPage.scss'
import Staff from '../lib/components/Staff'
import { Clef, FlatKeys, Notation, NotationType, Note, Pitch, SharpKeys } from '../lib/core/models'

function ErrorPage (): React.ReactElement {
    const notes: Notation[] = [
        new Note(NotationType.Eighth, Pitch.Cs4),
        new Note(NotationType.Eighth, Pitch.Cs4),
        new Note(NotationType.Eighth, Pitch.Cs4),
        new Note(NotationType.Eighth, Pitch.Cs4),
        new Note(NotationType.Eighth, Pitch.Cs4)
    ]

    return (
        <div className="content-wrapper">
            {/* <p className="introText">An unknown error occured.</p>
            <Link to={App.Routes.ExerciseSelections}>Go To Exercise Selection</Link> */}
            <Staff
                clef={Clef.TrebleClef}
                beatsPerMeasure={5}
                beatDuration={NotationType.Eighth}
                beatsPerMinute={120}
                initialNotations={notes}
                sharps={SharpKeys.DMajor}
            />

        </div>
    )
}

export default ErrorPage
