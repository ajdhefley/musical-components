import { Accidental, NaturalNote, Notation, NotationType, Pitch, Rest } from '@lib/core/models'

export type MusicLogicConfig = {
    sharps?: NaturalNote[]
    flats?: NaturalNote[]
    beatsPerMeasure: number
    beatDuration: NotationType
}

export class MusicLogic {
    private static readonly BaseNotationTypes = [
        NotationType.ThirtySecond,
        NotationType.Sixteenth,
        NotationType.Eighth,
        NotationType.Quarter,
        NotationType.Half,
        NotationType.Whole
    ]

    /**
     * Returns the NotationType singleton matching the given exact beat value.
     *
     * @param notationDuration Numerical representation of notation's duration.
     * @returns {NotationType} The matching singleton, or throws if not found.
     **/
    public static getNotationTypeFromDuration (notationDuration: number) {
        const match = MusicLogic.BaseNotationTypes
            .find((t) => MusicLogic.areDurationsEqual(t.beatValue, notationDuration))

        if (!match) {
            throw Error(`Unsupported notation duration: ${notationDuration}`)
        }

        return match
    }

    /**
     * Determines which accidental (sharp, flat, natural, or none) should be displayed
     * next to note, based on whether the note is sharped or flatted by key signature.
     *
     * @param pitch The pitch (numerical representation of note plus octave).
     * @param defaultSharpedPitches The natural notes sharped by key. For example, in D Major, C and F are sharped.
     * @param defaultFlattedPitches The natural notes flatted by key. For example, in F major, B is flatted.
     * @returns {Accidental} undefined if note is not sharped/flatted, or is not a natural of a note sharped/flatted in the key signature.
     **/
    public static getAccidentalForPitch (pitch: Pitch, config: MusicLogicConfig): Accidental | undefined {
        const noteFromPitch = pitch % 12 as NaturalNote
        const sharpedInKey = config.sharps?.includes(noteFromPitch) ?? false
        const flattedInKey = config.flats?.includes(noteFromPitch) ?? false
        const prevNoteSharpedInKey = config.sharps?.includes(noteFromPitch - 1) ?? false
        const nextNoteFlattedInKey = config.flats?.includes(noteFromPitch + 1) ?? false
        const isNatural = Object.values(NaturalNote).includes(noteFromPitch)

        let accidental

        if (isNatural && (sharpedInKey || flattedInKey)) {
            accidental = Accidental.Natural
        } else if (!isNatural && !prevNoteSharpedInKey && !config.flats?.length) {
            accidental = Accidental.Sharp
        } else if (!isNatural && !nextNoteFlattedInKey && !config.sharps?.length) {
            accidental = Accidental.Flat
        }

        return accidental
    }

    /**
     * Decomposes a duration into the fewest rests, allowing up to one dot per rest.
     * For example, a gap of 3/8 starting at beat 0 becomes [dotted-quarter Rest at beat 0].
     *
     * @param notationDuration The total duration to fill.
     * @param startBeat The beat position of the first rest.
     **/
    public static decomposeIntoRests (notationDuration: number, startBeat: number = 0): Rest[] {
        if (notationDuration < 0) {
            throw Error(`Notation duration must be non-negative: ${notationDuration}`)
        }

        if (MusicLogic.areDurationsEqual(notationDuration, 0)) {
            return []
        }

        const candidates = MusicLogic.BaseNotationTypes
            .flatMap((notationType) => [
            { type: notationType, dotCount: 1, beatValue: notationType.beatValue * 1.5 },
            { type: notationType, dotCount: 0, beatValue: notationType.beatValue }
        ]).sort((a, b) => b.beatValue - a.beatValue)

        const result: Rest[] = []
        let remainingDuration = notationDuration
        let currentBeat = startBeat

        while (!MusicLogic.areDurationsEqual(remainingDuration, 0) && remainingDuration > 0) {
            const next = candidates.find((c) => c.beatValue <= remainingDuration + 1e-9)

            if (!next) {
                throw Error(`Cannot decompose notation duration: ${notationDuration}`)
            }

            const rest = new Rest(next.type, currentBeat, next.dotCount)
            result.push(rest)
            currentBeat += rest.totalBeatValue
            remainingDuration -= next.beatValue
        }

        return result
    }

    private static areDurationsEqual (left: number, right: number) {
        return Math.abs(left - right) < 1e-9
    }

    public static addNotations (items: Notation[], itemstoAdd: Notation[]): Notation[] {
        let nextTime = 0
        if (items.length > 0) {
            const lastNote = items[items.length - 1]
            nextTime = lastNote.startBeat + lastNote.totalBeatValue
        }

        const normalizedItemsToAdd: Notation[] = []

        itemstoAdd.forEach((itemToAdd, itemToAddIndex) => {
            // Rests are calculated/added automatically when gaps between notes are encountered.
            // Tthey do not need to be processed when causally iterated upon.
            if (itemToAdd instanceof Rest) {
                return
            }

            if (itemToAddIndex > 0) {
                // Check for gap between the last added note and this one
                // to see if a rest needs to be added between them.

                const timediff = itemToAdd.startBeat - nextTime

                if (timediff > 0) {
                    const rests = MusicLogic.decomposeIntoRests(timediff, nextTime)
                    normalizedItemsToAdd.push(...rests)
                    nextTime = rests[rests.length - 1].startBeat + rests[rests.length - 1].totalBeatValue
                }
            }

            itemToAdd.startBeat = nextTime
            itemToAdd.active = false
            normalizedItemsToAdd.push(itemToAdd)
            nextTime = itemToAdd.startBeat + itemToAdd.totalBeatValue
        })

        // if (nextTime % totalMeasureBeatValue > 0 && nextTime % totalMeasureBeatValue < totalMeasureBeatValue) {
        //     const lastNote = itemstoAdd[itemstoAdd.length - 1]
        //     const remainingBeatValue = totalMeasureBeatValue - (nextTime % totalMeasureBeatValue) - lastNote.type.getBeatValue()
        //     const remainingDurationValue = NotationType.getNotationTypeFromDuration(remainingBeatValue)
        //     itemstoAdd.push(new Rest(remainingDurationValue, nextTime + lastNote.type.getBeatValue()))
        // }

        items = items.concat(normalizedItemsToAdd)

        return items
    }

    /**
     * Divides list of notes into separate measures according to measure properties.
     *
     * @param notations All of the notes/rests in a given sequence.
     * @param beatsPerMeasure Determines how notes/rests will be divided into measures according to their beat values.
     * @param beatDuration The type of note that counts as a single beat.
     * @returns {Notation[][]} Converts an array of notes/rests into a two-dimensional array, each element an array of notes corresponding to a measure.
     **/
    public static splitIntoMeasures (notations: Notation[], config: MusicLogicConfig): Notation[][] {
        if (notations.length === 0) {
            return [[]]
        }

        const minStep = 1 / 32
        const noteCollectionArray = Array<Notation[]>()
        const lastNote = notations[notations.length - 1]
        const measureBeatValue = config.beatsPerMeasure * (config.beatDuration.beatValue / 0.25)

        let stepCounter = 1
        let currentStep = 0
        let currentNote = null

        while (currentStep < lastNote.startBeat + lastNote.totalBeatValue) {
            const steppedNote = notations.find(n => currentStep >= n.startBeat && currentStep < n.startBeat + n.totalBeatValue)

            if (steppedNote && steppedNote !== currentNote) {
                currentNote = steppedNote

                if (stepCounter >= measureBeatValue / 4) {
                    stepCounter = 0
                    noteCollectionArray.push(new Array<Notation>())
                }

                noteCollectionArray[noteCollectionArray.length - 1].push(currentNote)
            }

            stepCounter += minStep
            currentStep += minStep
        }

        return noteCollectionArray
    }

    /**
     * Converts the starting time of a note within a song into the starting time of the note's measure.
     *
     * For traditional 4/4 time, for example, 1.25 would be converted to 0.25,
     * as the 6th beat of the entire song is the 2nd beat of its measure.
     *
     * @param globalBeat The beat position within the context of the entire song.
     * @returns {number} The beat position relative to the measure.
     **/
    public static normalizeBeat (globalBeat: number, config: MusicLogicConfig): number {
        return globalBeat % ((config.beatsPerMeasure / 4) * (config.beatDuration.beatValue / 0.25))
    }

    /**
     * Returns the base natural pitch of a sharped/flatted notes.
     *
     * If D is flatted in the key signature, for example, and the pitch is 37 (Cs2), the natural pitch resolves to D,
     * because the pitch will render as D-flat (D with an accidental) on the staff.
     *
     * On the other hand, if C is sharped in the key signature, that same pitch of 37 (Cs2) will resolve to a natural pitch of C,
     * because the pitch will render as C-sharp (C with an accidental) on the staff.
     *
     * @param pitch
     * @param sharps
     * @param flats
     * @returns {Pitch} A, B, C, D, E, F, or G (no sharps or flats)
     **/
    public static determineNaturalPitch (pitch: Pitch, config: MusicLogicConfig): Pitch {
        // @ts-expect-error
        const naturalNoteValues = Object.values(NaturalNote).filter(isNaN)

        let naturalPitch = pitch

        if (!naturalNoteValues.includes(NaturalNote[pitch % 12])) {
            if ((config.sharps?.length ?? 0) > 0 && naturalNoteValues.includes(NaturalNote[(pitch - 1) % 12])) {
                naturalPitch = pitch - 1
            } else if ((config.flats?.length ?? 0) > 0 && naturalNoteValues.includes(NaturalNote[(pitch + 1) % 12])) {
                naturalPitch = pitch + 1
            }
        }

        return naturalPitch as Pitch
    }
}
