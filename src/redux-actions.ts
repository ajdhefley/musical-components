import { ExerciseSelectionModel } from './redux-models';

export enum AppActionTypes {
    SetExerciseId
}

export function setRootExercise(exercise: ExerciseSelectionModel) {
    return {
        type: AppActionTypes.SetExerciseId,
        payload: { exercise }
    };
};
