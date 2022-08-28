import { AnyAction } from 'redux'
import { AppActionTypes } from './redux-actions'
import { ExerciseSelectionModel } from './redux-models'

export interface ExerciseState {
    selectedExercise?: ExerciseSelectionModel
}

const initialState: ExerciseState = {
    selectedExercise: undefined
}

export default function exerciseReducer (state = initialState, action: AnyAction): ExerciseState {
    const nextState = { ...state }

    switch (action.type) {
        case AppActionTypes.SetExerciseId: {
            nextState.selectedExercise = action.payload.exercise
        }
    }

    return nextState
}
