import React from 'react'
import ReactDOM from 'react-dom'
import { Note, NotationType, Pitch, Clef, Staff, NaturalNote } from 'musical-components'

export const SharpKeys = {
    GMajor: [NaturalNote.F],
    DMajor: [NaturalNote.F, NaturalNote.C],
    AMajor: [NaturalNote.F, NaturalNote.C, NaturalNote.G],
    EMajor: [NaturalNote.F, NaturalNote.C, NaturalNote.G, NaturalNote.D],
    BMajor: [NaturalNote.F, NaturalNote.C, NaturalNote.G, NaturalNote.D, NaturalNote.A]
}

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
