import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import './ExerciseSelections.scss';
import App from './App';
import { setRootExercise } from '../redux-actions';
import { useAppDispatch } from '../redux-hooks';

function ExerciseSelections() {
    const dispatch = useAppDispatch();
    const { data } = useQuery(gql`
        query {
            exerciseTypes {
                exerciseTypeId,
                name,
                description,
                noteTypeOptions {
                    name
                },
                pitchTypeOptions {
                    name
                },
                clefTypeOptions {
                    name
                },
                octaveOptions
            }
        }
    `);
    
    return (
        <div className="content-wrapper">
            <p className="intro-text">Select an exercise below.</p>
            {data?.exerciseTypes.map((exerciseType) => (
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
