import { Clef, NaturalNote, Notation, NotationType, Note, Pitch, Rest } from '@lib/core/models'
import { MusicLogic } from '@lib/core/MusicLogic'
import { StaffMeasureProps } from '@lib/components/StaffMeasure/StaffMeasure'

export class StaffMeasureController {
    constructor (private readonly props: StaffMeasureProps) {

    }

    public getNotes () {
        return this.props.notations?.filter((notation: Notation) => notation instanceof Note)
            .map((note: any) => {
                return {
                    model: note,
                    size: this.props.noteSize,
                    accidental: MusicLogic.getAccidentalForPitch(note.pitch, this.props.sharps, this.props.flats),
                    left: this.getNotationLeftPosition(note),
                    bottom: this.getNotationBottomPosition(note.pitch)
                }
            })
    }

    public getRests () {
        return this.props.notations?.filter((notation: Notation) => notation instanceof Rest)
            .map((rest: any) => {
                return {
                    model: rest,
                    size: this.props.noteSize,
                    left: this.getNotationLeftPosition(rest)
                }
            })
    }

    public getNotationLeftPosition (notation: Notation) {
        const leftOffset = 25
        const accidentalWidth = 25
        const normalizedStartBeat = MusicLogic.normalizeBeat(notation.startBeat, this.props.beatsPerMeasure, this.props.beatDuration)

        let total = 0
        let lastNote = null

        for (let i = 0; i < normalizedStartBeat; i += 1 / 32) {
            const iteratedNotation = this.getNotationAt(i)

            if (iteratedNotation.startBeat !== lastNote?.startBeat) {
                lastNote = iteratedNotation
                total += (this.props.noteSize + this.props.noteSpacing)
            }

            if (iteratedNotation instanceof Note && MusicLogic.getAccidentalForPitch(iteratedNotation.pitch, this.props.sharps, this.props.flats)) {
                total += accidentalWidth / 5
            }
        }

        if (notation instanceof Note && MusicLogic.getAccidentalForPitch(notation.pitch, this.props.sharps, this.props.flats)) {
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

    public readonly getNotationBottomPosition = (pitch: Pitch) => {
        // @ts-expect-error
        const naturalNoteValues = Object.values(NaturalNote).filter(isNaN)

        // Determine base natural, to calculate correct position on staff
        const naturalPitch = MusicLogic.determineNaturalPitch(pitch, this.props.sharps, this.props.flats)

        // String value ("A", "B", "C", etc) of the note
        const noteValue = NaturalNote[naturalPitch % 12]

        // Number of naturals: A, B, C, D, E, F, G
        const totalNotes = naturalNoteValues.length

        // The position of Middle C on the staff is different depending on the clef.
        // We calculate the position of each note relative to Middle C, so this needs
        // to be known ahead of time.
        let middleCPosition = 0
        switch (this.props.clef) {
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
        const noteHeight = this.props.spaceHeight / 2

        return (middleCPosition + pitchPosition) * noteHeight
    }

    public getMeasureWidth () {
        if (this.props.notations.length === 0) {
            return 100
        }

        const lastNote = this.props.notations[this.props.notations.length - 1]
        const rightOffset = 30
        return this.getNotationLeftPosition(lastNote) + rightOffset
    }

    public getHoveredNote (mousePosition: { x: number, y: number }) {
        if (mousePosition.x === 0 && mousePosition.y === 0) {
            return null
        }

        const noteIndex = Math.floor(mousePosition.y / (this.props.spaceHeight / 2))

        let pitch = this.props.clef === Clef.TrebleClef ? 55 : 49

        switch (noteIndex) {
            case 0:
                pitch -= this.props.clef === Clef.TrebleClef ? 3 : 4
                break
            case 1:
                pitch -= this.props.clef === Clef.TrebleClef ? 2 : 2
                break
            case 2:
                pitch += this.props.clef === Clef.TrebleClef ? 0 : 0
                break
            case 3:
                pitch += this.props.clef === Clef.TrebleClef ? 2 : 1
                break
            case 4:
                pitch += this.props.clef === Clef.TrebleClef ? 4 : 3
                break
            case 5:
                pitch += this.props.clef === Clef.TrebleClef ? 5 : 4
                break
            case 6:
                pitch += this.props.clef === Clef.TrebleClef ? 7 : 7
                break
            case 7:
                pitch += this.props.clef === Clef.TrebleClef ? 9 : 9
                break
            case 8:
                pitch += this.props.clef === Clef.TrebleClef ? 10 : 10
                break
        }

        return new Note(NotationType.Quarter, pitch)
    }

    public getHorizontalBeams = () => {
        let lastHorizontalBeamIndex = -1

        const beams = new Array<{ left: number, bottom: number, width: number }>()

        this.props.notations?.filter((notation) => notation instanceof Note)
            .forEach((notationModel: any, index: number) => {
                if (index > lastHorizontalBeamIndex) {
                    lastHorizontalBeamIndex = index

                    // Time signature is 3/8, 6/8, 9/8, or 12/8
                    const isCompoundTime = (this.props.beatDuration === NotationType.Eighth && this.props.beatsPerMeasure % 3 === 0)

                    // Time signature is 2/4, 4/4, or 6/4
                    const count4 = notationModel.type.getCountsPerMeasure(this.props.beatsPerMeasure, this.props.beatDuration) % 4 === 0

                    // Time signature is 3/4, 5/4, 7/4, or 9/4
                    const count2 = notationModel.type.getCountsPerMeasure(this.props.beatsPerMeasure, this.props.beatDuration) % 2 === 0

                    let maxConnectedNotes = isCompoundTime ? 3 : count4 ? 4 : count2 ? 2 : 1
                    if (notationModel.type === NotationType.ThirtySecond) maxConnectedNotes *= 4
                    if (notationModel.type === NotationType.Sixteenth) maxConnectedNotes *= 2

                    let count = 1
                    while (this.props.notations[index + count] && this.props.notations[index + count].type === notationModel.type) {
                        lastHorizontalBeamIndex++
                        if (++count === maxConnectedNotes) {
                            break
                        }
                    }

                    const newBeams = this.determineBeamsAtIndex(index, maxConnectedNotes)
                    if (newBeams) {
                        beams.concat(newBeams)
                    }
                }
            })

        return beams
    }

    private determineBeamsAtIndex (index: number, maxConnectedNotes: number) {
        // Credit here for information on writing beams and stems: http://vickyjohnson.altervista.org/Notation%20Basics.pdf

        const notationModel = this.props.notations[index]
        const usesBeam = (
            notationModel.type === NotationType.ThirtySecond ||
            notationModel.type === NotationType.Sixteenth ||
            notationModel.type === NotationType.Eighth
        )

        if (notationModel instanceof Note && usesBeam) {
            let count = 0

            while (this.props.notations[index + count] instanceof Note && this.props.notations[index + count].type === notationModel.type) {
                count++

                if (count === maxConnectedNotes) {
                    break
                }
            }

            for (let i = index; i < index + count; i++) {
                const nextNote = this.props.notations[i]
                if (nextNote instanceof Note && notationModel instanceof Note) {
                    const verticalStemProportion = (this.getNotationBottomPosition(nextNote.pitch) - this.getNotationBottomPosition(notationModel.pitch)) / this.props.defaultStemHeight
                    nextNote.stemStretchFactor = 1 + verticalStemProportion
                }
            }

            return this.createBeamsBetweenIndexes(index, index + count - 1)
        }

        return undefined
    }

    private createBeamsBetweenIndexes (startIndex: number, endIndex: number) {
        if (startIndex === endIndex) {
            return
        }

        const startNote = this.props.notations[startIndex] as Note
        const endNote = this.props.notations[endIndex] as Note
        const beamStartXPos = this.getNotationLeftPosition(startNote) - (this.props.noteSize / 2) + 2
        const beamStartYPos = this.getNotationBottomPosition(startNote.pitch) - this.props.defaultStemHeight
        const beamEndXPos = this.getNotationLeftPosition(endNote) - (this.props.noteSize / 2)
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

    private getNotationAt (beat: number) {
        for (const note of this.props.notations) {
            const localMeasureStartBeat = MusicLogic.normalizeBeat(note.startBeat, this.props.beatsPerMeasure, this.props.beatDuration)
            if (localMeasureStartBeat <= beat && beat < localMeasureStartBeat + note.type.beatValue) {
                return note
            }
        }

        throw Error(`Notation not found at beat ${beat}`)
    }
}
