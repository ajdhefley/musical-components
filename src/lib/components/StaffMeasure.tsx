import { useEffect, useState } from 'react';

import './StaffMeasure.scss';
import { NoteModel, RestModel } from '../models';
import Rest from './StaffRest';
import StaffNote from './StaffNote';
import { NaturalNote, ClefType, Pitch } from '../types';

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

    const getItemLeftPosition = (time: number, index: number) => {
        return (NoteSize + NoteSpacing) * index;
    }

    const getNotationBottomPosition = (pitch: Pitch) => {
        // Filtered by isNaN because TS includes both keys and values in array of heterogeneous enum values
        // Explanation here: https://stackoverflow.com/a/51536142/3068267
        // We only want numeric values
        const naturalNoteValues = Object.values(NaturalNote).filter(isNaN);

        // Determine base natural, to calculate correct position on staff
        let naturalPitch = pitch;
        if (sharps?.includes(naturalNoteValues.indexOf(NaturalNote[(pitch - 1) % 12]))) {
            naturalPitch = pitch - 1;
        }
        else if (flats?.includes(naturalNoteValues.indexOf(NaturalNote[(pitch + 1) % 12]))) {
            naturalPitch = pitch + 1;
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
        return Math.max(MinMeasureWidth, getItemLeftPosition(lastNote.startBeat, notes.length - 1) + NoteLeftOffset);
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
        const renderedNotes = notes?.map((noteModel: NoteModel, index) => {
            // If is not semitone
                // if note is sharped or flatted (key), show natural
                // if note is not sharped or flatted (key), show nothing
            // If is semitone
                // if next note is flatted (key), show nothing
                // if next note is not flatted (key), show flat
                // If previous note is sharped (key), show nothing
                // If previous note is not sharped (key), show sharp

            const noteFromPitch = noteModel.pitch % 12;
            const isNatural = Object.values(NaturalNote).includes(noteFromPitch);
            const currNoteSharped = sharps?.includes(noteFromPitch);
            const currNoteFlatted = flats?.includes(noteFromPitch);
            const prevNoteSharped = sharps?.includes(noteFromPitch-1);
            const nextNoteFlatted = flats?.includes(noteFromPitch+1);

            let accidental = undefined;

            if (isNatural) {
                if (currNoteSharped || currNoteFlatted) {
                    accidental = 'natural';
                }
            }
            else {
                if (sharps?.length > 0 && !prevNoteSharped) {
                    accidental = 'sharp';
                }
                else if (flats?.length > 0 && !nextNoteFlatted) {
                    accidental = 'flat';
                }
            }

            const leftPosition = getItemLeftPosition(noteModel.startBeat, index) + NoteLeftOffset;
            const bottomPosition = getNotationBottomPosition(noteModel.pitch);
            return (<StaffNote model={noteModel} left={leftPosition} bottom={bottomPosition} accidental={accidental} />);
        });

        return Array().concat(renderedNotes);
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
