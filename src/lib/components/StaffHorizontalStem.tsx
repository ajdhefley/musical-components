import React from 'react'

import './StaffHorizontalStem.scss'

/**
 *
 **/
interface StaffHorizontalStemProps {
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
function StaffHorizontalStem ({ left, bottom, width }: StaffHorizontalStemProps): React.ReactElement {
    return <div className="horizontal-stem" style={{ left: `${left}px`, bottom: `${bottom}px`, width: `${width}px` }}></div>
}

export default StaffHorizontalStem
