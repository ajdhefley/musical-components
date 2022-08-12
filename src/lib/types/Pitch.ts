export enum Pitch {
    C = 0,
    D = 1,
    E = 2,
    F = 3,
    G = 4,
    A = 5,
    B = 6
}

// TODO: fetch from API
export const SharpKeys = {
    GMajor: [Pitch.F],
    DMajor: [Pitch.F, Pitch.C],
    AMajor: [Pitch.F, Pitch.C, Pitch.G],
    EMajor: [Pitch.F, Pitch.C, Pitch.G, Pitch.D],
    BMajor: [Pitch.F, Pitch.C, Pitch.G, Pitch.D, Pitch.A]
}

// TODO: fetch from API
export const FlatKeys = {
    FMajor:     [Pitch.B],
    BFlatMajor: [Pitch.B, Pitch.E],
    EFlatMajor: [Pitch.B, Pitch.E, Pitch.A],
    AFlatMajor: [Pitch.B, Pitch.E, Pitch.A, Pitch.D],
    DFlatMajor: [Pitch.B, Pitch.E, Pitch.A, Pitch.D, Pitch.G],
    GFlatMajor: [Pitch.B, Pitch.E, Pitch.A, Pitch.D, Pitch.G, Pitch.C],
    CFlatMajor: [Pitch.B, Pitch.E, Pitch.A, Pitch.D, Pitch.G, Pitch.C, Pitch.F]
}