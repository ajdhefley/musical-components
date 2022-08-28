import React, { useEffect, useState } from 'react'

import './Staff.scss'
import { Clef, NaturalNote, Notation, NotationType, Note } from '../core/models'
import { MusicLogic } from '../core/music-logic'
import { MidiRelay } from '../core/midi-relay'
import { MidiAudio } from '../core/midi-audio'
import StaffMeasure from './StaffMeasure'
import StaffKeySignature from './StaffKeySignature'
import StaffTimeSignature from './StaffTimeSignature'
import StaffClef from './StaffClef'
import StaffLines from './StaffLines'
import { Metronome } from '../core/metronome'

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
}

/**
 *
 **/
function Staff ({ clef, beatsPerMeasure, beatDuration, beatsPerMinute, sharps, flats, initialNotations }: StaffProps): React.ReactElement {
    const [midiHandler] = useState(new MidiRelay())
    const [metronome] = useState(new Metronome(beatsPerMeasure, beatsPerMinute))
    const [notations, setNotations] = useState(new Array<Notation>())

    useEffect(() => {
        // @ts-expect-error
        addNotations(...initialNotations)
        midiHandler.openAccess().then((midiAccess) => {
            new MidiAudio().listen(midiAccess.inputs)
        })
    }, [])

    const getIntroContainerStyle = () => {
        const keySize = 17
        const ksWidth = ((sharps?.length ?? 0) + (flats?.length ?? 0)) * (keySize + 5)
        const tsWidth = 40
        const clefWidth = 50
        return {
            width: `${ksWidth + tsWidth + clefWidth + 25}px`
        }
    }

    const getMeasureElements = () => {
        const noteCollectionArray = MusicLogic.getMeasures(notations, beatsPerMeasure)
        return noteCollectionArray.map((noteCollection) => <>
            <StaffMeasure clef={clef} sharps={sharps} flats={flats} notes={noteCollection} beatsPerMeasure={beatsPerMeasure} />
        </>)
    }

    const addNotations = async (...addedNotations: Notation[]) => {
        const notes = MusicLogic.addNotations(notations, addedNotations, beatsPerMeasure)
        setNotations(notations.concat(notes))
    }

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

    const play = async () => {
        const lastNote = notations[notations.length - 1]
        const lastTick = lastNote.startBeat + lastNote.type.getBeatValue()

        const usingMetronome = true // TODO: make configurable by user or code
        if (usingMetronome) {
            metronome.start()
        }

        for (let i = 0; i < lastTick; i += 1 / 32) {
            await Promise.all(
                notations
                    .filter(n => n instanceof Note)
                    .filter(n => n.startBeat === i)
                    .map(async (note: any) => {
                        const baseBpm = 60
                        const baseCountDuration = 1000
                        const countDuration = (baseBpm / beatsPerMinute) * baseCountDuration
                        const noteDuration = note.type.getBeatsPerMeasure() * countDuration
                        midiHandler.sendMidi(note.pitch, noteDuration)
                        activateNotation(note)
                        return await new Promise<void>((resolve) => setTimeout(resolve, noteDuration))
                    })
            )
        }

        // Stop metronome.
        metronome.stop()

        // Set all notes to inactive.
        activateNotation(undefined)
    }

    return <>
        <button onClick={play} style={{ display: 'block', marginBottom: '10px', padding: '5px 20px' }}>Play</button>
        <div className="staff">
            <div className="staff-intro" style={getIntroContainerStyle()}>
                <StaffLines />
                <StaffClef type={clef} />
                <StaffKeySignature clef={clef} sharps={sharps} flats={flats} />
                <StaffTimeSignature beatsPerMeasure={beatsPerMeasure} beatDuration={beatDuration} sharps={sharps} flats={flats} />
            </div>
            {getMeasureElements()}
        </div>
    </>
}

export default Staff
