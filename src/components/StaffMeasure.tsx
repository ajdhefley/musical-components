import { useState } from 'react';

import './StaffMeasure.scss';
import { ClefType, NoteModel, RestModel } from '../models';
import Rest from './Rest';
import Note from './Note';

function StaffMeasure({
    clef,
    beatsPerMeasure,
    beatDuration,
    sharps,
    flats,
}: {
    clef: ClefType;
    beatsPerMeasure: number;
    beatDuration: number;
    sharps?: number[];
    flats?: number[];
}) {
    const MinMeasureWidth: number = 400;
    const SpaceHeight: number = 20;
    const NoteLeftOffset: number = 100;
    const NoteSpacing: number = 300;
    const MiddleOctave: number = 4;
    const NoteSize: number = 30;

    const [notes, setNotes] = useState<NoteModel[]>();
    const [rests, setRests] = useState<RestModel[]>();

    const getItemLeftPosition = (time: number) => {
        return (NoteSize + NoteSpacing) * time;
    }

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

    const getStaffWidth = () => {
        const noteWidth = !notes || notes.length === 0 ? 0 : notes
            .map((note) => getItemLeftPosition(note.time))
            .reduce((prev, next) => prev + next);
        const restWidth = !rests || rests.length === 0 ? 0 : rests
            .map((rest) => getItemLeftPosition(rest.time))
            .reduce((prev, next) => prev + next);
        return Math.max(MinMeasureWidth, noteWidth + restWidth + NoteLeftOffset);
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

    const getClef = () => {
        return <div className={clef}></div>
    }

    const getSharpsAndFlats = () => {
        if (sharps) {
            return sharps.map((note, index) => {
                const leftPosition = index * 15;
                const bottomPosition = getItemBottomPosition(note, note > 4 ? MiddleOctave - 1 : MiddleOctave) - SpaceHeight;
                return (<div className="sharp" style={{ left: `${leftPosition}px`, bottom: `${bottomPosition}px` }} />);
            });
        }
        else if (flats) {
            return flats.map((note, index) => {
                const leftPosition = index * 15;
                const bottomPosition = getItemBottomPosition(note, note > 3 ? MiddleOctave - 1 : MiddleOctave) - SpaceHeight/2;
                return (<div className="flat" style={{ left: `${leftPosition}px`, bottom: `${bottomPosition}px` }} />);
            });
        }
    }

    const getTimeSignature = () => {
        const upper = beatsPerMeasure;
        const lower = 1 / beatDuration;

        // Collapse the time signature by the missing number of sharps/flats (max of 7).
        const leftReduction = (7 - ((sharps?.length ?? 0) + (flats?.length ?? 0))) * 10;

        return (<div>
            <div className={`ts-${upper}`} style={{ top: 0, marginLeft: `${-leftReduction}px` }}></div>
            <div className={`ts-${lower}`} style={{ bottom: 0, marginLeft: `${-leftReduction}px`}}></div>
        </div>);
    }

    const getNotations = () => {
        const renderedNotes = notes?.map((note: NoteModel) => {
            const leftPosition = getItemLeftPosition(note.time) + NoteLeftOffset;
            const bottomPosition = getItemBottomPosition(note.pitch, note.octave);
            return (<Note model={note} left={leftPosition} bottom={bottomPosition} />);
        });

        const renderedRests = rests?.map((rest: RestModel) => {
            const leftPosition = getItemLeftPosition(rest.time) + NoteLeftOffset;
            return (<Rest model={rest} left={leftPosition} />);
        });

        return Array().concat(renderedNotes, renderedRests);
    }
    
    const addNotes = async (...addedNotes: NoteModel[]) => {
        await setNotes(notes.concat(addedNotes));
    }

    // TODO
    // private addNoteNext = async (type: NoteType, pitch: PitchType, octave: OctaveType) => {
    //     const lastNote = notes[notes.length-1];
    //     const nextTime = (lastNote?.time ?? 0) + (lastNote?.getDuration().value ?? 0);
    //     await addNotes(new NoteModel(type, pitch, octave, nextTime));
    // }

    return (
        <div className="staff-measure" style={getStaffStyle()}>
            <div className="clef-container">
                {getClef()}
            </div>
            <div className="key-signature-container">
                {getSharpsAndFlats()}
            </div>
            <div className="ts-container">
                {getTimeSignature()}
            </div>
            <div className="notation-container">
                {getNotations()}
            </div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
        </div>
    );
}

export default StaffMeasure;
