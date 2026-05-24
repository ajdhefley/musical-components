import { Clef, NaturalNote, Notation, NotationType, Note, Pitch, Rest } from '@lib/core/models'

export type SerializedNotationTypeName = 'thirty-second' | 'sixteenth' | 'eighth' | 'quarter' | 'half' | 'whole'
export type SerializedClefName = 'treble' | 'bass'

export type SerializedNotation =
    | {
        kind: 'note'
        type: SerializedNotationTypeName
        startBeat: number
        dotCount?: number
        pitch: number
        tieToNext?: boolean
    }
    | {
        kind: 'rest'
        type: SerializedNotationTypeName
        startBeat: number
        dotCount?: number
    }

export interface SerializedScoreDocument {
    version: 1
    beatsPerMeasure: number
    beatDuration: SerializedNotationTypeName
    clef: SerializedClefName
    sharps?: number[]
    flats?: number[]
    notations: SerializedNotation[]
}

export interface ScoreDocument {
    beatsPerMeasure: number
    beatDuration: NotationType
    clef: Clef
    sharps?: NaturalNote[]
    flats?: NaturalNote[]
    notations: Notation[]
}

export function serializeScoreDocument (score: ScoreDocument): string {
    return JSON.stringify(toSerializedScoreDocument(score))
}

export function deserializeScoreDocument (json: string): ScoreDocument {
    const parsed = JSON.parse(json) as SerializedScoreDocument
    return fromSerializedScoreDocument(parsed)
}

export function toSerializedScoreDocument (score: ScoreDocument): SerializedScoreDocument {
    const serializedNotations = score.notations.map((notation): SerializedNotation => {
        if (notation instanceof Note) {
            return {
                kind: 'note',
                type: notationTypeToName(notation.type),
                startBeat: notation.startBeat,
                dotCount: notation.dotCount,
                pitch: notation.pitch,
                tieToNext: notation.tieToNext
            }
        }

        if (notation instanceof Rest) {
            return {
                kind: 'rest',
                type: notationTypeToName(notation.type),
                startBeat: notation.startBeat,
                dotCount: notation.dotCount
            }
        }

        throw new Error('Unsupported notation class in score')
    })

    return {
        version: 1,
        beatsPerMeasure: score.beatsPerMeasure,
        beatDuration: notationTypeToName(score.beatDuration),
        clef: clefToName(score.clef),
        sharps: score.sharps,
        flats: score.flats,
        notations: serializedNotations
    }
}

export function fromSerializedScoreDocument (score: SerializedScoreDocument): ScoreDocument {
    if (score.version !== 1) {
        throw new Error(`Unsupported score version: ${score.version}`)
    }

    const notations = score.notations.map((notation): Notation => {
        const type = notationTypeFromName(notation.type)
        const dotCount = notation.dotCount ?? 0

        if (notation.kind === 'note') {
            return new Note(type, notation.pitch as Pitch, notation.startBeat, dotCount, notation.tieToNext ?? false)
        }

        if (notation.kind === 'rest') {
            return new Rest(type, notation.startBeat, dotCount)
        }

        throw new Error(`Unsupported notation kind: ${(notation as { kind: string }).kind}`)
    })

    return {
        beatsPerMeasure: score.beatsPerMeasure,
        beatDuration: notationTypeFromName(score.beatDuration),
        clef: clefFromName(score.clef),
        sharps: validateNaturalNotes(score.sharps),
        flats: validateNaturalNotes(score.flats),
        notations
    }
}

function notationTypeFromName (name: SerializedNotationTypeName): NotationType {
    switch (name) {
        case 'thirty-second':
            return NotationType.ThirtySecond
        case 'sixteenth':
            return NotationType.Sixteenth
        case 'eighth':
            return NotationType.Eighth
        case 'quarter':
            return NotationType.Quarter
        case 'half':
            return NotationType.Half
        case 'whole':
            return NotationType.Whole
    }
}

function notationTypeToName (notationType: NotationType): SerializedNotationTypeName {
    const notationName = notationType.name as SerializedNotationTypeName
    notationTypeFromName(notationName)
    return notationName
}

function clefFromName (name: SerializedClefName): Clef {
    switch (name) {
        case 'treble':
            return Clef.TrebleClef
        case 'bass':
            return Clef.BassClef
    }
}

function clefToName (clef: Clef): SerializedClefName {
    const clefName = clef.name as SerializedClefName
    clefFromName(clefName)
    return clefName
}

function validateNaturalNotes (notes?: number[]): NaturalNote[] | undefined {
    if (!notes) {
        return undefined
    }

    const validNaturalNotes = [
        NaturalNote.C,
        NaturalNote.D,
        NaturalNote.E,
        NaturalNote.F,
        NaturalNote.G,
        NaturalNote.A,
        NaturalNote.B
    ]

    if (!notes.every((note) => validNaturalNotes.includes(note as NaturalNote))) {
        throw new Error('Invalid natural note in key signature')
    }

    return notes as NaturalNote[]
}
