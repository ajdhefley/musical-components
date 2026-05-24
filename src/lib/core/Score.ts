import { Chord, Clef, NaturalNote, NotationType, Note, Pitch, Rest } from '@lib/core/models'
import { SerializedNotationTypeName, SerializedClefName } from '@lib/core/ScoreDocument'

/**
 * Supported notation objects inside a full score.
 */
export type ScoreNotation = Note | Rest | Chord

/**
 * A single rhythmic lane on a staff.
 */
export interface ScoreVoice {
    id?: string
    notations: ScoreNotation[]
}

/**
 * A staff within a score, including its clef, key signature, and one or more voices.
 */
export interface ScoreStaff {
    id?: string
    clef: Clef
    sharps?: NaturalNote[]
    flats?: NaturalNote[]
    voices: ScoreVoice[]
}

/**
 * In-memory representation of a multi-staff score.
 */
export interface Score {
    beatsPerMeasure: number
    beatDuration: NotationType
    staves: ScoreStaff[]
}

/**
 * JSON-safe representation of a notation object inside a serialized score.
 */
export type SerializedScoreNotation =
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
    | {
        kind: 'chord'
        type: SerializedNotationTypeName
        startBeat: number
        dotCount?: number
        pitches: number[]
    }

/**
 * JSON-safe representation of a voice inside a serialized score.
 */
export interface SerializedScoreVoice {
    id?: string
    notations: SerializedScoreNotation[]
}

/**
 * JSON-safe representation of a staff inside a serialized score.
 */
export interface SerializedScoreStaff {
    id?: string
    clef: SerializedClefName
    sharps?: number[]
    flats?: number[]
    voices: SerializedScoreVoice[]
}

/**
 * Versioned JSON schema for a full multi-staff score.
 */
export interface SerializedScore {
    version: 1
    beatsPerMeasure: number
    beatDuration: SerializedNotationTypeName
    staves: SerializedScoreStaff[]
}

/**
 * Converts a full in-memory score into a JSON string.
 */
export function serializeScore (score: Score): string {
    return JSON.stringify(toSerializedScore(score))
}

/**
 * Parses a JSON string produced by serializeScore back into model instances.
 */
export function deserializeScore (json: string): Score {
    const parsed = JSON.parse(json) as SerializedScore
    return fromSerializedScore(parsed)
}

/**
 * Converts a full score into its versioned JSON-safe shape.
 */
export function toSerializedScore (score: Score): SerializedScore {
    return {
        version: 1,
        beatsPerMeasure: score.beatsPerMeasure,
        beatDuration: notationTypeToName(score.beatDuration),
        staves: score.staves.map((staff): SerializedScoreStaff => ({
            id: staff.id,
            clef: clefToName(staff.clef),
            sharps: staff.sharps,
            flats: staff.flats,
            voices: staff.voices.map((voice): SerializedScoreVoice => ({
                id: voice.id,
                notations: voice.notations.map((notation): SerializedScoreNotation => {
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

                    if (notation instanceof Chord) {
                        return {
                            kind: 'chord',
                            type: notationTypeToName(notation.type),
                            startBeat: notation.startBeat,
                            dotCount: notation.dotCount,
                            pitches: notation.pitches
                        }
                    }

                    throw new Error('Unsupported notation class in score')
                })
            }))
        }))
    }
}

/**
 * Converts a parsed JSON-safe score into note, rest, and chord model instances.
 */
export function fromSerializedScore (score: SerializedScore): Score {
    if (score.version !== 1) {
        throw new Error(`Unsupported score version: ${score.version}`)
    }

    return {
        beatsPerMeasure: score.beatsPerMeasure,
        beatDuration: notationTypeFromName(score.beatDuration),
        staves: score.staves.map((staff): ScoreStaff => ({
            id: staff.id,
            clef: clefFromName(staff.clef),
            sharps: validateNaturalNotes(staff.sharps),
            flats: validateNaturalNotes(staff.flats),
            voices: staff.voices.map((voice): ScoreVoice => ({
                id: voice.id,
                notations: voice.notations.map((notation): ScoreNotation => {
                    const type = notationTypeFromName(notation.type)
                    const dotCount = notation.dotCount ?? 0

                    if (notation.kind === 'note') {
                        return new Note(type, notation.pitch as Pitch, notation.startBeat, dotCount, notation.tieToNext ?? false)
                    }

                    if (notation.kind === 'rest') {
                        return new Rest(type, notation.startBeat, dotCount)
                    }

                    if (notation.kind === 'chord') {
                        return new Chord(type, notation.pitches as Pitch[], notation.startBeat, dotCount)
                    }

                    throw new Error(`Unsupported notation kind: ${(notation as { kind: string }).kind}`)
                })
            }))
        }))
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
