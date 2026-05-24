import { MusicStaffPlacementLogic } from '../src/lib/core/MusicStaffPlacementLogic'
import { Clef } from '../src/lib/core/models/Clef'
import { Note } from '../src/lib/core/models/Note'
import { NotationType } from '../src/lib/core/models/NotationType'
import { Pitch } from '../src/lib/core/models/Pitch'

const configurePlacement = (beatsPerMeasure: number, beatDuration: NotationType) => {
    return MusicStaffPlacementLogic.instance.configure({
        accidentalSize: 12,
        noteSize: 14,
        noteSpacing: 20,
        spaceHeight: 12,
        defaultStemHeight: 30,
        clef: Clef.TrebleClef,
        beatsPerMeasure,
        beatDuration
    })
}

describe('MusicStaffPlacementLogic.getTies', () => {
    it('creates a tie between consecutive same-pitch notes when tieToNext is true', () => {
        const placement = configurePlacement(4, NotationType.Quarter)
        const notations = [
            new Note(NotationType.Quarter, Pitch.C4, 0, 0, true),
            new Note(NotationType.Quarter, Pitch.C4, 1 / 4)
        ]

        const ties = placement.getTies(notations)

        expect(ties).toHaveLength(1)
        expect(ties[0].width).toBeGreaterThan(0)
        expect(ties[0].flip).toBe(false)
    })

    it('does not create a tie when the next note has a different pitch', () => {
        const placement = configurePlacement(4, NotationType.Quarter)
        const notations = [
            new Note(NotationType.Quarter, Pitch.C4, 0, 0, true),
            new Note(NotationType.Quarter, Pitch.D4, 1 / 4)
        ]

        const ties = placement.getTies(notations)

        expect(ties).toHaveLength(0)
    })
})

describe('MusicStaffPlacementLogic.getHorizontalBeams', () => {
    it('beams four eighth notes together in 4/4', () => {
        const placement = configurePlacement(4, NotationType.Quarter)
        const notations = [
            new Note(NotationType.Eighth, Pitch.C4, 0),
            new Note(NotationType.Eighth, Pitch.D4, 1 / 8),
            new Note(NotationType.Eighth, Pitch.E4, 2 / 8),
            new Note(NotationType.Eighth, Pitch.F4, 3 / 8)
        ]

        const beams = placement.getHorizontalBeams(notations)

        expect(beams).toHaveLength(1)
        notations.forEach((note) => expect(note.isBeamed).toBe(true))
    })

    it('breaks beaming at dotted notes', () => {
        const placement = configurePlacement(4, NotationType.Quarter)
        const dotted = new Note(NotationType.Eighth, Pitch.C4, 0, 1)
        const next = new Note(NotationType.Eighth, Pitch.D4, 3 / 16)

        const beams = placement.getHorizontalBeams([dotted, next])

        expect(beams).toHaveLength(0)
        expect(dotted.isBeamed).toBe(false)
        expect(next.isBeamed).toBe(false)
    })

    it('groups eighth notes by three in 6/8 compound time', () => {
        const placement = configurePlacement(6, NotationType.Eighth)
        const notations = [
            new Note(NotationType.Eighth, Pitch.C4, 0),
            new Note(NotationType.Eighth, Pitch.D4, 1 / 8),
            new Note(NotationType.Eighth, Pitch.E4, 2 / 8),
            new Note(NotationType.Eighth, Pitch.F4, 3 / 8),
            new Note(NotationType.Eighth, Pitch.G4, 4 / 8),
            new Note(NotationType.Eighth, Pitch.A4, 5 / 8)
        ]

        const beams = placement.getHorizontalBeams(notations)

        expect(beams).toHaveLength(2)
        notations.forEach((note) => expect(note.isBeamed).toBe(true))
    })

    it('groups eighth notes as 3+2 in 5/8', () => {
        const placement = configurePlacement(5, NotationType.Eighth)
        const notations = [
            new Note(NotationType.Eighth, Pitch.C4, 0),
            new Note(NotationType.Eighth, Pitch.D4, 1 / 8),
            new Note(NotationType.Eighth, Pitch.E4, 2 / 8),
            new Note(NotationType.Eighth, Pitch.F4, 3 / 8),
            new Note(NotationType.Eighth, Pitch.G4, 4 / 8)
        ]

        const beams = placement.getHorizontalBeams(notations)

        expect(beams).toHaveLength(2)
        notations.forEach((note) => expect(note.isBeamed).toBe(true))
    })

    it('renders double beams for sixteenth-note groups', () => {
        const placement = configurePlacement(4, NotationType.Quarter)
        const notations = [
            new Note(NotationType.Sixteenth, Pitch.C4, 0),
            new Note(NotationType.Sixteenth, Pitch.D4, 1 / 16),
            new Note(NotationType.Sixteenth, Pitch.E4, 2 / 16),
            new Note(NotationType.Sixteenth, Pitch.F4, 3 / 16)
        ]

        const beams = placement.getHorizontalBeams(notations)

        expect(beams).toHaveLength(2)
    })
})
