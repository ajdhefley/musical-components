export class NotationType {
    public static readonly ThirtySecond = new NotationType('thirty-second', 1 / 32)
    public static readonly Sixteenth = new NotationType('sixteenth', 1 / 16)
    public static readonly Eighth = new NotationType('eighth', 1 / 8)
    public static readonly Quarter = new NotationType('quarter', 1 / 4)
    public static readonly Half = new NotationType('half', 1 / 2)
    public static readonly Whole = new NotationType('whole', 1)

    /**
     * Determines how many of this note is equal to one measure.
     *
     * @param beatsPerMeasure Number of total beats in the measure, which affects the number of counts.
     * @param measureBeatType The type of note that registers as one beat in the measure.
     *
     * @returns {number} How many of this type of note can fit into a single measure.
     **/
    public getCountsPerMeasure (beatsPerMeasure: number = 4, measureBeatType: NotationType = NotationType.Quarter) {
        return Math.floor(1 / this.beatValue * beatsPerMeasure / 4 * (measureBeatType.beatValue / 0.25))
    }

    public getPerMeasureCount () {
        if (this === NotationType.Whole) return 1
        if (this === NotationType.Half) return 2
        if (this === NotationType.Quarter) return 4
        if (this === NotationType.Eighth) return 8
        if (this === NotationType.Sixteenth) return 16
        return 32
    }

    public getFlagCount () {
        if (this === NotationType.Eighth) return 1
        if (this === NotationType.Sixteenth) return 2
        if (this === NotationType.ThirtySecond) return 3
        return 0
    }

    public usesStem () {
        return this !== NotationType.Whole
    }

    private constructor (public readonly name: string, public readonly beatValue: number) {}
}
