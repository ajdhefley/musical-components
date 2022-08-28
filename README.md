## Overview

Contains a core library that renders music staffs from scratch using React, according to musical rules.

The primary React component is `<Staff />`, with the following props:

| Name | Description |
| :--- | :--- |
| `clef` | Either `TrebleClef` or `BassClef` |
| `beatsPerMeasure` | Number of beats per measure (top of time signature) |
| `beatDuration` | Inherent beat value (bottom of time signature) |
| `beatsPerMinute` | Determines speed of audio playback |
| `sharps`* | Notes that are sharped in the key signature |
| `flats`* | Notes that are flatted in the key signature |

*optional

### Example

```
<Staff
    clef={Clef.TrebleClef}
    beatsPerMeasure={5}
    beatDuration={NotationType.Eighth}
    beatsPerMinute={120}
    sharps={SharpKeys.DMajor}
/>
```

<p align="center">
  <img src="https://github.com/ajdhefley/music-exercises-client/blob/master/docs/doc_example.png" height="200" />
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

## More examples

<p align="center">
  <img src="https://github.com/ajdhefley/music-exercises-client/blob/master/docs/doc_clefs_keysignature.png" height="300" />
  <br />
  <sub><b>Dynamically renders key signatures and notes by clef.</b> In this example, both measures are in the key of A Major, with sharps rendered in different positions depending on the clef.</sub>
<p>

---

<p align="center">
  <img src="https://github.com/ajdhefley/music-exercises-client/blob/master/docs/doc_stems_timesignature.png" height="300" />
  <br />
  <sub><b>Ties notes together via beams.</b> Notice the 3/4 and 6/8 measures have the same number of notes per measure, but they are grouped differently, according to the time signature.</sub>
<p>


---

<p align="center">
  <img src="https://github.com/ajdhefley/music-exercises-client/blob/master/docs/doc_accidentals.png" height="300" />
  <br />
  <sub><b>Dynamically renders accidentals, corresponding to key signature.</b> The notes C, Bb, G, B, G, F appear as the following in the key of F Major, for example.</sub>
<p>
