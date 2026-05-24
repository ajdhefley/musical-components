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

To render your music in the browser, create a `Score` and pass it to `ScoreView`.

```
import { NotationType, Clef, ScoreView } from 'musical-components'

const score = {
  beatsPerMeasure: 4,
  beatDuration: NotationType.Quarter,
  staves: [
    {
      clef: Clef.TrebleClef,
      voices: [{ notations: notes }]
    }
  ]
}

<ScoreView score={score} />
```

Result:

<p align="center">
  <img src="https://github.com/ajdhefley/musical-components/blob/main/docs/images/doc_main_example.png" height="200" />
<p>

### Specifying Key Signature

To create a staff in E Major, set `sharps` on the staff inside your score:

```
import { NaturalNote } from 'musical-components'

const EMajor = [NaturalNote.F, NaturalNote.C, NaturalNote.G, NaturalNote.D]

const score = {
  ...,
  staves: [{ clef: Clef.TrebleClef, sharps: EMajor, voices: [{ notations: notes }] }]
}
```

You can see an example setting a key signature [here](https://github.com/ajdhefley/musical-components/tree/main/examples/beats-per-measure).

## Score JSON

The library exposes a versioned score schema for persistence and interchange.

Use `Score` as the canonical model for both single-staff and multi-staff content:

```ts
import {
  Clef,
  Note,
  NotationType,
  Pitch,
  serializeScore,
  deserializeScore,
  type Score
} from 'musical-components'

const score: Score = {
  beatsPerMeasure: 4,
  beatDuration: NotationType.Quarter,
  staves: [
    {
      id: 'treble',
      clef: Clef.TrebleClef,
      voices: [
        {
          id: 'melody',
          notations: [
            new Note(NotationType.Eighth, Pitch.C4, 0, 1, true),
            new Note(NotationType.Eighth, Pitch.C4, 3 / 16)
          ]
        }
      ]
    }
  ]
}

const json = serializeScore(score)
const restored = deserializeScore(json)
```

Playback also flows through score-level APIs:

```ts
import { ScorePlayback } from 'musical-components'

const playback = new ScorePlayback(score.beatsPerMeasure, 80)
playback.setScore(score)
```

`ScoreDocument` remains available as a legacy single-staff compatibility format:

```ts
import {
  Clef,
  Note,
  NotationType,
  Pitch,
  serializeScoreDocument,
  deserializeScoreDocument,
  type ScoreDocument
} from 'musical-components'

const document: ScoreDocument = {
  beatsPerMeasure: 4,
  beatDuration: NotationType.Quarter,
  clef: Clef.TrebleClef,
  notations: [
    new Note(NotationType.Eighth, Pitch.C4, 0, 1, true),
    new Note(NotationType.Eighth, Pitch.C4, 3 / 16)
  ]
}

const json = serializeScoreDocument(document)
const restored = deserializeScoreDocument(json)
```

The serialized JSON is versioned (`version: 1`) so the schema can evolve without silently breaking stored data.

For MusicXML interchange on single-staff documents, use the adapter helpers:

```ts
import {
  exportScoreDocumentToMusicXml,
  importScoreDocumentFromMusicXml
} from 'musical-components'

const xml = exportScoreDocumentToMusicXml(document)
const imported = importScoreDocumentFromMusicXml(xml)
```

## Examples

All examples can be found [here](https://github.com/ajdhefley/musical-components/tree/main/examples).

## Documentation

In-depth documentation can be found [here](https://ajdhefley.github.io/musical-components-docs/).

## License

This project is protected under the [MIT License](https://github.com/ajdhefley/musical-components/blob/main/LICENSE).