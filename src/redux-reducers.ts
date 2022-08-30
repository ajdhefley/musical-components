import { AnyAction } from 'redux'
import { AppActionTypes } from './redux-actions'
import { ExerciseSelectionModel, NotePlacementModel } from './redux-models'

export interface ExerciseState {
    selectedExercise?: ExerciseSelectionModel
}

const initialExerciseState: ExerciseState = {
    selectedExercise: undefined
}

export function exerciseReducer (state = initialExerciseState, action: AnyAction): ExerciseState {
    const nextState = { ...state }

    switch (action.type) {
        case AppActionTypes.SetExerciseId: {
            nextState.selectedExercise = action.payload.exercise
        }
    }

    return nextState
}

/**************/

export interface NotePlacementState {
    note?: NotePlacementModel
}

const initialNotePlacementState: NotePlacementState = {
    note: undefined
}

export function notePlacementReducer (state = initialNotePlacementState, action: AnyAction): NotePlacementState {
    const nextState = { ...state }

    switch (action.type) {
        case AppActionTypes.PlaceNote: {
            nextState.note = action.payload.note
        }
    }

    return nextState
}
