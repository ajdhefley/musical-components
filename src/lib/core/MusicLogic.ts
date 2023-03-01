import { Accidental, NaturalNote, Notation, NotationType, Pitch, Rest } from '@lib/core/models'

export class MusicLogic {
    constructor(private readonly config: {
        sharps?: NaturalNote[],
        flats?: NaturalNote[],
        beatsPerMeasure: number,
        beatDuration: NotationType
    }) {

    }

    /**
     * Determines which accidental (sharp, flat, natural, or none) should be displayed
     * next to note, based on whether the note is sharped or flatted by key signature.
     *
     * @param pitch The pitch (numerical representation of note plus octave).
     * @param defaultSharpedPitches The natural notes sharped by key. For example, in D Major, C and F are sharped.
     * @param defaultFlattedPitches The natural notes flatted by key. For example, in F major, B is flatted.
     * @returns undefined if note is not sharped/flatted, or is not a natural of a note sharped/flatted in the key signature.
     **/
    public getAccidentalForPitch (pitch: Pitch): Accidental | undefined {
        const noteFromPitch = pitch % 12 as NaturalNote
        const sharpedInKey = this.config.sharps?.includes(noteFromPitch) ?? false
        const flattedInKey = this.config.flats?.includes(noteFromPitch) ?? false
        const prevNoteSharpedInKey = this.config.sharps?.includes(noteFromPitch - 1) ?? false
        const nextNoteFlattedInKey = this.config.flats?.includes(noteFromPitch + 1) ?? false
        const isNatural = Object.values(NaturalNote).includes(noteFromPitch)

        let accidental

        if (isNatural && (sharpedInKey || flattedInKey)) {
            // For example, key is D (sharp F by default) but note is natural F
            // means explicit natural accidental should be written next to note
            accidental = Accidental.Natural
        } else if (!isNatural && !prevNoteSharpedInKey && !this.config.flats?.length) {
            // For example: note if F# (not natural) and key is C (previous note F is not sharped)
            // means explicit sharp should be written next to note
            accidental = Accidental.Sharp
        } else if (!isNatural && !nextNoteFlattedInKey && !this.config.sharps?.length) {
            // For example: note is Bb (not natural) and key is C (next note B is not flatted)
            // means explicit flat should be written next to note
            accidental = Accidental.Flat
        }

        return accidental
    }

    /**
     * Automatically calculates and inserts rests into gaps between notes.
     *
     * @param items
     * @param itemstoAdd
     * @returns A full list of notations, including calculated rests.
     **/
    public addNotations (items: Notation[], itemstoAdd: Notation[]): Notation[] {
        let nextTime = 0
        if (items.length > 0) {
            const lastNote = items[items.length - 1]
            nextTime = lastNote.startBeat + lastNote.type.beatValue
        }

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

                // TODO: find largest possible rest in time diff, keep repeating until time filled
                // TODO: handle dotted rests

                if (timediff > 0) {
                    const rest = new Rest(NotationType.getNotationTypeFromDuration(timediff), nextTime)
                    nextTime = rest.startBeat + rest.type.beatValue
                    itemstoAdd.splice(itemToAddIndex, 0, rest)
                }
            }

            itemToAdd.startBeat = nextTime
            itemToAdd.active = false
            nextTime = itemToAdd.startBeat + itemToAdd.type.beatValue
        })

        // if (nextTime % totalMeasureBeatValue > 0 && nextTime % totalMeasureBeatValue < totalMeasureBeatValue) {
        //     const lastNote = itemstoAdd[itemstoAdd.length - 1]
        //     const remainingBeatValue = totalMeasureBeatValue - (nextTime % totalMeasureBeatValue) - lastNote.type.getBeatValue()
        //     const remainingDurationValue = NotationType.getNotationTypeFromDuration(remainingBeatValue)
        //     itemstoAdd.push(new Rest(remainingDurationValue, nextTime + lastNote.type.getBeatValue()))
        // }

        items = items.concat(itemstoAdd)

        return items
    }

    /**
     * Divides list of notes into separate measures according to measure properties.
     *
     * @param notations All of the notes/rests in a given sequence.
     * @param beatsPerMeasure Determines how notes/rests will be divided into measures according to their beat values.
     * @param beatDuration The type of note that counts as a single beat.
     * @returns Converts an array of notes/rests into a two-dimensional array, each element an array of notes corresponding to a measure.
     **/
    public splitIntoMeasures (notations: Notation[]): Notation[][] {
        if (notations.length === 0) {
            return [[]]
        }

        const minStep = 1 / 32
        const noteCollectionArray = Array<Notation[]>()
        const lastNote = notations[notations.length - 1]
        const measureBeatValue = this.config.beatsPerMeasure * (this.config.beatDuration.beatValue / 0.25)

        let stepCounter = 1
        let currentStep = 0
        let currentNote = null

        while (currentStep < lastNote.startBeat + lastNote.type.beatValue) {
            const steppedNote = notations.find(n => currentStep >= n.startBeat && currentStep < n.startBeat + n.type.beatValue)

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
     * @returns The beat position relative to the measure.
     **/
    public normalizeBeat (globalBeat: number) {
        return globalBeat % ((this.config.beatsPerMeasure / 4) * (this.config.beatDuration.beatValue / 0.25))
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
     * @returns
     **/
    public determineNaturalPitch (pitch: Pitch) {
        // @ts-expect-error
        const naturalNoteValues = Object.values(NaturalNote).filter(isNaN)

        // Determine base natural, to calculate correct position on staff
        let naturalPitch = pitch

        if (!naturalNoteValues.includes(NaturalNote[pitch % 12])) {
            if ((this.config.sharps?.length ?? 0) > 0 && naturalNoteValues.includes(NaturalNote[(pitch - 1) % 12])) {
                naturalPitch = pitch - 1
            } else if ((this.config.flats?.length ?? 0) > 0 && naturalNoteValues.includes(NaturalNote[(pitch + 1) % 12])) {
                naturalPitch = pitch + 1
            }
        }

        return naturalPitch
    }
}
