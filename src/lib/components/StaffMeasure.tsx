import React, { useEffect, useRef, useState } from 'react'

import './StaffMeasure.scss'
import { NotationModel, NoteModel, RestModel } from '../core/models'
import { NaturalNote, Clef, Pitch, Duration } from '../core/enums'
import { MusicLogic } from '../core/music-logic'
import StaffNote from './StaffNote'
import StaffRest from './StaffRest'
import StaffLines from './StaffLines'

/**
 *
 **/
interface StaffMeasureProps {
    /**
     *
     **/
    beatsPerMeasure: number

    /**
     *
     **/
    notes: NotationModel[]

    /**
     * The treble or bass clef, which affects note position.
     **/
    clef: Clef

    /**
     * Notes that should be implicitly sharped (by key) without being denoted by an explicit accidental.
     **/
    sharps?: NaturalNote[]

    /**
     * Notes that should be implicitly flatted (by key) without being denoted by an explicit accidental.
     **/
    flats?: NaturalNote[]
}

/**
 *
 **/
function StaffMeasure ({ notes, clef, sharps, flats, beatsPerMeasure }: StaffMeasureProps): React.ReactElement {
    const ref = useRef(null)
    const [staffSpaceHeight, setStaffSpaceHeight] = useState(0)
    const [noteSize] = useState(35)
    const [noteSpacing] = useState(35)
    const [defaultStemHeight] = useState(noteSize * 3 - (noteSize / 2))
    const [minMeasureWidth] = useState(400)

    useEffect(() => {
        if (ref.current) { setStaffSpaceHeight(ref.current.clientHeight / 4) }
    }, [ref])

    const id = `measure ${notes?.length > 0 ? notes[0].startBeat : '0'}`

    const normalizeBeat = (globalBeat: number) => {
        // Get the beat relative to the measure, from the global beat.
        return globalBeat % (beatsPerMeasure / 4)
    }

    const getNoteAt = (beat: number) => {
        for (const note of notes) {
            if (note instanceof NoteModel && normalizeBeat(note.startBeat) <= beat && beat < normalizeBeat(note.startBeat) + (1 / note.durationType)) {
                return note
            }
        }
    }

    const getNotationLeftPosition = (notation: NotationModel) => {
        const leftOffset = 25
        const accidentalWidth = 15

        let total = 0
        let lastNote = null

        for (let i = 0; i < normalizeBeat(notation.startBeat); i += 1 / 32) {
            const note = getNoteAt(i)

            if (note.startBeat !== lastNote?.startBeat) {
                lastNote = note
                total += (noteSize + noteSpacing)
            }

            if (MusicLogic.getAccidentalForPitch(note.pitch)) {
                total += accidentalWidth
            }
        }

        if (notation instanceof NoteModel && MusicLogic.getAccidentalForPitch(notation.pitch)) {
            total += accidentalWidth
        }

        if (notation instanceof RestModel && notation === notes[notes.length - 1]) {
            // If is rest and the final notation, center within remaining width of measure.
            const measureWidth = minMeasureWidth // TODO: can't call getMeasureWidth() - results in stack overflow
            const remainingWidth = measureWidth - total
            total += remainingWidth / 2
        }

        return total + leftOffset
    }

    const getNotationBottomPosition = (pitch: Pitch) => {
        // Filtered by isNaN because TS includes both keys and values in array of heterogeneous enum values
        // Explanation here: https://stackoverflow.com/a/51536142/3068267
        // We only want numeric values
        const naturalNoteValues = Object.values(NaturalNote).filter(isNaN)

        // Determine base natural, to calculate correct position on staff
        let naturalPitch = pitch
        if (!naturalNoteValues.includes(NaturalNote[pitch % 12])) {
            if (naturalNoteValues.includes(NaturalNote[(pitch - 1) % 12])) {
                naturalPitch = pitch - 1
            } else if (naturalNoteValues.includes(NaturalNote[(pitch + 1) % 12])) {
                naturalPitch = pitch + 1
            }
        }

        // String value ("A", "B", "C", etc) of the note
        const noteValue = NaturalNote[naturalPitch % 12]

        // Number of naturals: A, B, C, D, E, F, G
        const totalNotes = naturalNoteValues.length

        // The position of Middle C on the staff is different depending on the clef.
        // We calculate the position of each note relative to Middle C, so this needs
        // to be known ahead of time.
        let middleCPosition = 0
        switch (clef) {
            case Clef.Treble:
                // Occupies the 3rd space from the bottom, which is the 5th index where the bottom line is 0
                middleCPosition = 5
                break
            case Clef.Bass:
                // Occupies a whole step above the 4th line from the bottom, which is the 10th index where the bottom line is 0
                middleCPosition = 10
                break
        }

        const noteDiff = Object.values(NaturalNote).filter(isNaN).indexOf(noteValue)
        const basePitchPosition = noteDiff
        const pitchOctave = Math.floor(pitch / 12) - 1
        const octaveDiff = pitchOctave - 4
        const pitchPosition = basePitchPosition + totalNotes * octaveDiff

        // One note per line and one per space equates to each note occupying a height of half each space
        const noteHeight = staffSpaceHeight / 2

        return (middleCPosition + pitchPosition) * noteHeight
    }

    const getMeasureWidth = () => {
        if (notes.length === 0) {
            return minMeasureWidth
        }

        const lastNote = notes[notes.length - 1]
        const rightOffset = 30
        return Math.max(minMeasureWidth, getNotationLeftPosition(lastNote) + rightOffset)
    }

    const getStaffStyle = () => {
        return {
            width: `${getMeasureWidth()}px`
        }
    }

    const getConnectingStem = (startIndex: number, endIndex: number) => {
        const startNote = notes[startIndex] as NoteModel
        const endNote = notes[endIndex] as NoteModel
        const durationType = startNote.durationType
        const stemStartXPos = getNotationLeftPosition(startNote) - (noteSize / 2) + 2
        const stemStartYPos = getNotationBottomPosition(startNote.pitch) - defaultStemHeight
        const stemEndXPos = getNotationLeftPosition(endNote) - (noteSize / 2)
        // const stemEndYPos = getNotationBottomPosition(endNote.pitch) - defaultStemHeight
        const stemWidth = stemEndXPos - stemStartXPos - 1
        const stemHeight = 3
        // const degrees = Math.atan2(stemEndYPos - stemStartYPos, stemEndXPos - stemStartXPos) * 180 / Math.PI;

        const b = window.document.createElement('div')
        b.id = notes[endIndex].startBeat.toString()
        b.style.position = 'absolute'
        b.style.left = `${stemStartXPos}px`
        b.style.bottom = `${stemStartYPos}px`
        b.style.width = `${stemWidth}px`
        b.style.border = `${stemHeight}px solid #000`
        window.setTimeout(() => window.document.getElementById(id).appendChild(b))

        if (durationType === Duration.Sixteenth || durationType === Duration.ThirtySecond) {
            const b2 = window.document.createElement('div')
            b2.id = notes[endIndex].startBeat.toString()
            b2.style.position = 'absolute'
            b2.style.left = `${stemStartXPos}px`
            b2.style.bottom = `${stemStartYPos + (stemHeight * 3)}px`
            b2.style.width = `${stemWidth}px`
            b2.style.border = `${stemHeight}px solid #000`
            window.setTimeout(() => window.document.getElementById(id).appendChild(b2))
        }

        if (durationType === Duration.ThirtySecond) {
            const b3 = window.document.createElement('div')
            b3.id = notes[endIndex].startBeat.toString()
            b3.style.position = 'absolute'
            b3.style.left = `${stemStartXPos}px`
            b3.style.bottom = `${stemStartYPos + (stemHeight * 3 * 2)}px`
            b3.style.width = `${stemWidth}px`
            b3.style.border = `${stemHeight}px solid #000`
            window.setTimeout(() => window.document.getElementById(id).appendChild(b3))
        }
    }

    const drawStems = (index: number) => {
        const notationModel = notes[index]

        if (notationModel instanceof NoteModel &&
            (notationModel.durationType === Duration.ThirtySecond ||
             notationModel.durationType === Duration.Sixteenth ||
             notationModel.durationType === Duration.Eighth)) {
            let maxConnectedNotes = beatsPerMeasure
            if (notationModel.durationType === Duration.ThirtySecond) maxConnectedNotes *= 4
            if (notationModel.durationType === Duration.Sixteenth) maxConnectedNotes *= 2

            let count = 0

            while (notes[index + count] instanceof NoteModel && notes[index + count].durationType === notationModel.durationType) {
                count++

                if (count === maxConnectedNotes) {
                    break
                }
            }

            getConnectingStem(index, index + count - 1)

            for (let i = index; i < index + count; i++) {
                const nextNote = notes[i]
                if (nextNote instanceof NoteModel && notationModel instanceof NoteModel) {
                    const stemProportion = (getNotationBottomPosition(nextNote.pitch) - getNotationBottomPosition(notationModel.pitch)) / defaultStemHeight
                    nextNote.stemStretchFactor = 1 + stemProportion
                }
            }

            return index + count - 1
        }
    }

    const getNotations = () => {
        let lastHorizontalStemIndex = -1

        return notes?.map((notationModel: NotationModel, index) => {
            if (notationModel instanceof NoteModel) {
                if (index > lastHorizontalStemIndex) {
                    lastHorizontalStemIndex = drawStems(index)
                }

                const accidental = MusicLogic.getAccidentalForPitch(notationModel.pitch)
                const leftPosition = getNotationLeftPosition(notationModel)
                const bottomPosition = getNotationBottomPosition(notationModel.pitch)

                return (
                    <StaffNote
                        key={index}
                        model={notationModel}
                        left={leftPosition}
                        bottom={bottomPosition}
                        size={noteSize}
                        accidental={accidental}
                    />
                )
            } else if (notationModel instanceof RestModel) {
                const leftPosition = getNotationLeftPosition(notationModel)
                return (
                    <StaffRest
                        key={index}
                        model={notationModel}
                        left={leftPosition}
                    />
                )
            } else {
                throw Error('Unrecognized notation')
            }
        })
    }

    return (
        <div id={id} ref={ref} className="staff-measure" style={getStaffStyle()}>
            <StaffLines />
            <div className="notation-container">
                {getNotations()}
            </div>
        </div>
    )
}

export default StaffMeasure
