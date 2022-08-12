import { useState } from 'react';

import './StaffNote.scss';
import { NoteModel } from '../models/Note.model';
import { DurationType } from '../types';

function StaffNote({
    model,
    left,
    bottom,
    showAccidental,
    natural
}: {
    model: NoteModel;
    left: number;
    bottom: number;
    showAccidental: boolean;
    natural: boolean;
}) {
    const NoteSize = 30;

    const [active, setActive] = useState<'active' | 'inactive'>();

    const stemType: 'up' | 'down' = (() => {
        const numPitches = 7;
        const numOctaves = 6;
        const octaveNotes = (model.octave - 1) * numPitches;
        const octavePosition = octaveNotes + model.pitch;
        return octavePosition >= (numPitches * numOctaves / 2) - 1 ? 'down' : 'up';
    })();

    const getNoteClass = () => {
        return `note note-${model.durationType} ${active}`;
    }
    
    const getNoteStyle = () => {
        return {
            width: `${NoteSize}px`,
            height: `${NoteSize}px`,
            backgroundSize: `${NoteSize}px ${NoteSize}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            // (places center of the note on position instead of top-left corner)
            left: `${left - NoteSize/2}px`,
            bottom: `${bottom - NoteSize/2}px`, 
        };
    }

    const getStemClass = () => {
        return `stem ${stemType}`;
    }

    const getStemStyle = () => {
        return {
            width: `${NoteSize}px`,
            height: `${NoteSize * 2.5}px`,

            // If stem faces down, position it so that the top of the stem meets the bottom of the note
            // If stem faces up, position it so that the bottom of the stem meets the top of the note
            top: stemType == 'down' ? `${NoteSize/2}px` : `${-NoteSize*2}px`,

            // hack for now to fix visual bug
            left: stemType == 'down' ? '1px' : '0'
        };
    }

    const getFlagClass = () => {
        return `stem-flag ${stemType}`;;
    }

    const getFlagStyle = () => {
        return {
            width: `${NoteSize}px`,
            height: `${NoteSize*2}px`,

            // Position flag at top or bottom of stem depending on direction stem is facing
            top: stemType == 'down' ? `${NoteSize}px` : `${-NoteSize*2}px`,

            // hack for now to fix visual bug
            left: stemType == 'down' ? '2px' : `${NoteSize/2}px`
        };
    }

    const getFlag = () => {
        if (model.durationType == DurationType.Eighth ||
            model.durationType == DurationType.Sixteenth ||
            model.durationType == DurationType.ThirtySecond) {
            return <div className={getFlagClass()} style={getFlagStyle()}></div>;
        }

        return <></>;
    }

    const getStem = () => {
        if (model.durationType == DurationType.Whole) {
            return <></>;
        }

        return <div className={getStemClass()} style={getStemStyle()}></div>;
    }

    const getAccidental = () => {
        let accidentalClassName = showAccidental ? model.accidental : '';
        if (natural)
            accidentalClassName = 'natural';
        accidentalClassName = `accidental ${accidentalClassName}`;
        return <div className={accidentalClassName} style={{ left: `${-NoteSize}px`}}></div>;
    }

    return (
        <div data-note={model} className={getNoteClass()} style={getNoteStyle()}>
            {getAccidental()}
            {getStem()}
            {getFlag()}
        </div>
    );
}

export default StaffNote;
