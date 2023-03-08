<b>Dynamically renders clefs, key signatures, time signatures, and notes according to their beat value and pitch.</b> The eighth notes are not tied, under this time signature, because they each count as a whole beat. The notes also do not have sharps written next to them, because the key signature already contains C#.

<b>Code:</b>

```
const notes = [
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Cs4),
    new Note(NotationType.Eighth, Pitch.Cs4)
]

...

<Staff
    initialNotations={notes}
    clef={Clef.TrebleClef}
    beatsPerMeasure={5}
    beatDuration={NotationType.Eighth}
    sharps={SharpKeys.DMajor}
/>
```

<b>Result:</b>

<p align="center">
  <img src="https://github.com/ajdhefley/music-exercises-client/blob/master/docs/images/doc_example.png" height="200" />
<p>