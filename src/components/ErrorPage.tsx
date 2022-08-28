import React from 'react'

import './ErrorPage.scss'
import Staff from '../lib/components/Staff'
import { Clef, Duration, Pitch, SharpKeys } from '../lib/core/enums'
import { NotationModel, NoteModel } from '../lib/core/models'

function ErrorPage (): React.ReactElement {
    const notes: NotationModel[] = [
        new NoteModel(Pitch.E3, Duration.Eighth),
        new NoteModel(Pitch.F3, Duration.Eighth),
        new NoteModel(Pitch.D3, Duration.Eighth),
        new NoteModel(Pitch.F3, Duration.Eighth),
        new NoteModel(Pitch.E3, Duration.Eighth),
        new NoteModel(Pitch.D3, Duration.Eighth),
        new NoteModel(Pitch.C3, Duration.Quarter)
    ]

    return (
        <div className="content-wrapper">
            {/* <p className="introText">An unknown error occured.</p>
            <Link to={App.Routes.ExerciseSelections}>Go To Exercise Selection</Link> */}
            <Staff
                clef={Clef.Bass}
                beatsPerMeasure={3}
                beatDuration={Duration.Quarter}
                beatsPerMinute={120}
                initialNotations={notes}
                sharps={SharpKeys.AMajor}
            />
        </div>
    )
}

export default ErrorPage
