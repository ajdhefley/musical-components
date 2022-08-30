## Overview

Contains a core library that renders music staffs from scratch using React, according to musical rules.

## Core Library

Core reusable musical components and services are contained under `src/lib`. The services cover things like converting musical pitches into audio frequencies, sending and listening to MIDI messages, and music writing logic (such as determining whether to write an accidental next to a note based on its pitch and the overall key signature.)

The UI components making use of these services are written in React. They handle music notation logic internally, dynamically rendering the staff, clef, time/key signatures, notes, and accidentals, dividing them into measures accordingly, based on input data. The library is also capable of audio playback, taking the same data used to render the UI, and converting into MIDI messages.

The primary React component is `<Staff />`, with the following props:

| Name | Description |
| :--- | :--- |
| `clef` | Either `TrebleClef` or `BassClef` |
| `beatsPerMeasure` | Number of beats per measure (top of time signature) |
| `beatDuration` | Inherent beat value (bottom of time signature) |
| `beatsPerMinute`* | Determines speed of audio playback |
| `sharps`* | Notes that are sharped in the key signature |
| `flats`* | Notes that are flatted in the key signature |

*optional

### Examples

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
  <img src="https://github.com/ajdhefley/music-exercises-client/blob/master/docs/doc_example.png" height="200" />
<p>

---

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


---

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
  <img src="https://github.com/ajdhefley/music-exercises-client/blob/master/docs/doc_accidentals.png" height="300" />
<p>

## Setup

```bash
$ npm install
```

## Running the app

```bash
$ npm run start
```

## Test

```bash
$ npm run test
```
