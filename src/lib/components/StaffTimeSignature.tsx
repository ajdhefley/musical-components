import React from 'react'

import './StaffTimeSignature.scss'
import { NotationType } from '../core/models'

interface StaffTimeSignatureProps {
    /**
     * Number of beats per measure, determining the top number of the time signature.
     **/
    beatsPerMeasure: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

    /**
     * The value of a given beat, determining the bottom number of the time signature.
     **/
    beatDuration: NotationType
}

function StaffTimeSignature ({ beatsPerMeasure, beatDuration }: StaffTimeSignatureProps): React.ReactElement {
    return <>
        <div className="ts-container">
            <div className={`ts-top ts-${beatsPerMeasure}`}></div>
            <div className={`ts-bottom ts-${beatDuration.getCountsPerMeasure()}`}></div>
        </div>
    </>
}

export default StaffTimeSignature
