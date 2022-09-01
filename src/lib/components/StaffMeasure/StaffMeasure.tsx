import React, { useEffect, useRef, useState } from 'react'

import '@lib/components/StaffMeasure/StaffMeasure.scss'
import { Clef, NaturalNote, Notation, NotationType } from '@lib/core/models'
import { StaffMeasureController } from '@lib/components/StaffMeasure/StaffMeasureController'
import { StaffNote } from '@lib/components/StaffNote/StaffNote'
import { StaffRest } from '@lib/components/StaffRest/StaffRest'
import { StaffLines } from '@lib/components/StaffLines/StaffLines'
import { StaffNoteBeam } from '@lib/components/StaffNoteBeam/StaffNoteBeam'

// TODO: decouple from outer Redux
import { useAppDispatch } from '../../../redux-hooks'
import { placeNote } from '../../../redux-actions'

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
    // return this.noteSize * 3 - (this.noteSize / 2);
    // }
    defaultStemHeight: number
}

/**
 *
 **/
export function StaffMeasure (props: StaffMeasureProps): React.ReactElement {
    const dispatch = useAppDispatch()
    const ref = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState<{x: number, y: number}>(({ x: 0, y: 0 }))

    const controller = new StaffMeasureController(props)

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

    const id = `${props.staffId}-${props.notations?.length > 0 ? props.notations[0].startBeat : '0'}`

    const onClick = () => {
        const note = controller.getHoveredNote(mousePosition)
        if (note) {
            dispatch(placeNote(note))
        }
    }

    const getHoveredNoteElement = () => {
        const note = controller.getHoveredNote(mousePosition)

        if (!note) {
            return undefined
        }

        const leftPosition = mousePosition.x
        const bottomPosition = controller.getNotationBottomPosition(note.pitch)

        return <StaffNote model={note} size={props.noteSize} left={leftPosition} bottom={bottomPosition} />
    }

    return (
        <div
            id={id}
            ref={ref}
            onClick={onClick}
            className="staff-measure"
            style={{
                width: `${controller.getMeasureWidth()}px`
            }}
        >
            <StaffLines />
            <div className="notation-container">
                {controller.getNotes().map((note, index) => (
                    <StaffNote key={index} {...note} />
                ))}

                {controller.getRests().map((rest, index) => (
                    <StaffRest key={index} {...rest} />
                ))}

                {controller.getHorizontalBeams().map((beam, index) => (
                    <StaffNoteBeam key={index} {...beam} />
                ))}

                {getHoveredNoteElement()}
            </div>
        </div>
    )
}
