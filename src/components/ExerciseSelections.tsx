import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExerciseSelectionModel } from '../models/ExerciseSelectionModel';
import { setSelectedExercise } from '../redux-actions';
import { useAppDispatch } from '../redux-hooks';
import App from './App';

import './ExerciseSelections.scss';

const ExerciseSelections = () => {
    const dispatch = useAppDispatch();
    const [exerciseList, setExerciseList] = useState<ExerciseSelectionModel[]>();

    useEffect(() => {
        fetch('http://localhost:8080/exercises/types')
            .then(response => response.json())
            .then(exercises => setExerciseList(exercises))
            .catch(err => console.error(err));
    }, []);
    
    return (
        <div className="content-wrapper">
            <p className="intro-text">Select an exercise below.</p>
            {exerciseList?.map((exercise) => (
                <Link className="exercise-container" to={App.Routes.ExerciseOptions} onClick={() => dispatch(setSelectedExercise(exercise))}>
                    <div className="exercise-icon"></div>
                    <div className="exercise-text">
                        <div className="exercise-title">{exercise.name}</div>
                        <div className="exercise-description">{exercise.description}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ExerciseSelections;
