import './StaffTimeSignature.scss';
import { BeatsPerMeasureType, Duration, NaturalNote } from '../types';

interface StaffTimeSignatureProps {
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
    sharps?: NaturalNote[];
 
    /**
     * The pitches that are flatted, determining the major key.
     * If both sharps and flats have values, flats will be ignored.
     **/
    flats?: NaturalNote[];
}

function StaffTimeSignature({ beatsPerMeasure, beatDuration, sharps, flats }: StaffTimeSignatureProps) {
    const ClefWidth: number = 50;
    const KeySize: number = 17;

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

    return <div className="ts-container" style={getTimeSignatureStyle()}>{getTimeSignature()}</div>;
}

export default StaffTimeSignature;