import React from 'react'
import ReactDOM from 'react-dom'
import { Note, NotationType, Pitch, Clef, Staff, StaffPlayback } from 'musical-components'

const notes = [
    new Note(NotationType.Eighth, Pitch.C4),
    new Note(NotationType.Eighth, Pitch.C4),
    new Note(NotationType.Eighth, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.A4),
    new Note(NotationType.Eighth, Pitch.A4),
    new Note(NotationType.Quarter, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.F4),
    new Note(NotationType.Eighth, Pitch.F4),
    new Note(NotationType.Eighth, Pitch.E4),
    new Note(NotationType.Eighth, Pitch.E4),
    new Note(NotationType.Eighth, Pitch.D4),
    new Note(NotationType.Eighth, Pitch.D4),
    new Note(NotationType.Quarter, Pitch.C4),
    new Note(NotationType.Eighth, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.F4),
    new Note(NotationType.Eighth, Pitch.F4),
    new Note(NotationType.Eighth, Pitch.E4),
    new Note(NotationType.Eighth, Pitch.E4),
    new Note(NotationType.Quarter, Pitch.D4),
    new Note(NotationType.Eighth, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.F4),
    new Note(NotationType.Eighth, Pitch.F4),
    new Note(NotationType.Eighth, Pitch.E4),
    new Note(NotationType.Eighth, Pitch.E4),
    new Note(NotationType.Quarter, Pitch.D4),
    new Note(NotationType.Eighth, Pitch.C4),
    new Note(NotationType.Eighth, Pitch.C4),
    new Note(NotationType.Eighth, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.A4),
    new Note(NotationType.Eighth, Pitch.A4),
    new Note(NotationType.Quarter, Pitch.G4),
    new Note(NotationType.Eighth, Pitch.F4),
    new Note(NotationType.Eighth, Pitch.F4),
    new Note(NotationType.Eighth, Pitch.E4),
    new Note(NotationType.Eighth, Pitch.E4),
    new Note(NotationType.Eighth, Pitch.D4),
    new Note(NotationType.Eighth, Pitch.D4),
    new Note(NotationType.Quarter, Pitch.C4)
]

const beatsPerMeasure = 4
const beatsPerMinute = 70
const playback = new StaffPlayback(beatsPerMeasure, beatsPerMinute)

function play () {
    new AudioContext().resume()
    playback.togglePlayback()
}

ReactDOM.render(
    <React.StrictMode>
        <Staff
            initialNotations={notes}
            beatsPerMeasure={beatsPerMeasure}
            beatDuration={NotationType.Quarter}
            clef={Clef.TrebleClef}
            playback={playback}
        />
        <br /><br /><br /><br />
        <button onClick={play}>Click Me!</button>
    </React.StrictMode>,
    document.getElementById('root')
)
