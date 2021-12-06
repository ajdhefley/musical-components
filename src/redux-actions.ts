export enum AppActionTypes {
    SetExerciseId
}

export function setExercise(id: number, name: string, description: string) {
    return {
        type: AppActionTypes.SetExerciseId,
        payload: { id, name, description }
    };
};
