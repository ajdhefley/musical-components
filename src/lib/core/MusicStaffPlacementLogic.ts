import { Clef, NaturalNote, Notation, NotationType, Note, Pitch, Rest } from '@lib/core/models'
import { MusicLogic } from '@lib/core/MusicLogic'

export class MusicStaffPlacementLogic {
    private readonly musicLogic: MusicLogic

    constructor (private readonly config: {
        accidentalSize: number
        noteSize: number
        noteSpacing: number
        spaceHeight: number
        defaultStemHeight: number
        clef: Clef
        sharps?: NaturalNote[]
        flats?: NaturalNote[]
        beatsPerMeasure: number
        beatDuration: NotationType
    }) {
        this.musicLogic = new MusicLogic({ ...config })
    }

    /**
     * Filters rests out of the list, with notes remaining.
     *
     * @param notations
     * @returns {Notation[]} Notes with calculated positions and accidentals.
     */
    public extractNotes (notations: Notation[]) {
        return notations?.filter((notation: Notation) => notation instanceof Note)
            .map((note: any) => {
                return {
                    model: note,
                    accidental: this.musicLogic.getAccidentalForPitch(note.pitch),
                    left: this.getNoteLeftPosition(notations, note),
                    bottom: this.getNoteBottomPosition(note.pitch)
                }
            })
    }

    /**
     * Filters note out of the list, with rests remaining.
     *
     * @param notations
     * @returns {Notation[]} Rests with calculated positions.
     */
    public extractRests (notations: Notation[]) {
        return notations?.filter((notation: Notation) => notation instanceof Rest)
            .map((rest: any) => {
                return {
                    model: rest,
                    left: this.getNoteLeftPosition(notations, rest)
                }
            })
    }

    public getNoteLeftPosition (notations: Notation[], notation: Notation) {
        const leftOffset = 25
        const accidentalWidth = 25
        const normalizedStartBeat = this.musicLogic.normalizeBeat(notation.startBeat)

        let total = 0
        let lastNote = null

        for (let i = 0; i < normalizedStartBeat; i += 1 / 32) {
            const iteratedNotation = this.getNotationAt(notations, i)

            if (iteratedNotation.startBeat !== lastNote?.startBeat) {
                lastNote = iteratedNotation
                total += (this.config.noteSize + this.config.noteSpacing)
            }

            if (iteratedNotation instanceof Note && this.musicLogic.getAccidentalForPitch(iteratedNotation.pitch)) {
                total += accidentalWidth / 5
            }
        }

        if (notation instanceof Note && this.musicLogic.getAccidentalForPitch(notation.pitch)) {
            total += accidentalWidth
        }

        // if (notation instanceof Rest && notation === notes[notes.length - 1]) {
        //     // If is rest and the final notation, center within remaining width of measure.
        //     const measureWidth = minMeasureWidth // TODO: can't call getMeasureWidth() - results in stack overflow
        //     const remainingWidth = measureWidth - total
        //     total += remainingWidth / 2
        // }

        return total + leftOffset
    }

    public getNoteBottomPosition (pitch: Pitch) {
        // @ts-expect-error
        const naturalNoteValues = Object.values(NaturalNote).filter(isNaN)

        // Determine base natural, to calculate correct position on staff
        const naturalPitch = this.musicLogic.determineNaturalPitch(pitch)

        // String value ("A", "B", "C", etc) of the note
        const noteValue = NaturalNote[naturalPitch % 12]

        // Number of naturals: A, B, C, D, E, F, G
        const totalNotes = naturalNoteValues.length

        // The position of Middle C on the staff is different depending on the clef.
        // We calculate the position of each note relative to Middle C, so needs
        // to be known ahead of time.
        let middleCPosition = 0
        switch (this.config.clef) {
            case Clef.TrebleClef:
                // Occupies the 3rd space from the bottom, which is the 5th index where the bottom line is 0
                middleCPosition = 5
                break
            case Clef.BassClef:
                // Occupies a whole step above the 4th line from the bottom, which is the 10th index where the bottom line is 0
                middleCPosition = 10
                break
        }

        // @ts-expect-error
        const noteDiff = Object.values(NaturalNote).filter(isNaN).indexOf(noteValue)
        const basePitchPosition = noteDiff
        const pitchOctave = Math.floor(pitch / 12) - 1
        const octaveDiff = pitchOctave - 4
        const pitchPosition = basePitchPosition + totalNotes * octaveDiff

        // One note per line and one per space equates to each note occupying a height of half each space
        const noteHeight = this.config.spaceHeight / 2

        return (middleCPosition + pitchPosition) * noteHeight
    }

    public getAccidentalLeftPosition (index: number) {
        return index * (this.config.accidentalSize / 2)
    }

    public getAccidentalBottomPosition (note: NaturalNote) {
        // String value ("A", "B", "C", etc) of the note
        const noteValue = NaturalNote[note]

        // @ts-expect-error
        const totalNaturalNotes = Object.values(NaturalNote).filter(isNaN).length

        // The position of Middle C on the staff is different depending on the clef.
        // We calculate the position of each note relative to Middle C, so this needs
        // to be known ahead of time.

        let maxValidPosition = 0
        let middleCPosition = 0

        switch (this.config.clef) {
            case Clef.TrebleClef:
                // Occupies the 3rd space from the bottom, which is the 5th index where the bottom line is 0
                middleCPosition = 5
                maxValidPosition = 11
                break
            case Clef.BassClef:
                // Occupies a whole step above the 4th line from the bottom, which is the 10th index where the bottom line is 0
                middleCPosition = 10
                maxValidPosition = 9
                break
        }

        // Sharps/flats for key signature should occupy visible lines and spaces only
        // If a note exceeds it, bring it down an octave (total number of natural notes in terms of position)
        let pitchPosition = Object.values(NaturalNote).indexOf(noteValue)
        while (middleCPosition + pitchPosition >= maxValidPosition) {
            pitchPosition -= totalNaturalNotes
        }

        // One note per line and one per space equates to each note occupying a height of half each space
        const noteHeight = this.config.spaceHeight / 2

        return (middleCPosition + pitchPosition) * noteHeight - 4
    }

    public getMeasureWidth (notations: Notation[]) {
        if (notations.length === 0) {
            return 100
        }

        const lastNote = notations[notations.length - 1]
        const rightOffset = 30
        return this.getNoteLeftPosition(notations, lastNote) + rightOffset
    }

    public getHorizontalBeams (notations: Notation[]) {
        let lastHorizontalBeamIndex = -1

        const beams = new Array<{ left: number, bottom: number, width: number }>()

        notations?.filter((notation) => notation instanceof Note)
            .forEach((notationModel: any, index: number) => {
                if (index > lastHorizontalBeamIndex) {
                    lastHorizontalBeamIndex = index

                    // Time signature is 3/8, 6/8, 9/8, or 12/8
                    const isCompoundTime = (this.config.beatDuration === NotationType.Eighth && this.config.beatsPerMeasure % 3 === 0)

                    // Time signature is 2/4, 4/4, or 6/4
                    const count4 = notationModel.type.getCountsPerMeasure(this.config.beatsPerMeasure, this.config.beatDuration) % 4 === 0

                    // Time signature is 3/4, 5/4, 7/4, or 9/4
                    const count2 = notationModel.type.getCountsPerMeasure(this.config.beatsPerMeasure, this.config.beatDuration) % 2 === 0

                    let maxConnectedNotes = isCompoundTime ? 3 : count4 ? 4 : count2 ? 2 : 1
                    if (notationModel.type === NotationType.ThirtySecond) maxConnectedNotes *= 4
                    if (notationModel.type === NotationType.Sixteenth) maxConnectedNotes *= 2

                    let count = 1
                    while (notations[index + count] && notations[index + count].type === notationModel.type) {
                        lastHorizontalBeamIndex++
                        if (++count === maxConnectedNotes) {
                            break
                        }
                    }

                    const newBeams = this.determineBeamsAtIndex(notations, index, maxConnectedNotes)
                    if (newBeams) {
                        beams.concat(newBeams)
                    }
                }
            })

        return beams
    }

    public determineBeamsAtIndex (notations: Notation[], index: number, maxConnectedNotes: number) {
        // Credit here for information on writing beams and stems: http://vickyjohnson.altervista.org/Notation%20Basics.pdf

        const notationModel = notations[index]
        const usesBeam = (
            notationModel.type === NotationType.ThirtySecond ||
            notationModel.type === NotationType.Sixteenth ||
            notationModel.type === NotationType.Eighth
        )

        if (notationModel instanceof Note && usesBeam) {
            let count = 0

            while (notations[index + count] instanceof Note && notations[index + count].type === notationModel.type) {
                count++

                if (count === maxConnectedNotes) {
                    break
                }
            }

            for (let i = index; i < index + count; i++) {
                const nextNote = notations[i]
                if (nextNote instanceof Note && notationModel instanceof Note) {
                    const verticalStemProportion = (this.getNoteBottomPosition(nextNote.pitch) - this.getNoteBottomPosition(notationModel.pitch)) / this.config.defaultStemHeight
                    nextNote.stemStretchFactor = 1 + verticalStemProportion
                }
            }

            return this.createBeamsBetweenIndexes(notations, index, index + count - 1)
        }

        return undefined
    }

    public createBeamsBetweenIndexes (notations: Notation[], startIndex: number, endIndex: number) {
        if (startIndex === endIndex) {
            return
        }

        const startNote = notations[startIndex] as Note
        const endNote = notations[endIndex] as Note
        const beamStartXPos = this.getNoteLeftPosition(notations, startNote) - (this.config.noteSize / 2) + 2
        const beamStartYPos = this.getNoteBottomPosition(startNote.pitch) - this.config.defaultStemHeight
        const beamEndXPos = this.getNoteLeftPosition(notations, endNote) - (this.config.noteSize / 2)
        // const stemEndYPos = getNotationBottomPosition(endNote.pitch) - defaultStemHeight
        const beamWidth = beamEndXPos - beamStartXPos - 1
        // const degrees = Math.atan2(stemEndYPos - stemStartYPos, stemEndXPos - stemStartXPos) * 180 / Math.PI;

        const beams = []

        beams.push({ left: beamStartXPos, bottom: beamStartYPos, width: beamWidth })

        if (startNote.type === NotationType.Sixteenth || startNote.type === NotationType.ThirtySecond) {
            beams.push({ left: beamStartXPos, bottom: beamStartYPos + 12, width: beamWidth })
        }

        if (startNote.type === NotationType.ThirtySecond) {
            beams.push({ left: beamStartXPos, bottom: beamStartYPos + 24, width: beamWidth })
        }

        return beams
    }

    public getNotationAt (notations: Notation[], beat: number) {
        for (const note of notations) {
            const localMeasureStartBeat = this.musicLogic.normalizeBeat(note.startBeat)
            if (localMeasureStartBeat <= beat && beat < localMeasureStartBeat + note.type.beatValue) {
                return note
            }
        }

        throw Error(`Notation not found at beat ${beat}`)
    }
}
