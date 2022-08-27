import './StaffKeySignature.scss';
import { Clef, NaturalNote } from '../types';
import { useEffect, useRef, useState } from 'react';

/**
 * 
 **/
interface StaffKeySignatureProps {
    /**
     * 
     **/
    clef: Clef;

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
function StaffKeySignature({ clef, sharps, flats }: StaffKeySignatureProps) {
    const ref = useRef(null);
    const [accidentalSize, setAccidentalSize] = useState(0);
    const [spaceHeight, setSpaceHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const refSpaceHeight = ref.current.clientHeight / 4;
            setSpaceHeight(refSpaceHeight);
            setAccidentalSize(refSpaceHeight * 1.75);
        }
    }, [ref]);

    const KeySize: number = 17;

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
            case Clef.Treble:
                // Occupies the 3rd space from the bottom, which is the 5th index where the bottom line is 0
                middleCPosition = 5;
                break;
            case Clef.Bass:
                // Occupies a whole step above the 4th line from the bottom, which is the 10th index where the bottom line is 0 
                middleCPosition = 10;
                break;
        }

        // Sharps/flats for key signature should occupy visible lines and spaces only
        // If a note exceeds it, bring it down an octave
        let pitchPosition = Object.values(NaturalNote).indexOf(noteValue)
        if (middleCPosition + pitchPosition > maxValidPosition)
            pitchPosition -= totalNotes;

        console.log({ note, pitchPosition });

        // One note per line and one per space equates to each note occupying a height of half each space
        const noteHeight = spaceHeight / 2;
        
        // Subtract by (accidentalSize / 2) to center vertically on position.
        return (middleCPosition + pitchPosition) * noteHeight;
    }

    const getKeySignatureAccidentals = () => {
        if (sharps) {
            return sharps.map((note, index) => {
                const leftPosition = index * KeySize;
                const bottomPosition = getKeyAccidentalBottomPosition(note) - spaceHeight + 5;
                return (<div className="sharp" style={{ left: `${leftPosition}px`, bottom: `${bottomPosition}px`, width: `${accidentalSize}px`, height: `${accidentalSize}px` }} />);
            });
        }
        else if (flats) {
            return flats.map((note, index) => {
                const leftPosition = index * KeySize;
                const bottomPosition = getKeyAccidentalBottomPosition(note) - spaceHeight/2 + 5;
                return (<div className="flat" style={{ left: `${leftPosition}px`, bottom: `${bottomPosition}px`, width: `${accidentalSize}px`, height: `${accidentalSize}px` }} />);
            });
        }
    }

    const getKeySignatureStyle = () => {
        return {
            width: `${((sharps?.length ?? 0) + (flats?.length ?? 0)) * (KeySize + 5)}px`
        }
    }

    return <div ref={ref} className="key-signature-container" style={getKeySignatureStyle()}>{getKeySignatureAccidentals()}</div>;
}

export default StaffKeySignature;