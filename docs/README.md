The library contains React components for rendering musical notation and the logic required, such as determining whether to write a sharp, flat, or natural next to a note based on pitch and key signature, where to insert rests between notes, etc. It also converts musical pitches into audio frequencies and sends / listens to MIDI messages. The React UI optionally highlights the notes as they are played by intercepting these MIDI messages.

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