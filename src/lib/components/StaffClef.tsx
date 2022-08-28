import React from 'react'
import './StaffClef.scss'
import { Clef } from '../types'

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
            <div className={Clef[type].toLowerCase()}></div>
        </div>
    </>
}

export default StaffClef
