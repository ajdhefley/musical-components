export enum Duration {
    Whole = 1,
    Half = 2,
    Quarter = 4,
    Eighth = 8,
    Sixteenth = 16,
    ThirtySecond = 32
}

export type BeatsPerMeasureType = 2|3|4|5|6|7|8|9|10|11|12|13|14|15|16;

export function getDurationTypeFromValue(duration: number) {
    switch (duration) {
        case 1/Duration.Whole: return Duration.Whole;
        case 1/Duration.Half: return Duration.Half;
        case 1/Duration.Quarter: return Duration.Quarter;
        case 1/Duration.Eighth: return Duration.Eighth;
        case 1/Duration.Sixteenth: return Duration.Sixteenth;
        case 1/Duration.ThirtySecond: return Duration.ThirtySecond;
    }
}