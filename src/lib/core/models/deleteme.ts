import { NaturalNote } from './natural-note'

// TODO: fetch from API
export const SharpKeys = {
    GMajor: [NaturalNote.F],
    DMajor: [NaturalNote.F, NaturalNote.C],
    AMajor: [NaturalNote.F, NaturalNote.C, NaturalNote.G],
    EMajor: [NaturalNote.F, NaturalNote.C, NaturalNote.G, NaturalNote.D],
    BMajor: [NaturalNote.F, NaturalNote.C, NaturalNote.G, NaturalNote.D, NaturalNote.A]
}

// TODO: fetch from API
export const FlatKeys = {
    FMajor: [NaturalNote.B],
    BFlatMajor: [NaturalNote.B, NaturalNote.E],
    EFlatMajor: [NaturalNote.B, NaturalNote.E, NaturalNote.A],
    AFlatMajor: [NaturalNote.B, NaturalNote.E, NaturalNote.A, NaturalNote.D],
    DFlatMajor: [NaturalNote.B, NaturalNote.E, NaturalNote.A, NaturalNote.D, NaturalNote.G],
    GFlatMajor: [NaturalNote.B, NaturalNote.E, NaturalNote.A, NaturalNote.D, NaturalNote.G, NaturalNote.C],
    CFlatMajor: [NaturalNote.B, NaturalNote.E, NaturalNote.A, NaturalNote.D, NaturalNote.G, NaturalNote.C, NaturalNote.F]
}
