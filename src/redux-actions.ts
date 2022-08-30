import { ExerciseSelectionModel, NotePlacementModel } from './redux-models'

export enum AppActionTypes {
    SetExerciseId,
    PlaceNote
}

export function setRootExercise (exercise: ExerciseSelectionModel) {
    return {
        type: AppActionTypes.SetExerciseId,
        payload: { exercise }
    }
}

export function placeNote (note: NotePlacementModel) {
    return {
        type: AppActionTypes.PlaceNote,
        payload: { note }
    }
}
