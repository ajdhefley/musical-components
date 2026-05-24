import { deserializeScore, serializeScore } from '../src/lib/core/Score'
import { Chord } from '../src/lib/core/models/Chord'
import { Clef } from '../src/lib/core/models/Clef'
import { NaturalNote } from '../src/lib/core/models/NaturalNote'
import { NotationType } from '../src/lib/core/models/NotationType'
import { Note } from '../src/lib/core/models/Note'
import { Pitch } from '../src/lib/core/models/Pitch'
import { Rest } from '../src/lib/core/models/Rest'

describe('Score serialization', () => {
    it('round-trips multiple staves, voices, and chord notation', () => {
        const source = {
            beatsPerMeasure: 4,
            beatDuration: NotationType.Quarter,
            staves: [
                {
                    id: 'treble',
                    clef: Clef.TrebleClef,
                    sharps: [NaturalNote.F],
                    voices: [
                        {
                            id: 'melody',
                            notations: [
                                new Note(NotationType.Quarter, Pitch.C4, 0),
                                new Chord(NotationType.Quarter, [Pitch.C4, Pitch.E4, Pitch.G4], 1 / 4),
                                new Rest(NotationType.Quarter, 1 / 2)
                            ]
                        }
                    ]
                },
                {
                    id: 'bass',
                    clef: Clef.BassClef,
                    voices: [
                        {
                            id: 'bassline',
                            notations: [
                                new Note(NotationType.Half, Pitch.C3, 0),
                                new Note(NotationType.Half, Pitch.G2, 1 / 2)
                            ]
                        },
                        {
                            id: 'pedal',
                            notations: [
                                new Rest(NotationType.Whole, 0)
                            ]
                        }
                    ]
                }
            ]
        }

        const serialized = serializeScore(source)
        const restored = deserializeScore(serialized)

        expect(restored.beatsPerMeasure).toBe(4)
        expect(restored.beatDuration).toBe(NotationType.Quarter)
        expect(restored.staves).toHaveLength(2)
        expect(restored.staves[0].voices).toHaveLength(1)
        expect(restored.staves[1].voices).toHaveLength(2)

        const chordNotation = restored.staves[0].voices[0].notations[1] as Chord
        expect(chordNotation).toBeInstanceOf(Chord)
        expect(chordNotation.pitches).toHaveLength(3)
        expect(chordNotation.startBeat).toBe(1 / 4)
    })

    it('throws for unsupported score schema version', () => {
        let threw = false

        try {
            deserializeScore(JSON.stringify({
                version: 2,
                beatsPerMeasure: 4,
                beatDuration: 'quarter',
                staves: []
            }))
        } catch {
            threw = true
        }

        expect(threw).toBe(true)
    })
})
