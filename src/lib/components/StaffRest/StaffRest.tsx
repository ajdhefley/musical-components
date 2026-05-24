import React from 'react'

import './StaffRest.scss'
import { Rest } from '@lib/core/models'

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
export function StaffRest ({ model, left }: StaffRestProps): React.ReactElement {
    return (
        <div className={`rest rest-${model.type.getPerMeasureCount()}`} style={{ left: `${left}px` }}>
            {Array.from({ length: model.dotCount }, (_, index) => (
                <div
                    key={index}
                    className="duration-dot"
                    style={{
                        left: `${34 + (index * 10)}px`
                    }}
                ></div>
            ))}
        </div>
    )
}
