export class ExerciseSelectionModel {
    exerciseTypeId: number;
    name: string;
    description: string;
    noteTypeOptions?: { name: string, value: number }[];
    octaveOptions?: number[];
    pitchTypeOptions?: { name: string, value: number }[];
    clefTypeOptions?: { name: string }[];
}
