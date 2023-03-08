<b>Dynamically renders accidentals, corresponding to key signature.</b> Notice the same notes appear differently in the following staffs.

<b>Code:</b>

```
const notes = [
    new Note(NotationType.Eighth, Pitch.C4),
    new Note(NotationType.Eighth, Pitch.As3),
    new Note(NotationType.Eighth, Pitch.G3),
    new Note(NotationType.Eighth, Pitch.B3),
    new Note(NotationType.Quarter, Pitch.Fs3),
    new Note(NotationType.Quarter, Pitch.F3)
]
    
...
    
<Staff initialNotations={notes} beatsPerMeasure={4} beatDuration={NotationType.Quarter} clef={Clef.TrebleClef} />
<Staff initialNotations={notes} beatsPerMeasure={4} beatDuration={NotationType.Quarter} clef={Clef.TrebleClef} flats={FlatKeys.FMajor} />
```

<b>Result:</b>

<p align="center">
  <img src="https://github.com/ajdhefley/music-exercises-client/blob/master/docs/images/doc_accidentals.png" height="300" />
<p>