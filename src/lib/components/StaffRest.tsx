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
    const RestSize: number = 50
    const SpaceHeight: number = 20

    const getClass = () => {
        return `rest rest-${model.type.getCountsPerMeasure()}`
    }

    const getStyle = () => {
        return {
            width: `${RestSize}px`,
            height: `${RestSize}px`,
            backgroundSize: `${RestSize}px ${RestSize}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            left: `${left - RestSize / 2}px`,
            bottom: `${SpaceHeight * 2 - RestSize / 2 + 2}px` // 4 staff spaces total: center at half the height (x2 instead of x4)
        }
    }

    return (
        <div className={getClass()} style={getStyle()}></div>
    )
}

export default StaffRest
