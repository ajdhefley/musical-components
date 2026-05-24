import React, { useEffect, useRef, useState } from 'react'

import './StaffMeasure.scss'
import { Clef, Notation, NotationType, Note } from '@lib/core/models'
import { MusicStaffPlacementLogic, MusicStaffPlacementLogicConfig } from '@lib/core/MusicStaffPlacementLogic'
import { StaffNote } from '@lib/components/StaffNote/StaffNote'
import { StaffRest } from '@lib/components/StaffRest/StaffRest'
import { StaffLines } from '@lib/components/StaffLines/StaffLines'
import { StaffNoteBeam } from '@lib/components/StaffNoteBeam/StaffNoteBeam'
import { StaffNoteTie } from '@lib/components/StaffNoteTie/StaffNoteTie'

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
    notations: Notation[]

    /**
     * All render layout and key/time context for this staff.
     **/
    renderConfig: MusicStaffPlacementLogicConfig

    /**
     *
     **/
    interactive?: boolean
}

/**
 *
 **/
export function StaffMeasure (props: StaffMeasureProps): React.ReactElement {
    const ref = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState<{x: number, y: number}>(({ x: 0, y: 0 }))

    const id = `${props.staffId}-${props.notations?.length > 0 ? props.notations[0].startBeat : '0'}`

    const getHoveredNoteElement = function () {
        const note = getHoveredNote(mousePosition)

        if (!note) {
            return undefined
        }

        const leftPosition = mousePosition.x
        const bottomPosition = MusicStaffPlacementLogic.getNoteBottomPosition(note.pitch, props.renderConfig)

        return <StaffNote model={note} accidentalSize={props.renderConfig.accidentalSize} size={props.renderConfig.noteSize} left={leftPosition} bottom={bottomPosition} />
    }

    const getHoveredNote = function (mousePosition: { x: number, y: number }) {
        if (mousePosition.x === 0 && mousePosition.y === 0) {
            return null
        }

        const noteIndex = Math.floor(mousePosition.y / (props.renderConfig.spaceHeight / 2))

        let pitch = props.renderConfig.clef === Clef.TrebleClef ? 55 : 49

        switch (noteIndex) {
            case 0:
                pitch -= props.renderConfig.clef === Clef.TrebleClef ? 3 : 4
                break
            case 1:
                pitch -= props.renderConfig.clef === Clef.TrebleClef ? 2 : 2
                break
            case 2:
                pitch += props.renderConfig.clef === Clef.TrebleClef ? 0 : 0
                break
            case 3:
                pitch += props.renderConfig.clef === Clef.TrebleClef ? 2 : 1
                break
            case 4:
                pitch += props.renderConfig.clef === Clef.TrebleClef ? 4 : 3
                break
            case 5:
                pitch += props.renderConfig.clef === Clef.TrebleClef ? 5 : 4
                break
            case 6:
                pitch += props.renderConfig.clef === Clef.TrebleClef ? 7 : 7
                break
            case 7:
                pitch += props.renderConfig.clef === Clef.TrebleClef ? 9 : 9
                break
            case 8:
                pitch += props.renderConfig.clef === Clef.TrebleClef ? 10 : 10
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
                width: `${MusicStaffPlacementLogic.getMeasureWidth(props.notations, props.renderConfig)}px`
            }}
        >
            <StaffLines />
            <div className="notation-container">
                {MusicStaffPlacementLogic.extractNotes(props.notations, props.renderConfig).map((note, index) => (
                    <StaffNote key={index} {...note} size={props.renderConfig.noteSize} accidentalSize={props.renderConfig.accidentalSize} />
                ))}

                {MusicStaffPlacementLogic.extractRests(props.notations, props.renderConfig).map((rest, index) => (
                    <StaffRest key={index} {...rest} />
                ))}

                {MusicStaffPlacementLogic.getHorizontalBeams(props.notations, props.renderConfig).map((beam, index) => (
                    <StaffNoteBeam key={index} {...beam} />
                ))}

                {MusicStaffPlacementLogic.getTies(props.notations, props.renderConfig).map((tie, index) => (
                    <StaffNoteTie key={index} {...tie} />
                ))}

                {getHoveredNoteElement()}
            </div>
        </div>
    )
}

