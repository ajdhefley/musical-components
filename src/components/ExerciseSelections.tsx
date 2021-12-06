import { Link } from 'react-router-dom';
import { ExerciseModel } from '../models/ExerciseModel';
import { setExercise } from '../redux-actions';
import { useAppDispatch } from '../redux-hooks';
import App from './App';

import './ExerciseSelections.scss';

const ExerciseSelections = () => {
    const dispatch = useAppDispatch();

    const exercises: ExerciseModel[] = [
        new ExerciseModel(1, 'Scale Recognition (Sound)', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
        new ExerciseModel(2, 'Scale Recognition (Sight)', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
        new ExerciseModel(3, 'Key Recognition (Sound)', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
        new ExerciseModel(4, 'Key Recognition (Sight)', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
        new ExerciseModel(5, 'Note Recognition (Sound)', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
        new ExerciseModel(6, 'Note Recognition (Sight)', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
        new ExerciseModel(7, 'Rest Recognition', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
        new ExerciseModel(8, '???', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
        new ExerciseModel(9, 'Note Input', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
        new ExerciseModel(10, 'Scale Input', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')
    ];
    
    return (
        <div className="exercise-selection-wrapper">
            <p className="intro-text">Select an exercise below.</p>
            {exercises.map((exercise) => (
                <Link className="exercise-container" to={App.Routes.ExerciseOptions} onClick={() => dispatch(setExercise(exercise.id, exercise.name, exercise.description))}>
                    <div className="exercise-icon"></div>
                    <div className="exercise-text">
                        <div className="exercise-title">{exercise.name}</div>
                        <div className="exercise-description">{exercise.description}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ExerciseSelections;
