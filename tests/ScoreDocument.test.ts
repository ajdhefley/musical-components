import { deserializeScoreDocument, serializeScoreDocument } from '../src/lib/core/ScoreDocument'
import { Clef } from '../src/lib/core/models/Clef'
import { NaturalNote } from '../src/lib/core/models/NaturalNote'
import { NotationType } from '../src/lib/core/models/NotationType'
import { Note } from '../src/lib/core/models/Note'
import { Pitch } from '../src/lib/core/models/Pitch'
import { Rest } from '../src/lib/core/models/Rest'

describe('ScoreDocument serialization', () => {
    it('serializes and deserializes score document data', () => {
        const source = {
            beatsPerMeasure: 4,
            beatDuration: NotationType.Quarter,
            clef: Clef.TrebleClef,
            sharps: [NaturalNote.F, NaturalNote.C],
            notations: [
                new Note(NotationType.Eighth, Pitch.C4, 0, 1, true),
                new Note(NotationType.Eighth, Pitch.C4, 3 / 16),
                new Rest(NotationType.Quarter, 1 / 4)
            ]
        }

        const serialized = serializeScoreDocument(source)
        const restored = deserializeScoreDocument(serialized)

        expect(restored.beatsPerMeasure).toBe(4)
        expect(restored.beatDuration).toBe(NotationType.Quarter)
        expect(restored.clef).toBe(Clef.TrebleClef)
        expect(restored.sharps?.length).toBe(2)
        expect(restored.notations).toHaveLength(3)

        const first = restored.notations[0] as Note
        const third = restored.notations[2] as Rest

        expect(first).toBeInstanceOf(Note)
        expect(first.dotCount).toBe(1)
        expect(first.tieToNext).toBe(true)
        expect(first.pitch).toBe(Pitch.C4)
        expect(third).toBeInstanceOf(Rest)
        expect(third.type).toBe(NotationType.Quarter)
    })

    it('throws for unsupported score version', () => {
        let threw = false

        try {
            deserializeScoreDocument(JSON.stringify({
                version: 2,
                beatsPerMeasure: 4,
                beatDuration: 'quarter',
                clef: 'treble',
                notations: []
            }))
        } catch {
            threw = true
        }

        expect(threw).toBe(true)
    })

    it('throws for invalid key signature notes', () => {
        let threw = false

        try {
            deserializeScoreDocument(JSON.stringify({
                version: 1,
                beatsPerMeasure: 4,
                beatDuration: 'quarter',
                clef: 'treble',
                sharps: [1],
                notations: []
            }))
        } catch {
            threw = true
        }

        expect(threw).toBe(true)
    })
})
