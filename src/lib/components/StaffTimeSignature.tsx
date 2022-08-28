import React from 'react'

import './StaffTimeSignature.scss'
import { NaturalNote, NotationType } from '../core/models'

interface StaffTimeSignatureProps {
    /**
     * Number of beats per measure, determining the top number of the time signature.
     **/
    beatsPerMeasure: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

    /**
     * The value of a given beat, determining the bottom number of the time signature.
     **/
    beatDuration: NotationType

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
}

function StaffTimeSignature ({ beatsPerMeasure, beatDuration, sharps, flats }: StaffTimeSignatureProps): React.ReactElement {
    const ClefWidth: number = 50
    const KeySize: number = 17

    const getTimeSignature = () => {
        return <>
            <div className={`ts-top ts-${beatsPerMeasure}`}></div>
            <div className={`ts-bottom ts-${beatDuration.getCountPerMeasure()}`}></div>
        </>
    }

    const getTimeSignatureStyle = () => {
        return {
            left: `${((sharps?.length ?? 0) + (flats?.length ?? 0)) * KeySize + ClefWidth + 20}px`
        }
    }

    return <div className="ts-container" style={getTimeSignatureStyle()}>{getTimeSignature()}</div>
}

export default StaffTimeSignature
