import { useState } from 'react';

import './StaffMeasure.scss';
import Note from './Note';
import Rest from './Rest';
import { ClefType, OctaveType, Pitches } from '../types';
import { NotationDto, NoteDto, RestDto } from '../dtos';

function StaffMeasure({
    clef,
    sharps,
    flats,
}: {
    clef: ClefType;
    sharps?: number[];
    flats?: number[];
}) {
    const MinMeasureWidth: number = 400;
    const SpaceHeight: number = 20;
    const NoteLeftOffset: number = 100;
    const NoteSpacing: number = 300;
    const MiddleOctave: OctaveType = 4;
    const NoteSize: number = 30;

    const [notes, setNotes] = useState<NoteDto[]>();
    const [rests, setRests] = useState<RestDto[]>();

    const getNotationLeftPosition = (notation: NotationDto) => {
        return (NoteSize + NoteSpacing) * notation.time;
    }

    const getNoteBottomPosition = (pitch: number, octave: number) => {
        const noteHeight = SpaceHeight / 2;

        let bottomMiddleC = 0;

        switch (clef) {
            case 'treble':
                bottomMiddleC = SpaceHeight * 2 + noteHeight;
                break;
            case 'bass':
                bottomMiddleC = SpaceHeight * 5;
                break;
        }

        const pitchPosition = (pitch % Pitches.length) * noteHeight;
        const octavePosition = (octave - MiddleOctave) * Pitches.length * noteHeight;
        
        return bottomMiddleC + pitchPosition + octavePosition;
    }

    const getStaffWidth = () => {
        const noteWidth = !notes || notes.length === 0 ? 0 : notes
            .map((note) => getNotationLeftPosition(note))
            .reduce((prev, next) => prev + next);
        const restWidth = !rests || rests.length === 0 ? 0 : rests
            .map((rest) => getNotationLeftPosition(rest))
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

    const getSharpsFlats = () => {
        if (sharps) {
            return sharps.map((note, index) => {
                const leftPosition = index * 15;
                const bottomPosition = getNoteBottomPosition(note, note > 4 ? MiddleOctave - 1 : MiddleOctave) - SpaceHeight/2;
                return (<div className="sharp" style={{ left: `${leftPosition}px`, bottom: `${bottomPosition}px` }} />);
            });
        }
        else if (flats) {
            return flats.map((note, index) => {
                const leftPosition = index * 15;
                const bottomPosition = getNoteBottomPosition(note, note > 3 ? MiddleOctave - 1 : MiddleOctave) - SpaceHeight/2;
                return (<div className="flat" style={{ left: `${leftPosition}px`, bottom: `${bottomPosition}px` }} />);
            });
        }
    }

    const getRenderedItems = () => {
        const renderedNotes = notes?.map((note: NoteDto) => {
            const leftPosition = getNotationLeftPosition(note as NotationDto) + NoteLeftOffset;
            const bottomPosition = getNoteBottomPosition(note.pitch, note.octave);
            return (<Note model={note} left={leftPosition} bottom={bottomPosition} />);
        });

        const renderedRests = rests?.map((rest: RestDto) => {
            const leftPosition = getNotationLeftPosition(rest) + NoteLeftOffset;
            return (<Rest model={rest} left={leftPosition} />);
        });

        return Array().concat(renderedNotes, renderedRests);
    }
    
    const addNotes = async (...addedNotes: NoteDto[]) => {
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
            {getSharpsFlats()}
            {getRenderedItems()}
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
            <div className="staff-space" style={getStaffSpaceStyle()}></div>
        </div>
    );
}

export default StaffMeasure;
