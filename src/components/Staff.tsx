import { useEffect, useState } from 'react';

import './Staff.scss';
import { NoteModel } from '../models';
import { Note, ClefType, getDuration } from '../types';
import StaffMeasure from './StaffMeasure';

function Staff({
    clef,
    beatsPerMeasure,
    beatDuration,
    sharps,
    flats,
}: {
    clef: ClefType;
    beatsPerMeasure: number;
    beatDuration: number;
    sharps?: Note[];
    flats?: Note[];
}) {
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
            case 'treble':
                bottomMiddleC = SpaceHeight * 2 + noteHeight;
                break;
            case 'bass':
                bottomMiddleC = SpaceHeight * 5;
                break;
        }

        let pitchPosition = (pitch % numPitches) * noteHeight;
        let octavePosition = (octave - MiddleOctave) * numPitches * noteHeight;

        if (clef == 'bass')
            octavePosition -= numPitches * noteHeight;
        
        return bottomMiddleC + pitchPosition + octavePosition;
    }

    const getClef = () => {
        return <div className={clef}></div>
    }

    const getSharpsAndFlats = () => {
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
        const upper = beatsPerMeasure;
        const lower = 1 / beatDuration;

        return (<div>
            <div className={`ts-${upper}`} style={{ top: 0 }}></div>
            <div className={`ts-${lower}`} style={{ bottom: 0 }}></div>
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
        
        while (currentStep < lastNote.startBeat + getDuration(lastNote.durationType)) {
            let steppedNote = notes.find((note) => {
                return note.startBeat >= currentStep && note.startBeat < currentStep + getDuration(note.durationType);
            });

            if (steppedNote != currentNote) {
                currentNote = steppedNote;

                if (stepCounter >= 1) {
                    stepCounter = 0;
                    console.log('reset counter');
                    noteCollectionArray.push(new Array<NoteModel>());
                }

                if (currentNote) {
                    noteCollectionArray[noteCollectionArray.length - 1].push(currentNote);
                    console.log(noteCollectionArray);
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
            { pitch: Note.C, octave: 4, durationType: 'quarter', startBeat: 0, accidental: 'sharp' } as NoteModel,
            { pitch: Note.C, octave: 4, durationType: '8th', startBeat: 0.250 } as NoteModel,
            { pitch: Note.A, octave: 3, durationType: '8th', startBeat: 0.375, accidental: 'sharp' } as NoteModel,
            { pitch: Note.D, octave: 4, durationType: '16th', startBeat: 0.500 } as NoteModel,
            { pitch: Note.E, octave: 4, durationType: '16th', startBeat: 0.5625 } as NoteModel,
            { pitch: Note.B, octave: 3, durationType: '8th', startBeat: 0.625 } as NoteModel,
            { pitch: Note.G, octave: 3, durationType: '8th', startBeat: 0.75 } as NoteModel,
            { pitch: Note.F, octave: 4, durationType: '8th', startBeat: 0.875 } as NoteModel,
            { pitch: Note.F, octave: 4, durationType: '8th', startBeat: 1.0 } as NoteModel,
            { pitch: Note.F, octave: 4, durationType: '8th', startBeat: 1.125 } as NoteModel,
            { pitch: Note.F, octave: 4, durationType: 'quarter', startBeat: 1.25 } as NoteModel
        )
    }, []);

    return (
        <div className="staff">
            <div className="clef-container">{getClef()}</div>
            <div className="key-signature-container" style={getKeySignatureStyle()}>{getSharpsAndFlats()}</div>
            <div className="ts-container" style={getTimeSignatureStyle()}>{getTimeSignature()}</div>
            {getMeasures()}
        </div>
    );
}

export default Staff;
