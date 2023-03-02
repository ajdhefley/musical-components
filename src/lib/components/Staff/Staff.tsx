import React, { useEffect, useState } from 'react'

import './Staff.scss'
import { Clef, NaturalNote, Notation, NotationType, Note } from '@lib/core/models'
import { StaffMeasure } from '@lib/components/StaffMeasure/StaffMeasure'
import { StaffKeySignature } from '@lib/components/StaffKeySignature/StaffKeySignature'
import { StaffTimeSignature } from '@lib/components/StaffTimeSignature/StaffTimeSignature'
import { StaffClef } from '@lib/components/StaffClef/StaffClef'
import { StaffLines } from '@lib/components/StaffLines/StaffLines'
import { StaffPlayback } from '../../core/StaffPlayback'
import { MusicLogic } from '../../..'

/**
 *
 **/
interface StaffProps {
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
    initialNotations?: Notation[]

    /**
     * Whether the user is allowed to place notes.
     **/
    interactive?: boolean

    /**
     *
     **/
    playback?: StaffPlayback
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
    const accidentalSize = 50
    const noteSize = 35
    const noteSpacing = 30
    const spaceHeight = 26
    const defaultStemHeight = 120
    const musicLogic = new MusicLogic({ ...props })

    const [measures, setMeasures] = useState<Notation[][]>([])

    useEffect(() => {
        if (props.initialNotations) {
            addNotes(props.initialNotations)
        }
    }, [])

    const addNotes = function (notations: Notation[]) {
        const allNotationsFlattened = musicLogic.addNotations(measures.flat(), notations)
        setMeasures(musicLogic.splitIntoMeasures(allNotationsFlattened))
        if (props.playback) props.playback.setNotations(measures.flat())
    }

    return <>
        <div className="staff" id={id}>
            <div className="staff-intro">
                <StaffLines />
                <StaffClef {...props} />
                <StaffKeySignature {...props} accidentalSize={accidentalSize} spaceHeight={spaceHeight} />
                <StaffTimeSignature {...props} />
            </div>
            {measures.map((measureNotes: Notation[]) => <>
                <StaffMeasure
                    {...props}
                    staffId={id}
                    notations={measureNotes}
                    accidentalSize={accidentalSize}
                    noteSize={noteSize}
                    noteSpacing={noteSpacing}
                    spaceHeight={spaceHeight}
                    defaultStemHeight={defaultStemHeight}
                />
            </>)}
        </div>
    </>
}
