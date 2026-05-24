import React, { useEffect, useState } from 'react'

import './Staff.scss'
import { Notation, NotationType } from '@lib/core/models'
import { ScoreStaff } from '@lib/core/Score'
import { StaffMeasure } from '@lib/components/StaffMeasure/StaffMeasure'
import { StaffKeySignature } from '@lib/components/StaffKeySignature/StaffKeySignature'
import { StaffTimeSignature } from '@lib/components/StaffTimeSignature/StaffTimeSignature'
import { StaffClef } from '@lib/components/StaffClef/StaffClef'
import { StaffLines } from '@lib/components/StaffLines/StaffLines'
import { MusicLogic, MusicLogicConfig } from '@lib/core/MusicLogic'
import { MusicStaffPlacementLogicConfig } from '@lib/core/MusicStaffPlacementLogic'

/**
 *
 **/
interface StaffProps {
    /**
     * The staff data: clef, key signature, and optional id.
     **/
    staff: ScoreStaff

    /**
     * Number of beats per measure, determining the top number of the time signature.
     **/
    beatsPerMeasure: number

    /**
     * The value of a given beat, determining the bottom number of the time signature.
     **/
    beatDuration: NotationType

    /**
     * All notations for this staff, pre-processed from the score voice(s).
     **/
    notations: Notation[]

    /**
     * Whether the user is allowed to place notes.
     **/
    interactive?: boolean
}

/**
 *
 **/
export function Staff (props: StaffProps): React.ReactElement {
    const id = Date.now().toString()
    const accidentalSize = 50
    const noteSize = 35
    const noteSpacing = 30
    const spaceHeight = 26
    const defaultStemHeight = noteSize * 2.5

    const renderConfig: MusicStaffPlacementLogicConfig = {
        accidentalSize,
        noteSize,
        noteSpacing,
        spaceHeight,
        defaultStemHeight,
        clef: props.staff.clef,
        sharps: props.staff.sharps,
        flats: props.staff.flats,
        beatsPerMeasure: props.beatsPerMeasure,
        beatDuration: props.beatDuration
    }

    const musicConfig: MusicLogicConfig = {
        sharps: props.staff.sharps,
        flats: props.staff.flats,
        beatsPerMeasure: props.beatsPerMeasure,
        beatDuration: props.beatDuration
    }

    const [measures, setMeasures] = useState<Notation[][]>([])

    useEffect(() => {
        setMeasures(MusicLogic.splitIntoMeasures(props.notations, musicConfig))
    }, [props.notations])

    return <>
        <div className="staff" id={id}>
            <div className="staff-intro">
                <StaffLines />
                <StaffClef clef={props.staff.clef} />
                <StaffKeySignature renderConfig={renderConfig} />
                <StaffTimeSignature beatsPerMeasure={props.beatsPerMeasure} beatDuration={props.beatDuration} />
            </div>
            {measures.map((measureNotes: Notation[], index) => (
                <StaffMeasure
                    key={index}
                    staffId={id}
                    notations={measureNotes}
                    renderConfig={renderConfig}
                    interactive={props.interactive}
                />
            ))}
        </div>
    </>
}

