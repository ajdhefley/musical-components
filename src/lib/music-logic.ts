import { NotationModel, RestModel } from './models';
import { NaturalNote, Pitch } from './types';
import { Accidental, Duration } from './types';

export class MusicLogic {
    /**
     * Determines duration type from the beat value, a finite set of numbers.
     * Returns n from the following where d is the input: d = 1/n
     * 
     * - 1/1  | 1       = Whole
     * - 1/2  | 0.5     = Half
     * - 1/4  | 0.25    = Quarter
     * - 1/8  | 0.125   = Eighth
     * - 1/16 | 0.0625  = Sixteenth
     * - 1/32 | 0.03125 = ThirtySecond
     * 
     * Any other input will return undefined.
     * 
     * @param beatValue Numerical representation of note's duration (a Quarter Note, for example, being 0.25)
     * @returns Duration enum value, or undefined if not a valid beat value.
     **/
    static getDurationTypeFromBeatValue(beatValue: number): Duration {
        switch (beatValue) {
            case 1/Duration.Whole: return Duration.Whole;
            case 1/Duration.Half: return Duration.Half;
            case 1/Duration.Quarter: return Duration.Quarter;
            case 1/Duration.Eighth: return Duration.Eighth;
            case 1/Duration.Sixteenth: return Duration.Sixteenth;
            case 1/Duration.ThirtySecond: return Duration.ThirtySecond;
        }
    }

    /**
     * Returns beat value for a given duration type.
     * 
     * - Whole        = 1/1
     * - Half         = 1/2
     * - Quarter      = 1/4
     * - Eighth       = 1/8
     * - Sixteenth    = 1/16
     * - ThirtySecond = 1/32
     * 
     * @param durationType The enum value representing the duration type.
     * @returns Numerical beat value for a given duration type, a Whole Note being 1.0.
     **/
    static getBeatValueFromDurationType(durationType: Duration) {
        switch (durationType) {
            case Duration.ThirtySecond: return 1/8;
            case Duration.Sixteenth: return 1/4;
            case Duration.Eighth: return 1/2;
            case Duration.Quarter: return 1;
            case Duration.Half: return 2;
            case Duration.Whole: return 4;
        }
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
    static getAccidentalForPitch(pitch: Pitch, defaultSharpedPitches?: NaturalNote[], defaultFlattedPitches?: NaturalNote[]): Accidental | undefined {
        const noteFromPitch = pitch % 12 as NaturalNote;
        const sharpedInKey = defaultSharpedPitches?.includes(noteFromPitch) ?? false;
        const flattedInKey = defaultFlattedPitches?.includes(noteFromPitch) ?? false;
        const prevNoteSharpedInKey = defaultSharpedPitches?.includes(noteFromPitch-1) ?? false;
        const nextNoteFlattedInKey = defaultFlattedPitches?.includes(noteFromPitch+1) ?? false;
        const isNatural = Object.values(NaturalNote).includes(noteFromPitch);

        let accidental = undefined;

        if (isNatural && (sharpedInKey || flattedInKey)) {
            // For example, key is D (sharp F by default) but note is natural F
            // means explicit natural accidental should be written next to note
            accidental = Accidental.Natural;
        }
        else if (!isNatural && !prevNoteSharpedInKey && !defaultFlattedPitches?.length) {
            // For example: note if F# (not natural) and key is C (previous note F is not sharped)
            // means explicit sharp should be written next to note
            accidental = Accidental.Sharp;
        }
        else if (!isNatural && !nextNoteFlattedInKey && !defaultSharpedPitches?.length) {
            // For example: note is Bb (not natural) and key is C (next note B is not flatted)
            // means explicit flat should be written next to note
            accidental = Accidental.Flat;
        }

        return accidental;
    }

    /**
     * Automatically calculates and inserts rests into gaps between notes.
     * 
     * @param items 
     * @param addedItems 
     * @returns A full list of notations, including calculated rests.
     **/
    static addNotations(items: NotationModel[], addedItems: NotationModel[]): NotationModel[] {
        let nextTime = 0;

        if (items.length > 0) {
            let lastNote = items[items.length - 1];
            nextTime = lastNote.startBeat + 1 / lastNote.durationType;
        }
        
        addedItems.forEach((addedItem, addedNoteIndex) => {
            // Rests are calculated/added automatically when gaps between notes are encountered.
            // Tthey do not need to be processed when causally iterated upon.
            if (addedItem instanceof RestModel) {
                return;
            }

            if (addedNoteIndex > 0) {
                // Check for gap between the last added note and this one
                // to see if a rest needs to be added between them.

                let lastNote = addedItems[addedNoteIndex - 1];
                nextTime = lastNote.startBeat + 1 / lastNote.durationType;
                let timediff = addedItem.startBeat - nextTime;

                // TODO: find largest possible rest in time diff, keep repeating until time filled
                // TODO: handle dotted rests

                if (timediff > 0) {
                    addedItems.splice(addedNoteIndex, 0, new RestModel(MusicLogic.getDurationTypeFromBeatValue(timediff), nextTime));
                }
            }

            addedItem.startBeat = nextTime;
            addedItem.active = false;
        });

        items = items.concat(addedItems);

        return items;
    }

    /**
     * 
     * @param notations All of the notes/rests in a given sequence.
     * @param beatsPerMeasure Determines how notes/rests will be divided into measures according to their beat values.
     * @returns Converts an array of notes/rests into a two-dimensional array, each element an array of notes corresponding to a measure.
     **/
    static getMeasures(notations: NotationModel[], beatsPerMeasure: number) {
        if (notations.length == 0) {
            return [[]];
        }

        const minStep = 1/32;
        const noteCollectionArray = Array<Array<NotationModel>>();
        const lastNote = notations[notations.length - 1];

        let stepCounter = 1;
        let currentStep = 0;
        let currentNote = null;
        
        while (currentStep < lastNote.startBeat + 1/lastNote.durationType) {
            const steppedNote = notations.find(n => currentStep >= n.startBeat && currentStep < n.startBeat + 1/n.durationType);

            if (steppedNote != currentNote) {
                currentNote = steppedNote;

                if (stepCounter >= beatsPerMeasure / 4) {
                    stepCounter = 0;
                    noteCollectionArray.push(new Array<NotationModel>());
                }

                if (currentNote) {
                    noteCollectionArray[noteCollectionArray.length - 1].push(currentNote);
                }
            }

            stepCounter += minStep;
            currentStep += minStep;
        }

        return noteCollectionArray;
    }
}