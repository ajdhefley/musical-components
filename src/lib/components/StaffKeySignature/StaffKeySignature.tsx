import React from 'react'

import './StaffKeySignature.scss'
import { Clef, NaturalNote, NotationType } from '@lib/core/models'
import { MusicStaffPlacementLogic } from '@lib/core/MusicStaffPlacementLogic'

/**
 *
 **/
export interface StaffKeySignatureProps {
    /**
     *
     **/
    clef: Clef

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
    accidentalSize: number

    /**
     *
     **/
    spaceHeight: number
}

/**
 *
 **/
export function StaffKeySignature (props: StaffKeySignatureProps): React.ReactElement {
    const staffPlacement = new MusicStaffPlacementLogic({
        accidentalSize: props.accidentalSize,
        noteSize: 0,
        noteSpacing: 0,
        spaceHeight: props.spaceHeight,
        defaultStemHeight: 0,
        clef: props.clef,
        sharps: props.sharps,
        flats: props.flats,
        beatsPerMeasure: 0,
        beatDuration: NotationType.Quarter
    })

    const getTotalWidth = function () {
        return ((props.sharps?.length ?? 0) + (props.flats?.length ?? 0)) * (props.accidentalSize + 5)
    }

    const getSharpsAndFlats = function () {
        if (props.sharps) {
            return props.sharps.map((note, index) => {
                const leftPosition = staffPlacement.getAccidentalLeftPosition(index)
                const bottomPosition = staffPlacement.getAccidentalBottomPosition(note) - props.spaceHeight + 5
                return {
                    className: 'sharp',
                    style: {
                        left: `${leftPosition}px`,
                        bottom: `${bottomPosition}px`,
                        width: `${props.accidentalSize}px`,
                        height: `${props.accidentalSize}px`
                    }
                }
            })
        } else if (props.flats) {
            return props.flats.map((note, index) => {
                const leftPosition = index * props.accidentalSize
                const bottomPosition = staffPlacement.getAccidentalBottomPosition(note) - props.spaceHeight / 2 + 5
                return {
                    className: 'flat',
                    style: {
                        left: `${leftPosition}px`,
                        bottom: `${bottomPosition}px`,
                        width: `${props.accidentalSize}px`,
                        height: `${props.accidentalSize}px`
                    }
                }
            })
        }
    }

    return <>
        <div
            className="key-signature-container"
            style={{ width: `${getTotalWidth()}px` }}
        >
            {getSharpsAndFlats()?.map((accidental, index) => (
                <div
                    key={index}
                    className={accidental.className}
                    style={accidental.style}
                />
            ))}
        </div>
    </>
}
