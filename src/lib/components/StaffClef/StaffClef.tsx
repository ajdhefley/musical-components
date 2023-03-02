import React from 'react'

import './StaffClef.scss'
import { Clef } from '@lib/core/models'

/**
 *
 **/
interface StaffClefProps {
    /**
     *
     **/
    clef: Clef
}

/**
 *
 **/
export function StaffClef ({ clef }: StaffClefProps): React.ReactElement {
    return <>
        <div className="clef-container">
            <div className={clef.name}></div>
        </div>
    </>
}
