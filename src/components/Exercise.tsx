import React from 'react'

import './Exercise.scss'
import Staff from '../lib/components/Staff'
import { Clef, Duration, Pitch } from '../lib/types'
import { NotationModel, NoteModel } from '../lib/models'

function Exercise (): React.ReactElement {
    const notes: NotationModel[] = [
        new NoteModel(Pitch.A3, Duration.Eighth),
        new NoteModel(Pitch.B3, Duration.Eighth),
        new NoteModel(Pitch.C4, Duration.Eighth),
        new NoteModel(Pitch.D4, Duration.Eighth),
        new NoteModel(Pitch.E4, Duration.Sixteenth),
        new NoteModel(Pitch.F4, Duration.Sixteenth),
        new NoteModel(Pitch.E4, Duration.ThirtySecond),
        new NoteModel(Pitch.F4, Duration.ThirtySecond),
        new NoteModel(Pitch.E4, Duration.ThirtySecond),
        new NoteModel(Pitch.F4, Duration.ThirtySecond)
    ]

    return (
        <div>
            {/* <Staff clef="treble" sharps={SharpKeys.EMajor} beatsPerMeasure={4} beatDuration={0.25} /> */}
            <Staff
                clef={Clef.Treble}
                beatsPerMeasure={4}
                beatDuration={Duration.Quarter}
                beatsPerMinute={120}
                initialNotations={notes}
            />
        </div>
    )
}

export default Exercise
