import React from 'react';
import ReactDOM from 'react-dom';
import { Note, NotationType, Pitch, Clef, FlatKeys, Staff } from 'musical-components';

const notes = [

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
        <Staff {...props} beatsPerMeasure={3} />
        <Staff {...props} beatsPerMeasure={6} beatDuration={NotationType.Eighth} />
    </React.StrictMode>,
    document.getElementById('root')
);
