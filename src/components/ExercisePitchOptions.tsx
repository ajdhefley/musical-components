import React from 'react'

import './ExercisePitchOptions.scss'

function ExercisePitchOptions (): React.ReactElement {
    const options = [
        { name: 'C', value: 1, natural: true },
        { name: 'C/D', value: 2, natural: false },
        { name: 'D', value: 3, natural: true },
        { name: 'D/E', value: 4, natural: false },
        { name: 'E', value: 5, natural: true },
        { name: 'F', value: 6, natural: true },
        { name: 'F/G', value: 7, natural: false },
        { name: 'G', value: 8, natural: true },
        { name: 'G/A', value: 9, natural: false },
        { name: 'A', value: 10, natural: true },
        { name: 'A/B', value: 11, natural: false },
        { name: 'B', value: 12, natural: true }
    ]

    return (
        <div className="exercise-options-pitch">
            <h3>Exclude Pitches</h3>
            {options.map((pitch) => <div key={pitch.value}>
                <input
                    type="checkbox"
                    id={`exclude-${pitch.name}`}
                />
                <label htmlFor={`exclude-${pitch.name}`}>{pitch.name}</label>
            </div>)}
        </div>
    )
}

export default ExercisePitchOptions
