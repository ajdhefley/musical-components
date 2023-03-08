# musical-components &nbsp; ![GitHub Workflow Status](https://github.com/ajdhefley/musical-components/actions/workflows/main.yml/badge.svg) &nbsp; [![Node version](https://img.shields.io/npm/v/musical-components.svg?style=flat)](http://nodejs.org/download/)

React/MIDI library that renders and plays musical notation in all major browsers.

## Getting Started

### Install

```bash
$ npm install musical-components --save
```

### Usage

Instantiate notes (as well as rests), specifying the duration and pitch.

```
import { Note, NotationType, Pitch } from 'musical-components'

const notes = [
    new Note(NotationType.Eighth, Pitch.A3),
    new Note(NotationType.Eighth, Pitch.B3),
    new Note(NotationType.Eighth, Pitch.C4)
]
```

To render your music in the browser, add a Staff component to your React appllication and pass the note array into the *initialNotations* prop, also providing the clef, key signature, and time signature as additional props.

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

You can see an example setting a key signature [here](https://github.com/ajdhefley/musical-components/tree/main/examples/beats-per-measure).

## Examples

All examples can be found [here](https://github.com/ajdhefley/musical-components/tree/main/examples).

## Documentation

In-depth documentation can be found [here](https://ajdhefley.github.io/musical-components-docs/).

## License

This project is protected under the [MIT License](https://github.com/ajdhefley/musical-components/blob/main/LICENSE).