import { useEffect, useState } from 'react';

import './Staff.scss';
import { NotationModel, NoteModel, RestModel } from '../models';
import { NaturalNote, Clef, Duration, BeatsPerMeasureType, Pitch } from '../types';
import StaffMeasure from './StaffMeasure';
import { MidiAudioRelay } from '../audio/midi-audio-relay';
import StaffKeySignature from './StaffKeySignature';
import StaffTimeSignature from './StaffTimeSignature';
import StaffClef from './StaffClef';
import StaffLines from './StaffLines';
import { MusicLogic } from '../music-logic';
import { MidiBrowserHandler } from '../midi-browser-handler';

/**
 * 
 **/
interface StaffProps {
    /**
     * The treble or bass clef.
     **/
    clef: Clef;

    /**
     * Number of beats per measure, determining the top number of the time signature.
     **/
    beatsPerMeasure: BeatsPerMeasureType;

    /**
     * The value of a given beat, determining the bottom number of the time signature.
     **/
    beatDuration: Duration;

    /**
     * The intended tempo of the music.
     **/
    beatsPerMinute: number;

    /**
     * The pitches that are sharped, determining the major key.
     * If both sharps and flats have values, flats will be ignored.
     **/
    sharps?: NaturalNote[];

    /**
     * The pitches that are flatted, determining the major key.
     * If both sharps and flats have values, flats will be ignored.
     **/
    flats?: NaturalNote[];

    /**
     * 
     **/
    initialNotations?: NotationModel[];
}

/**
 * 
 **/
function Staff({ clef, beatsPerMeasure, beatDuration, beatsPerMinute, sharps, flats, initialNotations }: StaffProps) {
    const KeySize: number = 17;

    const [midiHandler] = useState(new MidiBrowserHandler());
    const [notations, setNotations] = useState(new Array<NotationModel>());

    useEffect(() => {
        addNotations(...initialNotations);
        midiHandler.openAccess().then((midiAccess) => {
            new MidiAudioRelay().listen(midiAccess.inputs);
        });
    }, []);

    const getIntroContainerStyle = () => {
        const ksWidth = ((sharps?.length ?? 0) + (flats?.length ?? 0)) * (KeySize + 5);
        const tsWidth = 40;
        const clefWidth = 50;
        return {
            width: `${ksWidth + tsWidth + clefWidth + 25}px`,
            display: 'inline-block',
            borderBottom: '1px solid #000'
        }
    }

    const getMeasureElements = () => {
        const noteCollectionArray = MusicLogic.getMeasures(notations, beatsPerMeasure);
        return noteCollectionArray.map((noteCollection) => <>
            <StaffMeasure clef={clef} sharps={sharps} flats={flats} notes={noteCollection} />
        </>)
    }
    
    const addNotations = async (...addedNotations: NotationModel[]) => {
        const notes = MusicLogic.addNotations(notations, addedNotations);
        setNotations(notations.concat(notes));
    }

    const activateNotation = (notation?: NotationModel) => {
        const newNotes = notations.map((iteratedNotation) => {
            if (iteratedNotation === notation) {
                iteratedNotation.active = true;
                return iteratedNotation;
            }

            iteratedNotation.active = false;
            return iteratedNotation;
        });

        setNotations(newNotes);
    }

    const play = async () => {
        let lastNote = notations[notations.length - 1];
        const lastTick = lastNote.startBeat + (1/lastNote.durationType);

        for (let i = 0; i < lastTick; i += 1/32) {
            await Promise.all(
                notations
                    .filter(n => n instanceof NoteModel)
                    .filter(n => n.startBeat == i)
                    .map((note: NoteModel) => {
                        const baseBpm = 60;
                        const baseBeatDuration = 1000;
                        const beatDuration = (baseBpm / beatsPerMinute) * baseBeatDuration;
                        const noteDuration = MusicLogic.getBeatValueFromDurationType(note.durationType) * beatDuration;
                        activateNotation(note);
                        midiHandler.dispatchMidiMessage(note.pitch, noteDuration);
                        return new Promise((resolve) => setTimeout(resolve, noteDuration));
                    })
            );
        }

        // Set all notes to inactive.
        activateNotation(null);
    }

    return <>
        <button onClick={play} style={{ display: 'block', marginBottom: '10px', padding: '5px 20px' }}>Play</button>
        <div className="staff">
            <div style={getIntroContainerStyle()}>
                <StaffLines />
                <StaffClef type={clef} />
                <StaffKeySignature clef={clef} sharps={sharps} flats={flats} />
                <StaffTimeSignature beatsPerMeasure={beatsPerMeasure} beatDuration={beatDuration} sharps={sharps} flats={flats} />
            </div>
            {getMeasureElements()}
        </div>
    </>
}

export default Staff;
