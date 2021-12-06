import './ExerciseOptions.scss';
import { ExerciseTypes } from '../models/ExerciseTypes';
import { useAppSelector } from '../redux-hooks';
import { ExerciseState } from '../redux-reducers';
import App from './App';
import ExercisePitchOptions from './ExercisePitchOptions';
import ExerciseNoteOptions from './ExerciseNoteOptions';
import ExerciseOctaveOptions from './ExerciseOctaveOptions';
import { Redirect } from 'react-router-dom';

const ExercisesWithNoteOptions = [
    ExerciseTypes.NoteRecognitionSight,
    ExerciseTypes.NoteRecognitionSound,
    ExerciseTypes.RestRecognition
];

const ExercisesWithOctaveOptions = [
    ExerciseTypes.NoteRecognitionSight,
    ExerciseTypes.NoteRecognitionSound,
    ExerciseTypes.ScaleRecognitionSound,
    ExerciseTypes.NoteInput,
];

const ExercisesWithPitchOptions = [
    ExerciseTypes.KeyRecognitionSight,
    ExerciseTypes.KeyRecognitionSound,
    ExerciseTypes.NoteRecognitionSight,
    ExerciseTypes.NoteRecognitionSound,
    ExerciseTypes.ScaleRecognitionSight,
    ExerciseTypes.ScaleRecognitionSound,
    ExerciseTypes.NoteInput,
    ExerciseTypes.ScaleInput,
];

const ExerciseOptions = () => {
    const exercise = useAppSelector(
        (state: { currentExercise: ExerciseState }) => state.currentExercise
    );

    const exerciseType = exercise.id as ExerciseTypes;
    const exerciseRoute = App.Routes.ExercisePage.replace(':id', exercise?.id?.toString()) + '?TODO';

    return (
        <div className="exercise-options-wrapper">
            {!exercise.id && <Redirect to="/error" />}
            <p className="intro-text">You selected {exercise.name}.</p>
            <a className="exercise-options-continue" href={exerciseRoute}>Continue</a>
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

            {ExercisesWithNoteOptions.includes(exerciseType) && (
                <div>
                    <h3>Exclude Notes</h3>
                    <ExerciseNoteOptions />
                </div>
            )}

            {ExercisesWithOctaveOptions.includes(exerciseType) && (
                <div>
                    <h3>Exclude Octaves</h3>
                    <ExerciseOctaveOptions />
                </div>
            )}
            
            {ExercisesWithPitchOptions.includes(exerciseType) && (
                <div>
                    <h3>Exclude Pitches</h3>
                    <ExercisePitchOptions />
                </div>
            )}
        </div>
    );
}

export default ExerciseOptions;
