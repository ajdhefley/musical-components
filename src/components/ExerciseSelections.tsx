import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './ExerciseSelections.scss';
import App from './App';
import { setRootExercise } from '../redux-actions';
import { useAppDispatch } from '../redux-hooks';

function ExerciseSelections() {
    const dispatch = useAppDispatch();
    const [exerciseTypes, setExerciseTypes] = useState(new Array());

    useEffect(() => {
        fetch(`${process.env.API_URL}/exercise/types`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setExerciseTypes(data);
            });
    }, []);
    
    return (
        <div className="content-wrapper">
            <p className="intro-text">Select an exercise below.</p>
            {exerciseTypes.map((exerciseType) => (
                <Link className="exercise-container" to={App.Routes.ExerciseOptions} onClick={() => dispatch(setRootExercise(exerciseType))}>
                    <div className="exercise-icon"></div>
                    <div className="exercise-text">
                        <div className="exercise-title">{exerciseType.name}</div>
                        <div className="exercise-description">{exerciseType.description}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ExerciseSelections;
