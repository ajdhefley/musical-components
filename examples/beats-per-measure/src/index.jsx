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
    new Note(NotationType.Eighth, Pitch.B3),
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.E4),
    new Note(NotationType.Eighth, Pitch.Ds4),
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Fs3),
    new Note(NotationType.Eighth, Pitch.Fs3),
    new Note(NotationType.Eighth, Pitch.Ds4),
    new Note(NotationType.Eighth, Pitch.D4),
    new Note(NotationType.Eighth, Pitch.Ds4),
    new Note(NotationType.Eighth, Pitch.Ds4)
]

const props = {
    clef: Clef.TrebleClef,
    beatDuration: NotationType.Quarter,
    sharps: SharpKeys.EMajor,
    initialNotations: notes
}

ReactDOM.render(
    <React.StrictMode>
        <Staff {...props} beatsPerMeasure={4} />
        <br /><br /><br /><br />
        <Staff {...props} beatsPerMeasure={3} />
        <br /><br /><br /><br />
        <Staff {...props} beatsPerMeasure={6} beatDuration={NotationType.Eighth} />
    </React.StrictMode>,
    document.getElementById('root')
)
