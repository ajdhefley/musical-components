import React from 'react';
import ReactDOM from 'react-dom';
import { Note, NotationType, Pitch, Clef, FlatKeys, Staff } from 'musical-components';

const notes = [
    new Note(NotationType.Eighth, Pitch.C4),
    new Note(NotationType.Eighth, Pitch.As3),
    new Note(NotationType.Eighth, Pitch.G3),
    new Note(NotationType.Eighth, Pitch.B3),
    new Note(NotationType.Quarter, Pitch.Fs3),
    new Note(NotationType.Quarter, Pitch.F3)
]

ReactDOM.render(
    <React.StrictMode>
        <Staff initialNotations={notes} beatsPerMeasure={4} beatDuration={NotationType.Quarter} clef={Clef.TrebleClef} />
        <Staff initialNotations={notes} beatsPerMeasure={4} beatDuration={NotationType.Quarter} clef={Clef.TrebleClef} flats={FlatKeys.FMajor} />
    </React.StrictMode>,
    document.getElementById('root')
);
