<b>Dynamically ties notes together via beams.</b> Notice the 3/4 and 6/8 staffs have the same number of notes per measure, but they are grouped differently, according to the time signature.

<b>Code:</b>

```
const props = {
    clef: Clef.TrebleClef,
    beatDuration: NotationType.Quarter,
    sharps: SharpKeys.EMajor,
    initialNotations: notes
}

...

<Staff {...props} beatsPerMeasure={4} />
<Staff {...props} beatsPerMeasure={3} />
<Staff {...props} beatsPerMeasure={6} beatDuration={NotationType.Eighth} />
```

<b>Result:</b>

<p align="center">
  <img src="https://github.com/ajdhefley/music-exercises-client/blob/master/docs/doc_stems_timesignature.png" height="300" />
<p>