import React from 'react'

import './StaffClef.scss'
import { Clef } from '../core/models'

/**
 *
 **/
interface StaffClefProps {
    /**
     *
     **/
    type: Clef
}

/**
 *
 **/
function StaffClef ({ type }: StaffClefProps): React.ReactElement {
    return <>
        <div className="clef-container">
            <div className={type.name}></div>
        </div>
    </>
}

export default StaffClef
