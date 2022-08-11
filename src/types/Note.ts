export enum Note {
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
    GMajor: [Note.F],
    DMajor: [Note.F, Note.C],
    AMajor: [Note.F, Note.C, Note.G],
    EMajor: [Note.F, Note.C, Note.G, Note.D],
    BMajor: [Note.F, Note.C, Note.G, Note.D, Note.A]
}

// TODO: fetch from API
export const FlatKeys = {
    FMajor:     [Note.B],
    BFlatMajor: [Note.B, Note.E],
    EFlatMajor: [Note.B, Note.E, Note.A],
    AFlatMajor: [Note.B, Note.E, Note.A, Note.D],
    DFlatMajor: [Note.B, Note.E, Note.A, Note.D, Note.G],
    GFlatMajor: [Note.B, Note.E, Note.A, Note.D, Note.G, Note.C],
    CFlatMajor: [Note.B, Note.E, Note.A, Note.D, Note.G, Note.C, Note.F]
}