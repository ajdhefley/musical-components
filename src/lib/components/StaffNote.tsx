import React from 'react'

import './StaffNote.scss'
import { Accidental, NotationType, Note } from '../core/models'

/**
 *
 **/
interface StaffNoteProps {
    /**
     *
     **/
    model: Note

    /**
     *
     **/
    left: number

    /**
     *
     **/
    bottom: number

    /**
     *
     **/
    size: number

    /**
     *
     **/
    accidental?: Accidental
}

/**
 *
 **/
function StaffNote ({ model, left, bottom, size, accidental }: StaffNoteProps): React.ReactElement {
    const stemType: 'up' | 'down' = (() => {
        const numPitches = 7
        const numOctaves = 6
        const octaveNotes = (Math.floor(model.pitch / 12) - 1) * numPitches
        const octavePosition = octaveNotes + parseInt(model.pitch.toString())
        return octavePosition >= (numPitches * numOctaves / 2) - 1 ? 'down' : 'up'
    })()

    const getNoteClass = () => {
        return `note note-${model.type.getCountPerMeasure()} ${model.active ? 'active' : ''}`
    }

    const getNoteStyle = () => {
        return {
            width: `${size}px`,
            height: `${size}px`,
            backgroundSize: `${size}px ${size}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            // (places center of the note on position instead of top-left corner)
            left: `${left - size / 2}px`,
            bottom: `${bottom - size / 2}px`
        }
    }

    const getFlagClass = () => {
        return `stem-flag ${stemType}`
    }

    const getFlagStyle = () => {
        return {
            width: `${size}px`,
            height: `${size * 2}px`,

            // Position flag at top or bottom of stem depending on direction stem is facing
            top: stemType === 'down' ? `${size}px` : `${-size * 2}px`,

            // hack for now to fix visual bug
            left: stemType === 'down' ? '2px' : `${size / 2}px`
        }
    }

    const getFlagElement = () => {
        if (model.type === NotationType.Eighth ||
            model.type === NotationType.Sixteenth ||
            model.type === NotationType.ThirtySecond) {
            return <div className={getFlagClass()} style={getFlagStyle()}></div>
        }

        return <></>
    }

    const getVerticalStemClass = () => {
        return `stem ${stemType}`
    }

    const getVerticalStemStyle = () => {
        return {
            transform: `scale(1, ${model.stemStretchFactor})`,
            width: `${size}px`,
            height: `${size * 2.5}px`,

            // If stem faces down, position it so that the top of the stem meets the bottom of the note
            // If stem faces up, position it so that the bottom of the stem meets the top of the note
            top: stemType === 'down' ? `${size / 2}px` : `${-size * 2}px`,

            // hack for now to fix visual bug
            left: stemType === 'down' ? '1px' : '0'
        }
    }

    const getVerticalStemElement = () => {
        if (model.type === NotationType.Whole) {
            return <></>
        }

        return <div className={getVerticalStemClass()} style={getVerticalStemStyle()}></div>
    }

    const getAccidentalElement = () => {
        return <div className={`accidental ${accidental?.name}`} style={{ left: `${-size}px` }}></div>
    }

    return (
        <div data-note={model} className={getNoteClass()} style={getNoteStyle()}>
            {getAccidentalElement()}
            {getVerticalStemElement()}
            {false && getFlagElement()}
        </div>
    )
}

export default StaffNote
