import React from 'react'

import './StaffNoteTie.scss'

interface StaffNoteTieProps {
    left: number
    bottom: number
    width: number
    flip?: boolean
}

export function StaffNoteTie ({ left, bottom, width, flip = false }: StaffNoteTieProps): React.ReactElement {
    return (
        <div
            className={`note-tie ${flip ? 'flip' : ''}`}
            style={{
                left: `${left}px`,
                bottom: `${bottom}px`,
                width: `${width}px`
            }}
        ></div>
    )
}