import React from 'react'

import './StaffRest.scss'
import { Rest } from '../core/models'

/**
 *
 **/
interface StaffRestProps {
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
function StaffRest ({ model, left }: StaffRestProps): React.ReactElement {
    return (
        <div className={`rest rest-${model.type.getCountsPerMeasure()}`} style={{ left: `${left}px` }}></div>
    )
}

export default StaffRest
