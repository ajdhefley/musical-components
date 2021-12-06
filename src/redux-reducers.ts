import { AnyAction } from 'redux';
import { AppActionTypes } from './redux-actions';

export interface ExerciseState {
    id: number;
    name: string;
}

const initialState: ExerciseState = {
    id: 0,
    name: ''
};

export default function exerciseReducer(state = initialState, action: AnyAction): ExerciseState {
    const nextState = { ...state };

    switch (action.type) {
        case AppActionTypes.SetExerciseId: {
            nextState.id = action.payload.id;
            nextState.name = action.payload.name;
        }
    }

    return nextState;
}
