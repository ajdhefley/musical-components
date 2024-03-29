import React from 'react'

import './StaffNoteBeam.scss'

/**
 *
 **/
interface StaffNoteBeamProps {
    /**
     *
     **/
    left: number

    /**
     *
     **/
    bottom: number

    /**
     *
     **/
    width: number
}

/**
 *
 **/
export function StaffNoteBeam ({ left, bottom, width }: StaffNoteBeamProps): React.ReactElement {
    return <div className="note-beam" style={{ left: `${left}px`, bottom: `${bottom}px`, width: `${width}px` }}></div>
}
