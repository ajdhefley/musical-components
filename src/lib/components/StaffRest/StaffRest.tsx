import React from 'react'

import '@lib/components/StaffRest/StaffRest.scss'
import { Rest } from '@lib/core/models'

/**
 *
 **/
export interface StaffRestProps {
    /**
     *
     **/
    model: Rest

    /**
     *
     **/
    left: number
}

/**
 *
 **/
export function StaffRest ({ model, left }: StaffRestProps): React.ReactElement {
    return (
        <div className={`rest rest-${model.type.getCountsPerMeasure()}`} style={{ left: `${left}px` }}></div>
    )
}
