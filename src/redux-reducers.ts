import { AnyAction } from 'redux';
import { ExerciseSelectionModel } from './models/ExerciseSelectionModel';
import { AppActionTypes } from './redux-actions';

export interface ExerciseState {
    selectedExercise: ExerciseSelectionModel;
}

const initialState: ExerciseState = {
    selectedExercise: null
}

export default function exerciseReducer(state = initialState, action: AnyAction): ExerciseState {
    const nextState = { ...state };

    switch (action.type) {
        case AppActionTypes.SetExerciseId: {
            nextState.selectedExercise = action.payload.exercise;
        }
    }

    return nextState;
}
