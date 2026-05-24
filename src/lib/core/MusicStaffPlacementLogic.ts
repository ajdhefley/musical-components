import { Clef, NaturalNote, Notation, NotationType, Note, Pitch, Rest } from '@lib/core/models'
import { MusicLogic, MusicLogicConfig } from '@lib/core/MusicLogic'

export type MusicStaffPlacementLogicConfig = MusicLogicConfig & {
    accidentalSize: number
    noteSize: number
    noteSpacing: number
    spaceHeight: number
    defaultStemHeight: number
    clef: Clef
}

export class MusicStaffPlacementLogic {

    /**
     * Filters rests out of the list, with notes remaining.
     *
     * @param notations
     * @returns {Notation[]} Notes with calculated positions and accidentals.
     */
    public static extractNotes (notations: Notation[], config: MusicStaffPlacementLogicConfig) {
        return notations?.filter((notation: Notation) => notation instanceof Note)
            .map((note: any) => {
                return {
                    model: note,
                    accidental: MusicLogic.getAccidentalForPitch(note.pitch, config),
                    left: MusicStaffPlacementLogic.getNoteLeftPosition(notations, note, config),
                    bottom: MusicStaffPlacementLogic.getNoteBottomPosition(note.pitch, config)
                }
            })
    }

    /**
     * Filters note out of the list, with rests remaining.
     *
     * @param notations
     * @returns {Notation[]} Rests with calculated positions.
     */
    public static extractRests (notations: Notation[], config: MusicStaffPlacementLogicConfig) {
        return notations?.filter((notation: Notation) => notation instanceof Rest)
            .map((rest: any) => {
                return {
                    model: rest,
                    left: MusicStaffPlacementLogic.getNoteLeftPosition(notations, rest, config)
                }
            })
    }

    public static getTies (notations: Notation[], config: MusicStaffPlacementLogicConfig) {
        const notes = notations.filter((notation): notation is Note => notation instanceof Note)

        const ties = new Array<{ left: number, bottom: number, width: number, flip: boolean }>()

        for (let i = 0; i < notes.length - 1; i++) {
            const currentNote = notes[i]
            const nextNote = notes[i + 1]

            if (!currentNote.tieToNext) {
                continue
            }

            if (currentNote.pitch !== nextNote.pitch) {
                continue
            }

            const currentMeasureBeat = MusicLogic.normalizeBeat(currentNote.startBeat, config)
            const nextMeasureBeat = MusicLogic.normalizeBeat(nextNote.startBeat, config)
            if (nextMeasureBeat < currentMeasureBeat) {
                continue
            }

            const startLeft = MusicStaffPlacementLogic.getNoteLeftPosition(notations, currentNote, config)
            const endLeft = MusicStaffPlacementLogic.getNoteLeftPosition(notations, nextNote, config)
            const width = endLeft - startLeft

            if (width <= 0) {
                continue
            }

            const noteBottom = MusicStaffPlacementLogic.getNoteBottomPosition(currentNote.pitch, config)
            const flip = currentNote.pitch >= Pitch.B4
            const bottomOffset = flip ? 20 : -26

            ties.push({
                left: startLeft,
                bottom: noteBottom + bottomOffset,
                width,
                flip
            })
        }

        return ties
    }

    public static getNoteLeftPosition (notations: Notation[], notation: Notation, config: MusicStaffPlacementLogicConfig) {
        const leftOffset = 25
        const accidentalWidth = 25
        const normalizedStartBeat = MusicLogic.normalizeBeat(notation.startBeat, config)

        let total = 0
        let lastNote = null

        for (let i = 0; i < normalizedStartBeat; i += 1 / 32) {
            const iteratedNotation = MusicStaffPlacementLogic.getNotationAt(notations, i, config)

            if (iteratedNotation.startBeat !== lastNote?.startBeat) {
                lastNote = iteratedNotation
                total += (config.noteSize + config.noteSpacing)
            }

            if (iteratedNotation instanceof Note && MusicLogic.getAccidentalForPitch(iteratedNotation.pitch, config)) {
                total += accidentalWidth / 5
            }
        }

        if (notation instanceof Note && MusicLogic.getAccidentalForPitch(notation.pitch, config)) {
            total += accidentalWidth
        }

        return total + leftOffset
    }

    public static getNoteBottomPosition (pitch: Pitch, config: MusicStaffPlacementLogicConfig) {
        // @ts-expect-error
        const naturalNoteValues = Object.values(NaturalNote).filter(isNaN)

        const naturalPitch = MusicLogic.determineNaturalPitch(pitch, config)
        const noteValue = NaturalNote[naturalPitch % 12]
        const totalNotes = naturalNoteValues.length

        let middleCPosition = 0
        switch (config.clef) {
            case Clef.TrebleClef:
                middleCPosition = 5
                break
            case Clef.BassClef:
                middleCPosition = 10
                break
        }

        // @ts-expect-error
        const noteDiff = Object.values(NaturalNote).filter(isNaN).indexOf(noteValue)
        const basePitchPosition = noteDiff
        const pitchOctave = Math.floor(pitch / 12) - 1
        const octaveDiff = pitchOctave - 4
        const pitchPosition = basePitchPosition + totalNotes * octaveDiff

        const noteHeight = config.spaceHeight / 2

        return (middleCPosition + pitchPosition) * noteHeight
    }

    public static getAccidentalLeftPosition (index: number, config: MusicStaffPlacementLogicConfig) {
        return index * (config.accidentalSize / 2)
    }

    public static getAccidentalBottomPosition (note: NaturalNote, config: MusicStaffPlacementLogicConfig) {
        const noteValue = NaturalNote[note]

        // @ts-expect-error
        const totalNaturalNotes = Object.values(NaturalNote).filter(isNaN).length

        let maxValidPosition = 0
        let middleCPosition = 0

        switch (config.clef) {
            case Clef.TrebleClef:
                middleCPosition = 5
                maxValidPosition = 11
                break
            case Clef.BassClef:
                middleCPosition = 10
                maxValidPosition = 9
                break
        }

        let pitchPosition = Object.values(NaturalNote).indexOf(noteValue)
        while (middleCPosition + pitchPosition >= maxValidPosition) {
            pitchPosition -= totalNaturalNotes
        }

        const noteHeight = config.spaceHeight / 2

        return (middleCPosition + pitchPosition) * noteHeight - 4
    }

    public static getMeasureWidth (notations: Notation[], config: MusicStaffPlacementLogicConfig) {
        if (notations.length === 0) {
            return 100
        }

        const lastNote = notations[notations.length - 1]
        const rightOffset = 30
        return MusicStaffPlacementLogic.getNoteLeftPosition(notations, lastNote, config) + rightOffset
    }

    private static getOddEighthMeterBeamGroupSize (noteStartBeat: number, config: MusicStaffPlacementLogicConfig): number {
        if (config.beatDuration !== NotationType.Eighth || config.beatsPerMeasure <= 3) {
            return 1
        }

        if (config.beatsPerMeasure % 2 === 0 || config.beatsPerMeasure % 3 === 0) {
            return 1
        }

        const groups = new Array<number>()
        let remainingBeats = config.beatsPerMeasure

        groups.push(3)
        remainingBeats -= 3

        while (remainingBeats > 0) {
            groups.push(2)
            remainingBeats -= 2
        }

        const eighthPosition = Math.max(0, Math.round(MusicLogic.normalizeBeat(noteStartBeat, config) * 8))

        let runningIndex = 0
        for (const groupSize of groups) {
            const groupEnd = runningIndex + groupSize
            if (eighthPosition < groupEnd) {
                return groupEnd - eighthPosition
            }

            runningIndex = groupEnd
        }

        return 1
    }

    public static getHorizontalBeams (notations: Notation[], config: MusicStaffPlacementLogicConfig) {
        let lastHorizontalBeamIndex = -1
        const notes = notations.filter((notation): notation is Note => notation instanceof Note)

        const beams = new Array<{ left: number, bottom: number, width: number }>()

        notes.forEach((note) => {
            note.isBeamed = false
            note.stemStretchFactor = 1.0
        })

        notes.forEach((notationModel: Note, index: number) => {
            if (index > lastHorizontalBeamIndex) {
                lastHorizontalBeamIndex = index

                const isCompoundTime = (config.beatDuration === NotationType.Eighth && config.beatsPerMeasure % 3 === 0)
                const count4 = notationModel.type.getCountsPerMeasure(config.beatsPerMeasure, config.beatDuration) % 4 === 0
                const count2 = notationModel.type.getCountsPerMeasure(config.beatsPerMeasure, config.beatDuration) % 2 === 0
                const oddEighthGroupSize = MusicStaffPlacementLogic.getOddEighthMeterBeamGroupSize(notationModel.startBeat, config)

                let maxConnectedNotes = isCompoundTime ? 3 : oddEighthGroupSize > 1 ? oddEighthGroupSize : count4 ? 4 : count2 ? 2 : 1
                if (notationModel.type === NotationType.ThirtySecond) maxConnectedNotes *= 4
                if (notationModel.type === NotationType.Sixteenth) maxConnectedNotes *= 2

                let count = 1
                while (notes[index + count] && notes[index + count].type === notationModel.type && notes[index + count].dotCount === 0) {
                    lastHorizontalBeamIndex++
                    if (++count === maxConnectedNotes) {
                        break
                    }
                }

                const newBeams = MusicStaffPlacementLogic.determineBeamsAtIndex(notations, notes, index, maxConnectedNotes, config)
                if (newBeams) {
                    beams.push(...newBeams)
                }
            }
        })

        return beams
    }

    public static determineBeamsAtIndex (allNotations: Notation[], notes: Note[], index: number, maxConnectedNotes: number, config: MusicStaffPlacementLogicConfig) {
        // Credit here for information on writing beams and stems: http://vickyjohnson.altervista.org/Notation%20Basics.pdf

        const notationModel = notes[index]
        const usesBeam = (
            notationModel.dotCount === 0 && (
                notationModel.type === NotationType.ThirtySecond ||
                notationModel.type === NotationType.Sixteenth ||
                notationModel.type === NotationType.Eighth
            )
        )

        if (notationModel instanceof Note && usesBeam) {
            let count = 0

            while (notes[index + count] && notes[index + count].type === notationModel.type && notes[index + count].dotCount === 0) {
                count++

                if (count === maxConnectedNotes) {
                    break
                }
            }

            if (count <= 1) {
                return undefined
            }

            for (let i = index; i < index + count; i++) {
                const nextNote = notes[i]
                nextNote.isBeamed = true
                const verticalStemProportion = (MusicStaffPlacementLogic.getNoteBottomPosition(nextNote.pitch, config) - MusicStaffPlacementLogic.getNoteBottomPosition(notationModel.pitch, config)) / config.defaultStemHeight
                nextNote.stemStretchFactor = 1 + verticalStemProportion
            }

            return MusicStaffPlacementLogic.createBeamsBetweenNotes(allNotations, notes[index], notes[index + count - 1], config)
        }

        return undefined
    }

    public static createBeamsBetweenNotes (notations: Notation[], startNote: Note, endNote: Note, config: MusicStaffPlacementLogicConfig) {
        const beamStartXPos = MusicStaffPlacementLogic.getNoteLeftPosition(notations, startNote, config) - (config.noteSize / 2) + 2
        const beamStartYPos = MusicStaffPlacementLogic.getNoteBottomPosition(startNote.pitch, config) - config.defaultStemHeight
        const beamEndXPos = MusicStaffPlacementLogic.getNoteLeftPosition(notations, endNote, config) - (config.noteSize / 2)
        const beamWidth = beamEndXPos - beamStartXPos - 1

        const beams = []

        beams.push({ left: beamStartXPos, bottom: beamStartYPos, width: beamWidth })

        if (startNote.type.getFlagCount() >= 2) {
            beams.push({ left: beamStartXPos, bottom: beamStartYPos + 12, width: beamWidth })
        }

        if (startNote.type.getFlagCount() >= 3) {
            beams.push({ left: beamStartXPos, bottom: beamStartYPos + 24, width: beamWidth })
        }

        return beams
    }

    private static getNotationAt (notations: Notation[], beat: number, config: MusicStaffPlacementLogicConfig) {
        for (const note of notations) {
            const localMeasureStartBeat = MusicLogic.normalizeBeat(note.startBeat, config)
            if (localMeasureStartBeat <= beat && beat < localMeasureStartBeat + note.totalBeatValue) {
                return note
            }
        }

        throw Error(`Notation not found at beat ${beat}`)
    }
}
