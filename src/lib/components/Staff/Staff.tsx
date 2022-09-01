import React, { useEffect } from 'react'

import '@lib/components/Staff/Staff.scss'
import { Clef, NaturalNote, NotationType, Note } from '@lib/core/models'
import { StaffController } from '@lib/components/Staff/StaffController'
import { StaffMeasure } from '@lib/components/StaffMeasure/StaffMeasure'
import { StaffKeySignature } from '@lib/components/StaffKeySignature/StaffKeySignature'
import { StaffTimeSignature } from '@lib/components/StaffTimeSignature/StaffTimeSignature'
import { StaffClef } from '@lib/components/StaffClef/StaffClef'
import { StaffLines } from '@lib/components/StaffLines/StaffLines'

/**
 *
 **/
export interface StaffProps {
    /**
     * The treble or bass clef.
     **/
    clef: Clef

    /**
     * Number of beats per measure, determining the top number of the time signature.
     **/
    beatsPerMeasure: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

    /**
     * The value of a given beat, determining the bottom number of the time signature.
     **/
    beatDuration: NotationType

    /**
     * The intended tempo of the music.
     **/
    beatsPerMinute: number

    /**
     * The pitches that are sharped, determining the major key.
     * If both sharps and flats have values, flats will be ignored.
     **/
    sharps?: NaturalNote[]

    /**
     * The pitches that are flatted, determining the major key.
     * If both sharps and flats have values, flats will be ignored.
     **/
    flats?: NaturalNote[]

    /**
     *
     **/
    initialNotes?: Note[]

    /**
     * Whether the user is allowed to place notes.
     **/
    interactive?: boolean
}

/**
 *
 **/
export function Staff (props: StaffProps): React.ReactElement {
    // const placedNote = useAppSelector((state) => state.notePlacement)
    // useEffect(() => {
    //     if (placedNote?.note) {
    //         controller.addNote(placedNote.note as Note)
    //     }
    // }, [placedNote])

    const id = Date.now().toString()
    const accidentalSize = 0
    const noteSize = 0
    const noteSpacing = 0
    const spaceHeight = 0
    const defaultStemHeight = 0

    const controller = new StaffController(props)

    useEffect(() => {
        props.initialNotes?.forEach((note) => controller.addNote(note))
    }, [])

    return <>
        <button onClick={controller.togglePlayback} style={{ display: 'block', marginBottom: '10px', padding: '5px 20px' }}>Play</button>
        <div className="staff" id={id}>
            <div className="staff-intro">
                <StaffLines />
                <StaffClef {...props} />
                <StaffKeySignature {...props} accidentalSize={accidentalSize} spaceHeight={spaceHeight} />
                <StaffTimeSignature {...props} />
            </div>
            {controller.getMeasures().map((measureNotes) => <>
                <StaffMeasure
                    {...props}
                    staffId={id}
                    notations={measureNotes}
                    noteSize={noteSize}
                    noteSpacing={noteSpacing}
                    spaceHeight={spaceHeight}
                    defaultStemHeight={defaultStemHeight}
                />
            </>)}
        </div>
    </>
}
