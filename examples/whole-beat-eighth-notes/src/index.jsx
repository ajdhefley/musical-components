import React from 'react'
import ReactDOM from 'react-dom'
import { Note, NotationType, Pitch, Clef, SharpKeys, Staff } from 'musical-components'

const notes = [
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Cs4)
]

ReactDOM.render(
    <React.StrictMode>
        <Staff
            initialNotations={notes}
            clef={Clef.TrebleClef}
            beatsPerMeasure={5}
            beatDuration={NotationType.Eighth}
            sharps={SharpKeys.DMajor}
        />
    </React.StrictMode>,
    document.getElementById('root')
)
