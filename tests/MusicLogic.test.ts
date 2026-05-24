import { MusicLogic } from '../src/lib/core/MusicLogic'
import { Note } from '../src/lib/core/models/Note'
import { NotationType } from '../src/lib/core/models/NotationType'
import { Pitch } from '../src/lib/core/models/Pitch'
import { Rest } from '../src/lib/core/models/Rest'

describe('MusicLogic.decomposeIntoRests', () => {
    it('decomposes an exact undotted duration into a single rest', () => {
        const result = MusicLogic.decomposeIntoRests(1 / 4, 0)
        expect(result).toHaveLength(1)
        expect(result[0].type).toBe(NotationType.Quarter)
        expect(result[0].dotCount).toBe(0)
    })

    it('decomposes a dotted duration into a single dotted rest', () => {
        const result = MusicLogic.decomposeIntoRests(3 / 8, 0)
        expect(result).toHaveLength(1)
        expect(result[0].type).toBe(NotationType.Quarter)
        expect(result[0].dotCount).toBe(1)
    })

    it('decomposes a mixed duration into multiple rests', () => {
        const result = MusicLogic.decomposeIntoRests(7 / 16, 0)
        expect(result).toHaveLength(2)
        expect(result[0].type).toBe(NotationType.Quarter)
        expect(result[0].dotCount).toBe(1)
        expect(result[1].type).toBe(NotationType.Sixteenth)
        expect(result[1].dotCount).toBe(0)
    })
})

describe('MusicLogic.addNotations', () => {
    it('fills a gap with a dotted rest when possible', () => {
        const notations = MusicLogic.addNotations([], [
            new Note(NotationType.Quarter, Pitch.C4, 0),
            new Note(NotationType.Quarter, Pitch.G4, 5 / 8)
        ])

        // Gap = 5/8 - 1/4 = 3/8 = dotted quarter rest
        expect(notations).toHaveLength(3)
        expect(notations[1]).toBeInstanceOf(Rest)
        expect(notations[1].type).toBe(NotationType.Quarter)
        expect(notations[1].dotCount).toBe(1)
        expect(notations[1].startBeat).toBeCloseTo(1 / 4)
        expect(notations[2].startBeat).toBeCloseTo(5 / 8)
    })

    it('decomposes larger gaps into multiple rests', () => {
        const notations = MusicLogic.addNotations([], [
            new Note(NotationType.Quarter, Pitch.C4, 0),
            new Note(NotationType.Quarter, Pitch.G4, 15 / 16)
        ])

        // Gap = 15/16 - 1/4 = 11/16 = half rest + dotted eighth rest
        expect(notations).toHaveLength(4)
        expect(notations[1]).toBeInstanceOf(Rest)
        expect(notations[2]).toBeInstanceOf(Rest)
        expect(notations[1].type).toBe(NotationType.Half)
        expect(notations[1].dotCount).toBe(0)
        expect(notations[2].type).toBe(NotationType.Eighth)
        expect(notations[2].dotCount).toBe(1)
        expect(notations[3].startBeat).toBeCloseTo(15 / 16)
    })
})