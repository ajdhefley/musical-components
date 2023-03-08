export class NotationType {
    public static readonly ThirtySecond = new NotationType('thirty-second', 1 / 32)
    public static readonly Sixteenth = new NotationType('sixteenth', 1 / 16)
    public static readonly Eighth = new NotationType('eighth', 1 / 8)
    public static readonly Quarter = new NotationType('quarter', 1 / 4)
    public static readonly Half = new NotationType('half', 1 / 2)
    public static readonly Whole = new NotationType('whole', 1)

    /**
     * Determines note type from the given duration.
     *
     * @param notationDuration Numerical representation of notation's duration, falling within a note type window.
     *
     * @returns {NotationType} Note falling within window of beat value, or undefined if not a valid beat value.
     **/
    static getNotationTypeFromDuration (notationDuration: number) {
        if (notationDuration <= NotationType.ThirtySecond.beatValue) {
            return NotationType.ThirtySecond
        } else if (notationDuration <= this.Sixteenth.beatValue) {
            return NotationType.Sixteenth
        } else if (notationDuration <= this.Eighth.beatValue) {
            return NotationType.Eighth
        } else if (notationDuration <= this.Quarter.beatValue) {
            return NotationType.Quarter
        } else if (notationDuration <= this.Half.beatValue) {
            return NotationType.Half
        } else if (notationDuration <= this.Whole.beatValue) {
            return NotationType.Whole
        } else {
            throw Error()
        }
    }

    /**
     * Determines how many of this note is equal to one measure.
     *
     * @param beatsPerMeasure Number of total beats in the measure, which affects the number of counts.
     * @param measureBeatType The type of note that registers as one beat in the measure.
     *
     * @returns {number} How many of this type of note can fit into a single measure.
     **/
    getCountsPerMeasure (beatsPerMeasure: number = 4, measureBeatType: NotationType = NotationType.Quarter) {
        return Math.floor(1 / this.beatValue * beatsPerMeasure / 4 * (measureBeatType.beatValue / 0.25))
    }

    private constructor (public readonly name: string, public readonly beatValue: number) { }
}
