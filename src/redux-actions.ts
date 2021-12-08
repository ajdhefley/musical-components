import { ExerciseSelectionModel } from "./models/ExerciseSelectionModel";

export enum AppActionTypes {
    SetExerciseId
}

export function setSelectedExercise(exercise: ExerciseSelectionModel) {
    return {
        type: AppActionTypes.SetExerciseId,
        payload: { exercise }
    };
};
