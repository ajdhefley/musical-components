import React from 'react'

import '@lib/components/StaffClef/StaffClef.scss'
import { Clef } from '@lib/core/models'

/**
 *
 **/
export interface StaffClefProps {
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
