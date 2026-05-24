import { NotationType } from '../src/lib/core/models/NotationType'
import { MusicLogic } from '../src/lib/core/MusicLogic'

describe('NotationType', () => {
    it('returns the exact singleton for an undotted duration', () => {
        expect(MusicLogic.getNotationTypeFromDuration(1 / 4)).toBe(NotationType.Quarter)
        expect(MusicLogic.getNotationTypeFromDuration(1 / 8)).toBe(NotationType.Eighth)
    })
})