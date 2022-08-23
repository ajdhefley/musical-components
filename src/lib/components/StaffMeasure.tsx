import { useEffect, useState } from 'react';

import './StaffMeasure.scss';
import { NotationModel, NoteModel, RestModel } from '../models';
import Rest from './StaffRest';
import StaffNote from './StaffNote';
import { NaturalNote, ClefType, Pitch, Duration } from '../types';
import StaffRest from './StaffRest';

/**
 * 
 **/
interface StaffMeasureProps {
    /**
     * 
     **/
    notes: NotationModel[];

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
    console.log(notes);
    const MinMeasureWidth: number = 400;
    const SpaceHeight: number = 20;
    const NoteSize: number = 30;
    const NoteSpacing: number = 40;
    const BaseStemHeight: number = 75;
    
    const id = 'measure' + notes[0].startBeat;

    const getNoteAt = (beat: number) => {
        for (let note of notes) {
            if (note instanceof NoteModel && note.startBeat <= beat && beat < note.startBeat + (1/note.durationType)) {
                return note;
            }
        }
    }

    const getNotationLeftPosition = (notation: NotationModel) => {
        const leftOffset = 25;
        const accidentalWidth = 15;
        
        let total = 0;
        let lastNote = null;

        for (let i = 0; i < notation.startBeat; i += 1/32) {
            const note = getNoteAt(i);

            if (note?.startBeat !== lastNote?.startBeat) {
                lastNote = note;
                total += (NoteSize + NoteSpacing);
            }

            if (getNoteAccidental(note)) {
                total += accidentalWidth;
            }
        }

        if (notation instanceof NoteModel && getNoteAccidental(notation)) {
            total += accidentalWidth;
        }

        return total + leftOffset;
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

    const getMeasureWidth = () => {
        const lastNote = notes[notes.length - 1];
        const rightOffset = 30;
        return Math.max(MinMeasureWidth, getNotationLeftPosition(lastNote) + rightOffset);
    };

    const getStaffStyle = () => {
        return {
            width: `${getMeasureWidth()}px`
        };
    }

    const getNoteAccidental = (note: NoteModel) => {
        const noteFromPitch = note.pitch % 12;
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
        // In either case, an accidental is not written next to the note.

        return accidental;
    }

    const getConnectingStem = (startIndex: number, endIndex: number) => {
        const startNote = notes[startIndex] as NoteModel;
        const endNote = notes[startIndex] as NoteModel;
        const durationType = notes[startIndex].durationType;
        const stemStartXPos = getNotationLeftPosition(notes[startIndex]) - (NoteSize / 2) + 2;
        const stemStartYPos = getNotationBottomPosition(startNote.pitch) - BaseStemHeight;
        const stemEndXPos = getNotationLeftPosition(notes[endIndex]) - (NoteSize / 2);
        const stemEndYPos = getNotationBottomPosition(endNote.pitch) - BaseStemHeight;
        const stemWidth = stemEndXPos - stemStartXPos - 1;
        //const degrees = Math.atan2(stemEndYPos - stemStartYPos, stemEndXPos - stemStartXPos) * 180 / Math.PI;

        let b = document.createElement('div');
        b.id = notes[endIndex].startBeat.toString();
        b.style.position = 'absolute';
        b.style.left = `${stemStartXPos}px`;
        b.style.bottom = `${stemStartYPos}px`;
        b.style.width = `${stemWidth}px`;
        b.style.border = '3px solid #000';
        //b.style.transform = `rotate(${-degrees}deg)`;
        //b.style.transformOrigin = 'top-left';
        //b.innerHTML = 'This demo DIV block was inserted into the page using JavaScript.';
        window.setTimeout(() => document.getElementById(id).appendChild(b));

        if (durationType == Duration.Sixteenth) {
            let b2 = document.createElement('div');
            b2.id = notes[endIndex].startBeat.toString();
            b2.style.position = 'absolute';
            b2.style.left = `${stemStartXPos}px`;
            b2.style.bottom = `${stemStartYPos + 10}px`;
            b2.style.width = `${stemWidth}px`;
            b2.style.border = '3px solid #000';
            //b2.style.transform = `rotate(${-degrees}deg)`;
            //b2.style.transformOrigin = 'top-left';
            //b2.innerHTML = 'This demo DIV block was inserted into the page using JavaScript.';
            window.setTimeout(() => document.getElementById(id).appendChild(b2));
        }

        if (durationType == Duration.ThirtySecond) {
            let b3 = document.createElement('div');
            b3.id = notes[endIndex].startBeat.toString();
            b3.style.position = 'absolute';
            b3.style.left = `${stemStartXPos}px`;
            b3.style.bottom = `${stemStartYPos + 20}px`;
            b3.style.width = `${stemWidth}px`;
            b3.style.border = '3px solid #000';
            //b3.style.transform = `rotate(${-degrees}deg)`;
            //b3.style.transformOrigin = 'top-left';
            //b3.innerHTML = 'This demo DIV block was inserted into the page using JavaScript.';
            window.setTimeout(() => document.getElementById(id).appendChild(b3));
        }
    }

    const getNotations = () => {
        let lastHorizontalStemIndex = -1;
        
        return notes?.map((notationModel: NotationModel, index) => {
            if (notationModel instanceof NoteModel) {
                
                if (index > lastHorizontalStemIndex &&
                    (notationModel.durationType == Duration.ThirtySecond ||
                    notationModel.durationType == Duration.Sixteenth ||
                    notationModel.durationType == Duration.Eighth)) {
                    
                    let stem = undefined;

                    if (index < notes.length - 1 && notes[index+1].durationType == notationModel.durationType) {
                        const note = notes[index] as NoteModel;
                        const note3 = notes[index+3] as NoteModel;
                        const note2 = notes[index+2] as NoteModel;
                        const note1 = notes[index+1] as NoteModel;

                        if (index < notes.length - 2 && notes[index+2].durationType == notationModel.durationType) {
                            if (index < notes.length - 3 && notes[index+3].durationType == notationModel.durationType) {
                                // Four notes
                                stem = getConnectingStem(index, index+3);
                                const stemProportion3 = (getNotationBottomPosition(note3.pitch) - getNotationBottomPosition(note.pitch)) / BaseStemHeight;
                                note3.stemStretchFactor = 1 + stemProportion3;
                                const stemProportion2 = (getNotationBottomPosition(note2.pitch) - getNotationBottomPosition(note.pitch)) / BaseStemHeight;
                                note2.stemStretchFactor = 1 + stemProportion2;
                                const stemProportion1 = (getNotationBottomPosition(note1.pitch) - getNotationBottomPosition(note.pitch)) / BaseStemHeight;
                                note1.stemStretchFactor = 1 + stemProportion1;
                                lastHorizontalStemIndex = index+3;
                            }
                            else {
                                // Three notes
                                stem = getConnectingStem(index, index+2);
                                const stemProportion2 = (getNotationBottomPosition(note2.pitch) - getNotationBottomPosition(note.pitch)) / BaseStemHeight;
                                note2.stemStretchFactor = 1 + stemProportion2;
                                const stemProportion1 = (getNotationBottomPosition(note1.pitch) - getNotationBottomPosition(note.pitch)) / BaseStemHeight;
                                note1.stemStretchFactor = 1 + stemProportion1;
                                lastHorizontalStemIndex = index+2;
                            }
                        }
                        else {
                            // Two notes
                            stem = getConnectingStem(index, index+1);
                            const stemProportion1 = (getNotationBottomPosition(note1.pitch) - getNotationBottomPosition(note.pitch)) / BaseStemHeight;
                            note1.stemStretchFactor = 1 + stemProportion1;
                            lastHorizontalStemIndex = index+1;
                        }
                    }
                }

                const accidental = getNoteAccidental(notationModel);
                const leftPosition = getNotationLeftPosition(notationModel);
                const bottomPosition = getNotationBottomPosition(notationModel.pitch);
                return <StaffNote model={notationModel} left={leftPosition} bottom={bottomPosition} accidental={accidental} />;
            }
            else if (notationModel instanceof RestModel) {
                const leftPosition = getNotationLeftPosition(notationModel);
                return <StaffRest model={notationModel} left={leftPosition} />;
            }
        });
    }

    return (
        <div id={id} className="staff-measure" style={getStaffStyle()}>
            <div className="notation-container">{getNotations()}</div>
            <div className="staff-space"></div>
            <div className="staff-space"></div>
            <div className="staff-space"></div>
            <div className="staff-space"></div>
        </div>
    );
}

export default StaffMeasure;
