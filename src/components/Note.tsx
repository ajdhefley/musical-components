import { useState } from 'react';

import './Note.scss';
import { Octaves, Pitches } from '../types';
import { NoteDto } from '../dtos/Note.dto';

function Note({
    model,
    left,
    bottom,
}: {
    model: NoteDto;
    left: number;
    bottom: number;
}) {
    const NoteSize: number = 30;

    const [active, setActive] = useState<boolean>();

    const stemDown = (() => {
        const octaveNotes = (model.octave - 1) * Pitches.length;
        const octavePosition = octaveNotes + model.pitch;
        return octavePosition >= (Pitches.length * Octaves.length / 2) - 1;
    })();

    const getNoteClass = () => {
        let cls = `note note-${model.type}`;
        if (active)
            cls += ' active';
        return cls;
    }
    
    const getNoteStyle = () => {
        return {
            width: `${NoteSize}px`,
            height: `${NoteSize}px`,
            backgroundSize: `${NoteSize}px ${NoteSize}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            left: `${left - NoteSize/2}px`,
            bottom: `${bottom - NoteSize/2}px`, 
        };
    }

    const getStemClass = () => {
        return 'stem ' + (stemDown ? 'down' : 'up');
    }

    const getStemStyle = () => {
        return {
            width: `${NoteSize}px`,
            height: `${NoteSize * 2.5}px`,
            top: stemDown ? `${NoteSize/2}px` : `${-NoteSize*2}px`,
            left: stemDown ? '1px' : '0' // hack for now
        };
    }

    const getFlagClass = () => {
        return 'stem-flag ' + (stemDown ? 'down' : 'up');;
    }

    const getFlagStyle = () => {
        return {
            width: `${NoteSize}px`,
            height: `${NoteSize*2}px`,
            top: stemDown ? `${NoteSize}px` : `${-NoteSize*2}px`,
            left: stemDown ? '2px' : `${NoteSize/2}px`
        };
    }

    return (
        <div data-note={model} className={getNoteClass()} style={getNoteStyle()}>
            {model.type !== 'whole' && <div className={getStemClass()} style={getStemStyle()}></div>}
            {/* {['8th', '16th', '32nd'].includes(model.type) && <div className={getFlagClass()} style={getFlagStyle()}></div>} */}
        </div>
    );
}

export default Note;
