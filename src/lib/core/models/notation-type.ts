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
     * @returns Notation type falling within window of beat value, or undefined if not a valid beat value.
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
     * Determines how many beats this note lasts.
     *
     * @returns Number of beats this note type lasts per measure.
     **/
    getBeatsPerMeasure () {
        return this.beatValue * 4
    }

    /**
     * Determines how many of this note equals one measure.
     *
     * @returns How many of this type of note can fit into a single measure.
     **/
    getCountPerMeasure () {
        return 1 / this.beatValue
    }

    /**
     * The value of a beat proportional to one measure.
     *
     * @returns One divided by the counts per measure (E.G. thirty-second note is 32 counts per measure, or 1/32 = 0.03125)
     **/
    getBeatValue () {
        return this.beatValue
    }

    private constructor (public readonly name: string, public readonly beatValue: number) { }
}
