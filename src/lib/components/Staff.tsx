import { useEffect, useState } from 'react';

import './Staff.scss';
import { NoteModel } from '../models';
import { Pitch, ClefType, Duration, BeatsPerMeasureType } from '../types';
import StaffMeasure from './StaffMeasure';

/**
 * 
 **/
interface StaffProps {
    /**
     * The treble or bass clef.
     **/
    clef: ClefType;

    /**
     * Number of beats per measure, determining the top number of the time signature.
     **/
    beatsPerMeasure: BeatsPerMeasureType;

    /**
     * The value of a given beat, determining the bottom number of the time signature.
     **/
    beatDuration: Duration;

    /**
     * The pitches that are sharped, determining the major key.
     * If both sharps and flats have values, flats will be ignored.
     **/
    sharps?: Pitch[];

    /**
     * The pitches that are flatted, determining the major key.
     * If both sharps and flats have values, flats will be ignored.
     **/
    flats?: Pitch[];
}

/**
 * 
 **/
function Staff({ clef, beatsPerMeasure, beatDuration, sharps, flats }: StaffProps) {
    const ClefWidth: number = 50;
    const SpaceHeight: number = 20;
    const MiddleOctave: number = 4;
    const KeySize: number = 17;

    const [notes, setNotes] = useState(new Array<NoteModel>());

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

    const getClef = () => {
        return <div className={clef.toString().toLowerCase()}></div>
    }

    const getKeySignatureSharpsAndFlats = () => {
        if (sharps) {
            return sharps.map((note, index) => {
                const leftPosition = index * KeySize;
                const bottomPosition = getItemBottomPosition(note, note > 4 ? MiddleOctave - 1 : MiddleOctave) - SpaceHeight + 5;
                return (<div className="sharp" style={{ left: `${leftPosition}px`, bottom: `${bottomPosition}px` }} />);
            });
        }
        else if (flats) {
            return flats.map((note, index) => {
                const leftPosition = index * KeySize;
                const bottomPosition = getItemBottomPosition(note, note >= 3 ? MiddleOctave - 1 : MiddleOctave) - SpaceHeight/2 + 5;
                return (<div className="flat" style={{ left: `${leftPosition}px`, bottom: `${bottomPosition}px` }} />);
            });
        }
    }

    const getKeySignatureStyle = () => {
        return {
            width: `${((sharps?.length ?? 0) + (flats?.length ?? 0)) * (KeySize + 5)}px`
        }
    }

    const getTimeSignature = () => {
        return (<div>
            <div className={`ts-${beatsPerMeasure}`} style={{ top: 0 }}></div>
            <div className={`ts-${beatDuration}`} style={{ bottom: 0 }}></div>
        </div>);
    }

    const getTimeSignatureStyle = () => {
        return {
            left: `${((sharps?.length ?? 0) + (flats?.length ?? 0)) * KeySize + ClefWidth + 20}px`
        }
    }

    const getMeasures = () => {
        if (notes.length == 0) {
            return [];
        }

        const minStep = 1/32;
        const noteCollectionArray = Array<Array<NoteModel>>();
        const lastNote = notes[notes.length - 1];

        let stepCounter = 1;
        let currentStep = 0;
        let currentNote = null;
        
        while (currentStep < lastNote.startBeat + 1/lastNote.durationType) {
            let steppedNote = notes.find((note) => {
                return note.startBeat >= currentStep && note.startBeat < currentStep + 1/note.durationType;
            });

            if (steppedNote != currentNote) {
                currentNote = steppedNote;

                if (stepCounter >= 1) {
                    stepCounter = 0;
                    noteCollectionArray.push(new Array<NoteModel>());
                }

                if (currentNote) {
                    noteCollectionArray[noteCollectionArray.length - 1].push(currentNote);
                }
            }

            stepCounter += minStep;
            currentStep += minStep;
        }

        return noteCollectionArray.map((noteCollection) => <>
            <StaffMeasure clef={clef} sharps={sharps} flats={flats} notes={noteCollection} />
        </>)
    }
    
    const addNotes = async (...addedNotes: NoteModel[]) => {
        setNotes(notes.concat(addedNotes));
    }

    useEffect(() => {
        addNotes(
            { pitch: Pitch.C, octave: MiddleOctave, durationType: Duration.Quarter, startBeat: 0, accidental: 'sharp' },
            { pitch: Pitch.C, octave: MiddleOctave, durationType: Duration.Eighth, startBeat: 0.250 },
            { pitch: Pitch.A, octave: MiddleOctave-1, durationType: Duration.Eighth, startBeat: 0.375, accidental: 'sharp' },
            { pitch: Pitch.D, octave: MiddleOctave, durationType: Duration.Sixteenth, startBeat: 0.500 },
            { pitch: Pitch.E, octave: MiddleOctave, durationType: Duration.Sixteenth, startBeat: 0.5625 },
            { pitch: Pitch.B, octave: MiddleOctave-1, durationType: Duration.Eighth, startBeat: 0.625 },
            { pitch: Pitch.G, octave: MiddleOctave-1, durationType: Duration.Eighth, startBeat: 0.75 },
            { pitch: Pitch.F, octave: MiddleOctave, durationType: Duration.Eighth, startBeat: 0.875 },
            { pitch: Pitch.F, octave: MiddleOctave, durationType: Duration.Eighth, startBeat: 1.0 },
            { pitch: Pitch.F, octave: MiddleOctave, durationType: Duration.Eighth, startBeat: 1.125 },
            { pitch: Pitch.F, octave: MiddleOctave, durationType: Duration.Quarter, startBeat: 1.25 }
        )
    }, []);

    return (
        <div className="staff">
            <div className="clef-container">{getClef()}</div>
            <div className="key-signature-container" style={getKeySignatureStyle()}>{getKeySignatureSharpsAndFlats()}</div>
            <div className="ts-container" style={getTimeSignatureStyle()}>{getTimeSignature()}</div>
            {getMeasures()}
        </div>
    );
}

export default Staff;
