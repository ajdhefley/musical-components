import { useEffect, useState } from 'react';

import './StaffMeasure.scss';
import { NotationModel, NoteModel, RestModel } from '../models';
import Rest from './StaffRest';
import StaffNote from './StaffNote';
import { NaturalNote, ClefType, Pitch } from '../types';
import StaffRest from './StaffRest';

/**
 * 
 **/
interface StaffMeasureProps {
    /**
     * 
     **/
    notes: NoteModel[];

    /**
     * The treble or bass clef, which affects note position.
     **/
    clef: ClefType;

    /**
     * Notes that should be implicitly sharped (by key) without being denoted by an explicit accidental.
     **/
    sharps?: NaturalNote[];

    /**
     * Notes that should be implicitly flatted (by key) without being denoted by an explicit accidental.
     **/
    flats?: NaturalNote[];
}

/**
 * 
 **/
function StaffMeasure({ notes, clef, sharps, flats }: StaffMeasureProps) {
    const MinMeasureWidth: number = 400;
    const SpaceHeight: number = 20;
    const NoteLeftOffset: number = 40;
    const NoteSize: number = 30;
    const NoteSpacing: number = 40;

    const getNotationLeftPosition = (time: number, index: number) => {
        return (NoteSize + NoteSpacing) * index;
    }

    const getNotationBottomPosition = (pitch: Pitch) => {
        // Filtered by isNaN because TS includes both keys and values in array of heterogeneous enum values
        // Explanation here: https://stackoverflow.com/a/51536142/3068267
        // We only want numeric values
        const naturalNoteValues = Object.values(NaturalNote).filter(isNaN);

        // Determine base natural, to calculate correct position on staff
        let naturalPitch = pitch;
        if (naturalNoteValues.includes(NaturalNote[pitch % 12]) == false) {
            if (naturalNoteValues.includes(NaturalNote[(pitch - 1) % 12])) {
                naturalPitch = pitch - 1;
            }
            else if (naturalNoteValues.includes(NaturalNote[(pitch + 1) % 12])) {
                naturalPitch = pitch + 1;
            }
        }

        // String value ("A", "B", "C", etc) of the note
        const noteValue = NaturalNote[naturalPitch % 12];

        // Number of naturals: A, B, C, D, E, F, G
        const totalNotes = naturalNoteValues.length;

        // The position of Middle C on the staff is different depending on the clef.
        // We calculate the position of each note relative to Middle C, so this needs
        // to be known ahead of time.
        let middleCPosition = 0;
        switch (clef) {
            case ClefType.Treble:
                // Occupies the 3rd space from the bottom, which is the 5th index where the bottom line is 0
                middleCPosition = 5;
                break;
            case ClefType.Bass:
                // Occupies a whole step above the 4th line from the bottom, which is the 10th index where the bottom line is 0 
                middleCPosition = 10;
                break;
        }

        const noteDiff = Object.values(NaturalNote).filter(isNaN).indexOf(noteValue);
        const basePitchPosition = noteDiff;
        const pitchOctave = Math.floor(pitch / 12) - 1;
        const octaveDiff = pitchOctave - 4;
        const pitchPosition = basePitchPosition + totalNotes * octaveDiff;

        // One note per line and one per space equates to each note occupying a height of half each space
        const noteHeight = SpaceHeight / 2;
        
        return (middleCPosition + pitchPosition) * noteHeight;
    }

    const getStaffWidth = () => {
        const lastNote = notes[notes.length - 1];
        return Math.max(MinMeasureWidth, getNotationLeftPosition(lastNote.startBeat, notes.length - 1) + NoteLeftOffset);
    };

    const getStaffStyle = () => {
        return {
            width: `${getStaffWidth()}px`
        };
    }

    const getStaffSpaceStyle = () => {
        return {

        };
    }

    const getNotations = () => {
        return notes?.map((notationModel: NotationModel, index) => {
            if (notationModel instanceof NoteModel) {
                const noteFromPitch = notationModel.pitch % 12;
                const sharpedInKey = sharps?.includes(noteFromPitch) ?? false;
                const flattedInKey = flats?.includes(noteFromPitch) ?? false;
                const prevNoteSharpedInKey = sharps?.includes(noteFromPitch-1) ?? false;
                const nextNoteFlattedInKey = flats?.includes(noteFromPitch+1) ?? false;
                const isNatural = Object.values(NaturalNote).includes(noteFromPitch);

                let accidental = undefined;
                if (isNatural && (sharpedInKey || flattedInKey)) {
                    // For example, key is D (sharp F by default) but note is natural F
                    // means explicit natural accidental should be written next to note
                    accidental = 'natural';
                }
                else if (!isNatural && !prevNoteSharpedInKey) {
                    // For example: note if F# (not natural) and key is C (previous note F is not sharped)
                    // means explicit sharp should be written next to note
                    accidental = 'sharp';
                }
                else if (!isNatural && !nextNoteFlattedInKey) {
                    // For example: note is Bb (not natural) and key is C (next note B is not flatted)
                    // means explicit flat should be written next to note
                    accidental = 'flat';
                }

                // Otherwise, note is either sharped/flatted in correspondence with key,
                // or note is natural and not sharped/flatted by key.
                // In either case, do not write an accidental next to the note.

                const leftPosition = getNotationLeftPosition(notationModel.startBeat, index) + NoteLeftOffset;
                const bottomPosition = getNotationBottomPosition(notationModel.pitch);
                return (<StaffNote model={notationModel} left={leftPosition} bottom={bottomPosition} accidental={accidental} />);
            }
            else if (notationModel instanceof RestModel) {
                const leftPosition = getNotationLeftPosition(notationModel.startBeat, index) + NoteLeftOffset;
                return (<StaffRest model={notationModel} left={leftPosition} />);
            }
        });
    }

    return (
        <div className="staff-measure" style={getStaffStyle()}>
            <div className="notation-container">{getNotations()}</div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
        </div>
    );
}

export default StaffMeasure;
