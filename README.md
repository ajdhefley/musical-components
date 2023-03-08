# musical-components &nbsp; ![GitHub Workflow Status](https://github.com/ajdhefley/musical-components/actions/workflows/main.yml/badge.svg) &nbsp; [![Node version](https://img.shields.io/npm/v/musical-components.svg?style=flat)](http://nodejs.org/download/)

React/MIDI library that renders and plays musical notation in all major browsers.

## Install

```bash
$ npm install musical-components --save
```

## Usage

Instantiate notes (as well as rests), specifying the duration and pitch.

```
import { Note, NotationType, Pitch } from 'musical-components'

...

const notes = [
    new Note(NotationType.Eighth, Pitch.A3),
    new Note(NotationType.Eighth, Pitch.B3),
    new Note(NotationType.Eighth, Pitch.C4)
]
```

Pass your note array into the Staff element's *initialNotations* prop within your React app, providing the clef, key signature, and time signature as additional props.

```
import { NotationType, Clef, Staff } from 'musical-components'

<Staff initialNotations={notes} beatsPerMeasure={4} beatDuration={NotationType.Quarter} clef={Clef.TrebleClef} />
```

Result:

<p align="center">
  <img src="https://github.com/ajdhefley/musical-components/blob/main/docs/images/doc_main_example.png" height="200" />
<p>

### Specifying Key Signature

The Staff component allows you to specify your own sharps or flats for the key signature. To create a staff in E Major, for example, pass an array of the the four sharped notes into the *sharps* prop:

```
import { NaturalNote, Staff } from 'musical-components'

const EMajor = [NaturalNote.F, NaturalNote.C, NaturalNote.G, NaturalNote.D]

<Staff ... sharps={EMajor} />
```

See example including key signature usage [here](https://github.com/ajdhefley/musical-components/tree/main/examples/beats-per-measure).

## Core Library

The library contains React components for rendering musical notation and the core logic required, such as determining whether to write an sharp, flat, or natural next to a note based on its pitch and the staff's key signature. It also converts musical pitches into audio frequencies and sends / listens to MIDI messages. The React UI optionally highlights the notes as they are played by intercepting these MIDI messages.

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

## Examples

See examples [here](https://github.com/ajdhefley/musical-components/tree/main/examples).
