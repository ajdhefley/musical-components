import React, { useEffect, useState } from 'react'

import './Exercise.scss'
import { Staff } from '../lib/components/Staff/Staff'
import { Clef, FlatKeys, NotationType, Note } from '../lib/core/models'
import { useAppSelector } from '../redux-hooks'

function Exercise (): React.ReactElement {
    const exercises = useAppSelector(state => state.exercises)
    const [selectedExerciseId, setSelectedExerciseId] = useState<number>()
    const [exerciseData, setExerciseData] = useState<any>()

    useEffect(() => {
        setSelectedExerciseId(exercises.selectedExercise?.exerciseTypeId)
    }, [])

    useEffect(() => {
        // if (selectedExerciseId) {
        const apiUrl: string = process.env.API_URL ?? ''
        fetch(`${apiUrl}/exercise/${4}`)
            .then(async (res) => await res.json())
            .then((data) => {
                setExerciseData({
                    clef: data[0].clef.name === 'treble' ? Clef.TrebleClef : Clef.BassClef,
                    notes: data[0].notes.map((n: any) => new Note(getNoteTypeFromDuration(n.type.duration), n.pitch)),
                    bpm: data[0].bpm,
                    sharps: data[0].key.sharps,
                    flats: data[0].key.flats
                })
            })
        // }
    }, [selectedExerciseId])

    const getNoteTypeFromDuration = (duration: number) => {
        switch (duration) {
            case 1: return NotationType.Whole
            case 0.5: return NotationType.Half
            case 0.25: return NotationType.Quarter
            case 0.125: return NotationType.Eighth
            case 0.0625: return NotationType.Sixteenth
            case 0.03125: return NotationType.ThirtySecond
            default: throw Error(`Unrecognized duration: ${duration}`)
        }
    }

    return (
        <div>
            {exerciseData && <>
                <Staff
                    clef={exerciseData.clef}
                    beatsPerMeasure={4}
                    beatDuration={NotationType.Quarter}
                    beatsPerMinute={exerciseData.bpm}
                    initialNotes={exerciseData.notes}
                    sharps={exerciseData.sharps}
                    flats={exerciseData.flats}
                    interactive={true}
                />
            </>}
        </div>
    )
}

export default Exercise
