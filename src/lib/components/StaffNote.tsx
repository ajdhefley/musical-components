import { useState } from 'react';

import './StaffNote.scss';
import { NoteModel } from '../models/note.model';
import { Accidental, Duration } from '../types';

/**
 * 
 **/
interface StaffNoteProps {
    /**
     * 
     **/
    model: NoteModel;

    /**
     * 
     **/
    left: number;

    /**
     * 
     **/
    bottom: number;

    /**
     * 
     **/
    size: number;

    /**
     * 
     **/
    accidental: Accidental | undefined;
}

/**
 * 
 **/
function StaffNote({ model, left, bottom, size, accidental }: StaffNoteProps) {
    const [activeStatus, setActiveStatus] = useState<'active' | 'inactive'>('inactive');

    const stemType: 'up' | 'down' = (() => {
        const numPitches = 7;
        const numOctaves = 6;
        const octaveNotes = (Math.floor(model.pitch / 12) - 1) * numPitches;
        const octavePosition = octaveNotes + model.pitch;
        return octavePosition >= (numPitches * numOctaves / 2) - 1 ? 'down' : 'up';
    })();

    const getNoteClass = () => {
        return `note note-${Duration[model.durationType].toLowerCase()} ${activeStatus} ${model.active ? 'active' : ''}`;
    }
    
    const getNoteStyle = () => {
        return {
            width: `${size}px`,
            height: `${size}px`,
            backgroundSize: `${size}px ${size}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            // (places center of the note on position instead of top-left corner)
            left: `${left - size/2}px`,
            bottom: `${bottom - size/2}px`, 
        };
    }

    const getStemClass = () => {
        return `stem ${stemType}`;
    }

    const getStemStyle = () => {
        return {
            transform: `scale(1, ${model.stemStretchFactor})`,
            width: `${size}px`,
            height: `${size * 2.5}px`,

            // If stem faces down, position it so that the top of the stem meets the bottom of the note
            // If stem faces up, position it so that the bottom of the stem meets the top of the note
            top: stemType == 'down' ? `${size/2}px` : `${-size*2}px`,

            // hack for now to fix visual bug
            left: stemType == 'down' ? '1px' : '0'
        };
    }

    const getFlagClass = () => {
        return `stem-flag ${stemType}`;;
    }

    const getFlagStyle = () => {
        return {
            width: `${size}px`,
            height: `${size*2}px`,

            // Position flag at top or bottom of stem depending on direction stem is facing
            top: stemType == 'down' ? `${size}px` : `${-size*2}px`,

            // hack for now to fix visual bug
            left: stemType == 'down' ? '2px' : `${size/2}px`
        };
    }

    const getFlag = () => {
        if (model.durationType == Duration.Eighth ||
            model.durationType == Duration.Sixteenth ||
            model.durationType == Duration.ThirtySecond) {
            return <div className={getFlagClass()} style={getFlagStyle()}></div>;
        }

        return <></>;
    }

    const getStem = () => {
        if (model.durationType == Duration.Whole) {
            return <></>;
        }

        return <div className={getStemClass()} style={getStemStyle()}></div>;
    }

    const getAccidentalElement = () => {
        return <div className={`accidental ${accidental}`} style={{ left: `${-size}px`}}></div>;
    }

    return (
        <div data-note={model} className={getNoteClass()} style={getNoteStyle()}>
            {getAccidentalElement()}
            {getStem()}
            {getFlag()}
        </div>
    );
}

export default StaffNote;
