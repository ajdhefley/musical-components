import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from './redux-reducers';

export const store = configureStore({
    reducer: {
        exercises: exerciseReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
