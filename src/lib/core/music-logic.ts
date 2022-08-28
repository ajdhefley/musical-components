import { Accidental, NaturalNote, Notation, NotationType, Pitch, Rest } from './models'

export abstract class MusicLogic {
    /**
     * Determines which accidental (sharp, flat, natural, or none) should be displayed
     * next to note, based on whether the note is sharped or flatted by key signature.
     *
     * @param pitch The pitch (numerical representation of note plus octave).
     * @param defaultSharpedPitches The natural notes sharped by key. For example, in D Major, C and F are sharped.
     * @param defaultFlattedPitches The natural notes flatted by key. For example, in F major, B is flatted.
     * @returns undefined if note is not sharped/flatted, or is not a natural of a note sharped/flatted in the key signature.
     **/
    static getAccidentalForPitch (pitch: Pitch, defaultSharpedPitches?: NaturalNote[], defaultFlattedPitches?: NaturalNote[]): Accidental | undefined {
        const noteFromPitch = pitch % 12 as NaturalNote
        const sharpedInKey = defaultSharpedPitches?.includes(noteFromPitch) ?? false
        const flattedInKey = defaultFlattedPitches?.includes(noteFromPitch) ?? false
        const prevNoteSharpedInKey = defaultSharpedPitches?.includes(noteFromPitch - 1) ?? false
        const nextNoteFlattedInKey = defaultFlattedPitches?.includes(noteFromPitch + 1) ?? false
        const isNatural = Object.values(NaturalNote).includes(noteFromPitch)

        let accidental

        if (isNatural && (sharpedInKey || flattedInKey)) {
            // For example, key is D (sharp F by default) but note is natural F
            // means explicit natural accidental should be written next to note
            accidental = Accidental.Natural
        } else if (!isNatural && !prevNoteSharpedInKey && !defaultFlattedPitches?.length) {
            // For example: note if F# (not natural) and key is C (previous note F is not sharped)
            // means explicit sharp should be written next to note
            accidental = Accidental.Sharp
        } else if (!isNatural && !nextNoteFlattedInKey && !defaultSharpedPitches?.length) {
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
     * @param addedItems
     * @returns A full list of notations, including calculated rests.
     **/
    static addNotations (items: Notation[], addedItems: Notation[], beatsPerMeasure: number): Notation[] {
        const totalMeasureBeatValue = beatsPerMeasure / 4

        let nextTime = 0

        if (items.length > 0) {
            const lastNote = items[items.length - 1]
            nextTime = lastNote.startBeat + lastNote.type.getBeatValue()
        }

        addedItems.forEach((addedItem, addedNoteIndex) => {
            // Rests are calculated/added automatically when gaps between notes are encountered.
            // Tthey do not need to be processed when causally iterated upon.
            if (addedItem instanceof Rest) {
                return
            }

            if (addedNoteIndex > 0) {
                // Check for gap between the last added note and this one
                // to see if a rest needs to be added between them.

                const lastNote = addedItems[addedNoteIndex - 1]
                nextTime = lastNote.startBeat + lastNote.type.getBeatValue()
                const timediff = addedItem.startBeat - nextTime

                // TODO: find largest possible rest in time diff, keep repeating until time filled
                // TODO: handle dotted rests

                if (timediff > 0) {
                    addedItems.splice(addedNoteIndex, 0, new Rest(NotationType.getNotationTypeFromDuration(timediff), nextTime))
                }
            }

            addedItem.startBeat = nextTime
            addedItem.active = false
        })

        if (nextTime % totalMeasureBeatValue < totalMeasureBeatValue) {
            const lastNote = addedItems[addedItems.length - 1]
            const remainingBeatValue = totalMeasureBeatValue - (nextTime % totalMeasureBeatValue) - lastNote.type.getBeatValue()
            const remainingDurationValue = NotationType.getNotationTypeFromDuration(remainingBeatValue)
            addedItems.push(new Rest(remainingDurationValue, nextTime + lastNote.type.getBeatValue()))
        }

        items = items.concat(addedItems)

        return items
    }

    /**
     * Divides list of notes into separate measures according to measure properties.
     *
     * @param notations All of the notes/rests in a given sequence.
     * @param beatsPerMeasure Determines how notes/rests will be divided into measures according to their beat values.
     * @returns Converts an array of notes/rests into a two-dimensional array, each element an array of notes corresponding to a measure.
     **/
    static getMeasures (notations: Notation[], beatsPerMeasure: number): Notation[][] {
        if (notations.length === 0) {
            return [[]]
        }

        const minStep = 1 / 32
        const noteCollectionArray = Array<Notation[]>()
        const lastNote = notations[notations.length - 1]

        let stepCounter = 1
        let currentStep = 0
        let currentNote = null

        while (currentStep < lastNote.startBeat + lastNote.type.getBeatValue()) {
            const steppedNote = notations.find(n => currentStep >= n.startBeat && currentStep < n.startBeat + n.type.getBeatValue())

            if (steppedNote && steppedNote !== currentNote) {
                currentNote = steppedNote

                if (stepCounter >= beatsPerMeasure / 4) {
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
}
