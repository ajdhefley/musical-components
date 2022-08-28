import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import './ExerciseSelections.scss'
import App from './App'
import { setRootExercise } from '../redux-actions'
import { useAppDispatch } from '../redux-hooks'

function ExerciseSelections (): React.ReactElement {
    const dispatch = useAppDispatch()
    const [exerciseTypes, setExerciseTypes] = useState<any[]>()

    useEffect(() => {
        const apiUrl: string = process.env.API_URL ?? ''
        fetch(`${apiUrl}/exercise/types`)
            .then(async (res) => await res.json())
            .then((data) => {
                setExerciseTypes(data)
            })
    }, [])

    return (
        <div className="content-wrapper">
            <p className="intro-text">Select an exercise below.</p>
            {exerciseTypes?.map((exerciseType) => (
                <Link
                    key={exerciseType.exerciseTypeId}
                    className="exercise-container"
                    to={App.Routes.ExerciseOptions}
                    onClick={() => dispatch(setRootExercise(exerciseType))}
                >
                    <div className="exercise-icon"></div>
                    <div className="exercise-text">
                        <div className="exercise-title">{exerciseType.name}</div>
                        <div className="exercise-description">{exerciseType.description}</div>
                    </div>
                </Link>
            ))}
        </div>
    )
};

export default ExerciseSelections
