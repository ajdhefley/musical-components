# musical-components &nbsp; ![GitHub Workflow Status](https://github.com/ajdhefley/musical-components/actions/workflows/main.yml/badge.svg) &nbsp; [![Node version](https://img.shields.io/npm/v/musical-components.svg?style=flat)](http://nodejs.org/download/)

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

## Examples

See examples [here](https://github.com/ajdhefley/musical-components/tree/main/examples).

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
