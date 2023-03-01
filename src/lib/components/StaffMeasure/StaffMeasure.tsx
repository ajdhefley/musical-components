import React, { useEffect, useRef, useState } from 'react'

import './StaffMeasure.scss'
import { Clef, NaturalNote, Notation, NotationType, Note } from '@lib/core/models'
import { StaffNote } from '@lib/components/StaffNote/StaffNote'
import { StaffRest } from '@lib/components/StaffRest/StaffRest'
import { StaffLines } from '@lib/components/StaffLines/StaffLines'
import { StaffNoteBeam } from '@lib/components/StaffNoteBeam/StaffNoteBeam'
import { MusicStaffPlacementLogic } from '@lib/core/MusicStaffPlacementLogic'

/**
 *
 **/
export interface StaffMeasureProps {
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

    /**
     *
     **/
    noteSize: number

    /**
     *
     **/
    noteSpacing: number

    /**
     *
     **/
    spaceHeight: number

    /**
     *
     **/
    interactive?: boolean

    /**
     *
     **/
    // get defaultStemHeight() {
    // return noteSize * 3 - (noteSize / 2);
    // }
    defaultStemHeight: number
}

/**
 *
 **/
export function StaffMeasure (props: StaffMeasureProps): React.ReactElement {
    const ref = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState<{x: number, y: number}>(({ x: 0, y: 0 }))

    const id = `${props.staffId}-${props.notations?.length > 0 ? props.notations[0].startBeat : '0'}`

    const staffPlacement = new MusicStaffPlacementLogic({
        accidentalSize: 0,
        noteSize: props.noteSize,
        noteSpacing: props.noteSpacing,
        spaceHeight: props.spaceHeight,
        defaultStemHeight: props.defaultStemHeight,
        clef: props.clef,
        sharps: props.sharps,
        flats: props.flats,
        beatsPerMeasure: props.beatsPerMeasure,
        beatDuration: props.beatDuration
    })

    const getHoveredNoteElement = function () {
        const note = getHoveredNote(mousePosition)

        if (!note) {
            return undefined
        }

        const leftPosition = mousePosition.x
        const bottomPosition = staffPlacement.getNoteBottomPosition(note.pitch)

        return <StaffNote model={note} size={props.noteSize} left={leftPosition} bottom={bottomPosition} />
    }

    const getHoveredNote = function (mousePosition: { x: number, y: number }) {
        if (mousePosition.x === 0 && mousePosition.y === 0) {
            return null
        }

        const noteIndex = Math.floor(mousePosition.y / (props.spaceHeight / 2))

        let pitch = props.clef === Clef.TrebleClef ? 55 : 49

        switch (noteIndex) {
            case 0:
                pitch -= props.clef === Clef.TrebleClef ? 3 : 4
                break
            case 1:
                pitch -= props.clef === Clef.TrebleClef ? 2 : 2
                break
            case 2:
                pitch += props.clef === Clef.TrebleClef ? 0 : 0
                break
            case 3:
                pitch += props.clef === Clef.TrebleClef ? 2 : 1
                break
            case 4:
                pitch += props.clef === Clef.TrebleClef ? 4 : 3
                break
            case 5:
                pitch += props.clef === Clef.TrebleClef ? 5 : 4
                break
            case 6:
                pitch += props.clef === Clef.TrebleClef ? 7 : 7
                break
            case 7:
                pitch += props.clef === Clef.TrebleClef ? 9 : 9
                break
            case 8:
                pitch += props.clef === Clef.TrebleClef ? 10 : 10
                break
        }

        return new Note(NotationType.Quarter, pitch)
    }

    useEffect(() => {
        if (ref.current) {
            const refCurrent = ref.current

            if (props.interactive) {
                const mousemove = (e: any) => {
                    const bounds = refCurrent.getBoundingClientRect()
                    const relativeX = e.clientX - bounds.left
                    const relativeY = e.clientY - bounds.top
                    setMousePosition({ x: relativeX, y: refCurrent.offsetHeight - relativeY })
                }

                refCurrent.addEventListener('mouseenter', () => {
                    refCurrent.addEventListener('mousemove', mousemove)
                })

                refCurrent.addEventListener('mouseleave', () => {
                    refCurrent.removeEventListener('mousemove', mousemove)
                    setMousePosition({ x: 0, y: 0 })
                })
            }
        }
    }, [ref])

    return (
        <div
            id={id}
            ref={ref}
            className="staff-measure"
            style={{
                width: `${staffPlacement.getMeasureWidth(props.notations)}px`
            }}
        >
            <StaffLines />
            <div className="notation-container">
                {staffPlacement.extractNotes(props.notations).map((note, index) => (
                    <StaffNote key={index} {...note} size={props.noteSize} />
                ))}

                {staffPlacement.extractRests(props.notations).map((rest, index) => (
                    <StaffRest key={index} {...rest} />
                ))}

                {staffPlacement.getHorizontalBeams(props.notations).map((beam, index) => (
                    <StaffNoteBeam key={index} {...beam} />
                ))}

                {getHoveredNoteElement()}
            </div>
        </div>
    )
}
