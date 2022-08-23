import { useEffect, useState } from 'react';

import './Staff.scss';
import { NotationModel, NoteModel, RestModel } from '../models';
import { NaturalNote, ClefType, Duration, BeatsPerMeasureType, Pitch, getDurationTypeFromValue } from '../types';
import StaffMeasure from './StaffMeasure';
import { MidiAudioRelay } from '../audio/midi-audio-relay';

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
}

/**
 * 
 **/
function Staff({ clef, beatsPerMeasure, beatDuration, beatsPerMinute, sharps, flats }: StaffProps) {
    const ClefWidth: number = 50;
    const SpaceHeight: number = 20;
    const KeySize: number = 17;

    const [notes, setNotes] = useState(new Array<NotationModel>());
    const [midi, setMidi] = useState<WebMidi.MIDIAccess>();

    const initializeMIDI = () => {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }

    const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
        var midiAudioRelay = new MidiAudioRelay();
        midiAudioRelay.init(midiAccess);
        setMidi(midiAccess);
    }

    const onMIDIFailure = (msg: string) => {
        console.log('Failed to get MIDI access - ' + msg);
    }

    const getClef = () => {
        return <div className={ClefType[clef].toLowerCase()}></div>
    }

    const getKeyAccidentalBottomPosition = (note: NaturalNote) => {
        // String value ("A", "B", "C", etc) of the note
        const noteValue = NaturalNote[note]

        // Filtered by isNaN because TS includes both keys and values in array of heterogeneous enum values
        // Explanation here: https://stackoverflow.com/a/51536142/3068267
        // We only want numeric values
        const totalNotes = Object.values(NaturalNote).filter(isNaN).length;

        // 4 spaces plus 5 lines on the staff is 9 total valid positions occupied by the sharps/flats
        const maxValidPosition = 9 
        
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

        // Sharps/flats for key signature should occupy visible lines and spaces only
        // If a note exceeds it, bring it down an octave
        let pitchPosition = Object.values(NaturalNote).indexOf(noteValue)
        if (middleCPosition + pitchPosition > maxValidPosition)
            pitchPosition -= totalNotes;

        // One note per line and one per space equates to each note occupying a height of half each space
        const noteHeight = SpaceHeight / 2;
        
        return (middleCPosition + pitchPosition) * noteHeight;
    }

    const getKeySignatureAccidentals = () => {
        if (sharps) {
            return sharps.map((note, index) => {
                const leftPosition = index * KeySize;
                const bottomPosition = getKeyAccidentalBottomPosition(note) - SpaceHeight + 5;
                return (<div className="sharp" style={{ left: `${leftPosition}px`, bottom: `${bottomPosition}px` }} />);
            });
        }
        else if (flats) {
            return flats.map((note, index) => {
                const leftPosition = index * KeySize;
                const bottomPosition = getKeyAccidentalBottomPosition(note) - SpaceHeight/2 + 5;
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
            const steppedNote = notes.find(n => currentStep >= n.startBeat && currentStep < n.startBeat + 1/n.durationType);

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
    
    const addNotes = async (...addedNotes: NotationModel[]) => {
        let nextTime = 0;

        if (notes.length > 0) {
            let lastNote = notes[notes.length - 1];
            nextTime = lastNote.startBeat + 1 / lastNote.durationType;
        }
        
        addedNotes.forEach((addedNote, addedNoteIndex) => {
            if (addedNote instanceof RestModel) {
                return;
            }

            if (addedNoteIndex > 0) {
                let lastNote = addedNotes[addedNoteIndex - 1];
                nextTime = lastNote.startBeat + 1 / lastNote.durationType;
                let timediff = addedNote.startBeat - nextTime;

                // TODO: find largest possible rest in time diff, keep repeating until time filled
                // TODO: handle dotted rests
                
                if (timediff > 0) {
                    addedNotes.splice(addedNoteIndex, 0, new RestModel(getDurationTypeFromValue(timediff), nextTime));
                }
            }

            addedNote.startBeat = nextTime;
            addedNote.active = false;
        });

        setNotes(notes.concat(addedNotes));
    }
    
    const getBeatDurationProportion = (duration: Duration) => {
        switch (duration) {
            case Duration.ThirtySecond: return 1/8;
            case Duration.Sixteenth: return 1/4;
            case Duration.Eighth: return 1/2;
            case Duration.Quarter: return 1;
            case Duration.Half: return 2;
            case Duration.Whole: return 4;
        }
    }

    const activateNotation = (notation?: NotationModel) => {
        const newNotes = notes.map((iteratedNotation) => {
            if (iteratedNotation === notation) {
                iteratedNotation.active = true;
                return iteratedNotation;
            }

            iteratedNotation.active = false;
            return iteratedNotation;
        });

        setNotes(newNotes);
    }

    const dispatchNoteMidi = (pitch: Pitch | number, duration: number) => {
        midi.outputs.forEach((output) => {
            output.send([ 0x90, pitch, 0x7f ]);
            window.setTimeout(() => output.send([ 0x80, pitch, 0x7f ]), duration);
        });
    }

    const play = async () => {
        for (let note of notes) {
            const baseBpm = 60;
            const baseBeatDuration = 1000;
            const beatDuration = (baseBpm / beatsPerMinute) * baseBeatDuration;
            const noteDuration = getBeatDurationProportion(note.durationType) * beatDuration;

            activateNotation(note);

            if (note instanceof NoteModel) {
                dispatchNoteMidi(note.pitch, noteDuration);
            }

            await new Promise((resolve) => setTimeout(resolve, noteDuration));
        }

        // Set all notes to inactive.
        activateNotation(null);
    }

    useEffect(() => {
        addNotes(
            new NoteModel(Pitch.G3, Duration.Sixteenth),
            new NoteModel(Pitch.A3, Duration.Sixteenth),
            new NoteModel(Pitch.C4, Duration.Sixteenth),
            new NoteModel(Pitch.D4, Duration.Sixteenth),
            new NoteModel(Pitch.G3, Duration.Eighth),
            new NoteModel(Pitch.A3, Duration.Eighth),
            new NoteModel(Pitch.C4, Duration.Eighth),
            new NoteModel(Pitch.D4, Duration.Eighth),
            new NoteModel(Pitch.C4, Duration.Eighth),
            new NoteModel(Pitch.D4, Duration.Eighth),
            new NoteModel(Pitch.G3, Duration.Quarter),
            new NoteModel(Pitch.A3, Duration.Quarter),
            new NoteModel(Pitch.C4, Duration.Quarter),
            new NoteModel(Pitch.D4, Duration.Quarter),
        );
    }, []);

    return <>
        <button onClick={play}>Play</button>
        <div className="staff" onClick={initializeMIDI}>
            <div style={getIntroContainerStyle()}>
                <div className="staff-space"></div>
                <div className="staff-space"></div>
                <div className="staff-space"></div>
                <div className="staff-space"></div>
                <div className="clef-container">{getClef()}</div>
                <div className="key-signature-container" style={getKeySignatureStyle()}>{getKeySignatureAccidentals()}</div>
                <div className="ts-container" style={getTimeSignatureStyle()}>{getTimeSignature()}</div>
            </div>
            {getMeasures()}
        </div>
    </>
}

export default Staff;
