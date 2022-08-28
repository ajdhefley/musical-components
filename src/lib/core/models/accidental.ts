export class Accidental {
    public static readonly Natural = new Accidental('natural')
    public static readonly Sharp = new Accidental('sharp')
    public static readonly Flat = new Accidental('flat')

    private constructor (public readonly name: string) { }
}
