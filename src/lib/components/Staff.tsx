import React, { useEffect, useState } from 'react'

import './Staff.scss'
import { Clef, NaturalNote, Notation, NotationType } from '../core/models'
import { MusicLogic } from '../core/music-logic'
import { MidiNotationPlayer } from '../core/midi-notation-player'
import StaffMeasure from './StaffMeasure'
import StaffKeySignature from './StaffKeySignature'
import StaffTimeSignature from './StaffTimeSignature'
import StaffClef from './StaffClef'
import StaffLines from './StaffLines'
import { useAppSelector } from '../../redux-hooks'

/**
 *
 **/
interface StaffProps {
    /**
     * The treble or bass clef.
     **/
    clef: Clef

    /**
     * Number of beats per measure, determining the top number of the time signature.
     **/
    beatsPerMeasure: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

    /**
     * The value of a given beat, determining the bottom number of the time signature.
     **/
    beatDuration: NotationType

    /**
     * The intended tempo of the music.
     **/
    beatsPerMinute: number

    /**
     * The pitches that are sharped, determining the major key.
     * If both sharps and flats have values, flats will be ignored.
     **/
    sharps?: NaturalNote[]

    /**
     * The pitches that are flatted, determining the major key.
     * If both sharps and flats have values, flats will be ignored.
     **/
    flats?: NaturalNote[]

    /**
     *
     **/
    initialNotations?: Notation[]

    /**
     * Whether the user is allowed to place notes.
     **/
    interactive?: boolean
}

/**
 *
 **/
function Staff ({ clef, beatsPerMeasure, beatDuration, beatsPerMinute, sharps, flats, initialNotations, interactive }: StaffProps): React.ReactElement {
    const placedNote = useAppSelector((state) => state.notePlacement)
    const [midiPlayer] = useState(new MidiNotationPlayer(beatsPerMeasure, beatsPerMinute))
    const [notations, setNotations] = useState(new Array<Notation>())

    const id = Date.now().toString()

    useEffect(() => {
        // @ts-expect-error
        const notes = MusicLogic.addNotations(notations, initialNotations, beatsPerMeasure)
        setNotations(notations.concat(notes))
    }, [])

    useEffect(() => {
        if (placedNote?.note) {
            const notes = MusicLogic.addNotations(notations, [placedNote.note as any], beatsPerMeasure)
            setNotations(notations.concat(notes))
        }
    }, [placedNote])

    const activateNotation = (notation?: Notation) => {
        const newNotes = notations.map((iteratedNotation) => {
            if (iteratedNotation === notation) {
                iteratedNotation.active = true
                return iteratedNotation
            }

            iteratedNotation.active = false
            return iteratedNotation
        })

        setNotations(newNotes)
    }

    const togglePlayback = async () => {
        // Deactivate all notes
        activateNotation(undefined)

        if (midiPlayer.running()) {
            midiPlayer.stop()
        } else {
            midiPlayer.play(notations, false)
                .on('message', (note) => activateNotation(note))
                .on('stop', () => activateNotation(undefined))
        }
    }

    const getMeasureElements = () => {
        const measures = MusicLogic.splitIntoMeasures(notations, beatsPerMeasure, beatDuration)
        return measures.map((measureNotes) => <>
            <StaffMeasure staffId={id} clef={clef} sharps={sharps} flats={flats} notations={measureNotes} beatsPerMeasure={beatsPerMeasure} beatDuration={beatDuration} interactive={interactive} />
        </>)
    }

    return <>
        <button onClick={togglePlayback} style={{ display: 'block', marginBottom: '10px', padding: '5px 20px' }}>Play</button>
        <div className="staff" id={id}>
            <div className="staff-intro">
                <StaffLines />
                <StaffClef type={clef} />
                <StaffKeySignature clef={clef} sharps={sharps} flats={flats} />
                <StaffTimeSignature beatsPerMeasure={beatsPerMeasure} beatDuration={beatDuration} />
            </div>
            {getMeasureElements()}
        </div>
    </>
}

export default Staff
