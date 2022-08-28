import React, { useEffect, useRef, useState } from 'react'

import './StaffMeasure.scss'
import { Clef, NaturalNote, Notation, NotationType, Note, Pitch, Rest } from '../core/models'
import { MusicLogic } from '../core/music-logic'
import StaffNote from './StaffNote'
import StaffRest from './StaffRest'
import StaffLines from './StaffLines'
import StaffHorizontalStem from './StaffHorizontalStem'

/**
 *
 **/
interface StaffMeasureProps {
    /**
     *
     **/
    staffId: string

    /**
     *
     **/
    beatsPerMeasure: number

    /**
     *
     **/
    beatDuration: NotationType

    /**
     *
     **/
    notations: Notation[]

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
function StaffMeasure ({ staffId, notations, clef, sharps, flats, beatsPerMeasure, beatDuration }: StaffMeasureProps): React.ReactElement {
    const ref = useRef<HTMLDivElement>(null)
    const [staffSpaceHeight, setStaffSpaceHeight] = useState(0)
    const [noteSize] = useState(35)
    const [noteSpacing] = useState(35)
    const [defaultStemHeight] = useState(noteSize * 3 - (noteSize / 2))
    const [stems, setStems] = useState(new Array<{ left: number, bottom: number, width: number}>())

    useEffect(() => {
        if (ref.current) {
            setStaffSpaceHeight(ref.current.clientHeight / 4)
        }
    }, [ref])

    const id = `${staffId}-${notations?.length > 0 ? notations[0].startBeat : '0'}`

    const normalizeBeat = (globalBeat: number) => {
        // Get the beat relative to the measure, from the global beat.
        return globalBeat % ((beatsPerMeasure / 4) * (beatDuration.beatValue / 0.25))
    }

    const getNotationAt = (beat: number) => {
        for (const note of notations) {
            const localMeasureStartBeat = normalizeBeat(note.startBeat)
            if (localMeasureStartBeat <= beat && beat < localMeasureStartBeat + note.type.beatValue) {
                return note
            }
        }

        throw Error(`Notation not found at beat ${beat}`)
    }

    const getNotationLeftPosition = (notation: Notation) => {
        const leftOffset = 25
        const accidentalWidth = 25

        let total = 0
        let lastNote = null

        for (let i = 0; i < normalizeBeat(notation.startBeat); i += 1 / 32) {
            const iteratedNotation = getNotationAt(i)

            if (iteratedNotation.startBeat !== lastNote?.startBeat) {
                lastNote = iteratedNotation
                total += (noteSize + noteSpacing)
            }

            if (iteratedNotation instanceof Note && MusicLogic.getAccidentalForPitch(iteratedNotation.pitch, sharps, flats)) {
                total += accidentalWidth / 5
            }
        }

        if (notation instanceof Note && MusicLogic.getAccidentalForPitch(notation.pitch, sharps, flats)) {
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

    const getNotationBottomPosition = (pitch: Pitch) => {
        // @ts-expect-error
        const naturalNoteValues = Object.values(NaturalNote).filter(isNaN)

        // Determine base natural, to calculate correct position on staff
        let naturalPitch = pitch
        if (!naturalNoteValues.includes(NaturalNote[pitch % 12])) {
            if ((sharps?.length ?? 0) > 0 && naturalNoteValues.includes(NaturalNote[(pitch - 1) % 12])) {
                naturalPitch = pitch - 1
            } else if ((flats?.length ?? 0) > 0 && naturalNoteValues.includes(NaturalNote[(pitch + 1) % 12])) {
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
        const noteHeight = staffSpaceHeight / 2

        return (middleCPosition + pitchPosition) * noteHeight
    }

    const getMeasureWidth = () => {
        if (notations.length === 0) {
            return 100
        }

        const lastNote = notations[notations.length - 1]
        const rightOffset = 30
        return getNotationLeftPosition(lastNote) + rightOffset
    }

    const getStaffStyle = () => {
        return {
            width: `${getMeasureWidth()}px`
        }
    }

    const createBeamBetweenIndexes = (startIndex: number, endIndex: number) => {
        if (startIndex === endIndex) {
            return
        }

        const startNote = notations[startIndex] as Note
        const endNote = notations[endIndex] as Note
        const beamStartXPos = getNotationLeftPosition(startNote) - (noteSize / 2) + 2
        const beamStartYPos = getNotationBottomPosition(startNote.pitch) - defaultStemHeight
        const beamEndXPos = getNotationLeftPosition(endNote) - (noteSize / 2)
        // const stemEndYPos = getNotationBottomPosition(endNote.pitch) - defaultStemHeight
        const beamWidth = beamEndXPos - beamStartXPos - 1
        // const degrees = Math.atan2(stemEndYPos - stemStartYPos, stemEndXPos - stemStartXPos) * 180 / Math.PI;

        const beams = []

        beams.push({ left: beamStartXPos, bottom: beamStartYPos, width: beamWidth })

        if (startNote.type === NotationType.Sixteenth || startNote.type === NotationType.ThirtySecond) {
            beams.push({ left: beamStartXPos, bottom: beamStartYPos + 9, width: beamWidth })
        }

        if (startNote.type === NotationType.ThirtySecond) {
            beams.push({ left: beamStartXPos, bottom: beamStartYPos + 18, width: beamWidth })
        }

        return beams.map((beam, index) => (
            <StaffHorizontalStem key={index} left={beam.left} bottom={beam.bottom} width={beam.width} />
        ))
    }

    const determineBeamAtIndex = (index: number, maxConnectedNotes: number) => {
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
                    const verticalStemProportion = (getNotationBottomPosition(nextNote.pitch) - getNotationBottomPosition(notationModel.pitch)) / defaultStemHeight
                    nextNote.stemStretchFactor = 1 + verticalStemProportion
                }
            }

            return createBeamBetweenIndexes(index, index + count - 1)
        }

        return <></>
    }

    const getHorizontalBeams = () => {
        let lastHorizontalBeamIndex = -1

        return notations?.map((notationModel: Notation, index) => {
            if (notationModel instanceof Note) {
                if (index > lastHorizontalBeamIndex) {
                    lastHorizontalBeamIndex = index

                    // Time signature is 3/8, 6/8, 9/8, or 12/8
                    const isCompoundTime = (beatDuration === NotationType.Eighth && beatsPerMeasure % 3 === 0)

                    // Time signature is 2/4, 4/4, or 6/4
                    const count4 = notationModel.type.getCountsPerMeasure(beatsPerMeasure, beatDuration) % 4 === 0

                    // Time signature is 3/4, 5/4, 7/4, or 9/4
                    const count2 = notationModel.type.getCountsPerMeasure(beatsPerMeasure, beatDuration) % 2 === 0

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

                    return determineBeamAtIndex(index, maxConnectedNotes)
                } else {
                    return <></>
                }
            } else {
                return <></>
            }
        })
    }

    const getNotations = () => {
        return notations?.map((notationModel: Notation, index) => {
            if (notationModel instanceof Note) {
                const accidental = MusicLogic.getAccidentalForPitch(notationModel.pitch, sharps, flats)
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
            } else if (notationModel instanceof Rest) {
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
                {getHorizontalBeams()}
            </div>
        </div>
    )
}

export default StaffMeasure
