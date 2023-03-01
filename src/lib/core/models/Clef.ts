export class Clef {
    public static readonly TrebleClef = new Clef('treble')
    public static readonly BassClef = new Clef('bass')

    private constructor (public readonly name: string) { }
}
