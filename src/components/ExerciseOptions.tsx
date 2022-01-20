import './ExerciseOptions.scss';
import App from './App';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux-hooks';
import ExercisePitchOptions from './ExercisePitchOptions';
import ExerciseNoteOptions from './ExerciseNoteOptions';
import ExerciseOctaveOptions from './ExerciseOctaveOptions';
import ExerciseClefOptions from './ExerciseClefOptions';
import { ExerciseSelectionModel } from '../redux-models';

function ExerciseOptions() {
    const exercises = useAppSelector(state => state.exercises);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseSelectionModel>();

    useEffect(() => {
        setSelectedExercise(exercises.selectedExercise);
    }, []);

    return (
        <div className="content-wrapper">
            {/* {!selectedExercise?.exerciseTypeId && <Redirect to="/error" />} */}

            <p className="intro-text">You selected {selectedExercise?.name}.</p>

            <Link className="exercise-options-continue" to={App.Routes.ExerciseSelections}>Go Back</Link>
            <Link className="exercise-options-continue" to={App.Routes.ExercisePage}>Continue</Link>

            <h1>Customize</h1>
            <h3>Basic Options</h3>
            choose difficulty
            <br />
            number of problems
            <br />
            <h3>Timer</h3>
            <input type="checkbox" id="timer-flag" /> <label htmlFor="timer-flag">Timer On/Off</label>
            <br />
            length per problem

            {selectedExercise?.noteTypeOptions && <ExerciseNoteOptions options={selectedExercise?.noteTypeOptions}  />}
            {selectedExercise?.octaveOptions && <ExerciseOctaveOptions options={selectedExercise?.octaveOptions} />}
            {selectedExercise?.pitchTypeOptions && <ExercisePitchOptions options={selectedExercise?.pitchTypeOptions} />}
            {selectedExercise?.clefTypeOptions && <ExerciseClefOptions options={selectedExercise?.clefTypeOptions} />}
        </div>
    );
};

export default ExerciseOptions;
