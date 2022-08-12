import { useEffect, useState } from 'react';

import './StaffMeasure.scss';
import { NoteModel, RestModel } from '../models';
import Rest from './StaffRest';
import StaffNote from './StaffNote';
import { Pitch, ClefType } from '../types';

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
    sharps?: Pitch[];

    /**
     * Notes that should be implicitly flatted (by key) without being denoted by an explicit accidental.
     **/
    flats?: Pitch[];
}

/**
 * 
 **/
function StaffMeasure({ notes, clef, sharps, flats }: StaffMeasureProps) {
    const MinMeasureWidth: number = 400;
    const SpaceHeight: number = 20;
    const NoteLeftOffset: number = 40;
    const MiddleOctave: number = 4;
    const NoteSize: number = 30;
    const NoteSpacing: number = 40;

    const getItemLeftPosition = (time: number, index: number) => {
        return /*(MinMeasureWidth * time) +*/ (NoteSize + NoteSpacing) * index;
    }

    const getItemBottomPosition = (pitch: number, octave: number) => {
        const noteHeight = SpaceHeight / 2;
        const numPitches = 7;

        let bottomMiddleC = 0;

        switch (clef) {
            case ClefType.Treble:
                bottomMiddleC = SpaceHeight * 2 + noteHeight;
                break;
            case ClefType.Bass:
                bottomMiddleC = SpaceHeight * 5;
                break;
        }

        let pitchPosition = (pitch % numPitches) * noteHeight;
        let octavePosition = (octave - MiddleOctave) * numPitches * noteHeight;

        if (clef == ClefType.Bass) {
            octavePosition -= numPitches * noteHeight;
        }
        
        return bottomMiddleC + pitchPosition + octavePosition;
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
        const renderedNotes = notes?.map((note: NoteModel, index) => {
            const leftPosition = getItemLeftPosition(note.startBeat, index) + NoteLeftOffset;
            const bottomPosition = getItemBottomPosition(note.pitch, note.octave);
            const hideAccidental = (note.accidental == 'sharp' && sharps?.includes(note.pitch)) || (note.accidental == 'flat' && flats?.includes(note.pitch));
            const isNatural = typeof(note.accidental) == 'undefined' && (sharps?.includes(note.pitch) || flats?.includes(note.pitch));
            return (<StaffNote model={note} left={leftPosition} bottom={bottomPosition} showAccidental={!hideAccidental} natural={isNatural} />);
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
