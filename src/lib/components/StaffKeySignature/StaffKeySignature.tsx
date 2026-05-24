import React from 'react'

import './StaffKeySignature.scss'
import { Clef, NaturalNote } from '@lib/core/models'
import { MusicStaffPlacementLogic } from '@lib/core/MusicStaffPlacementLogic'

/**
 *
 **/
interface StaffKeySignatureProps {
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
    const getTotalWidth = function () {
        return ((props.sharps?.length ?? 0) + (props.flats?.length ?? 0)) * (props.accidentalSize + 5)
    }

    const getSharpsAndFlats = function () {
        if (props.sharps) {
            return props.sharps.map((note, index) => {
                const leftPosition = MusicStaffPlacementLogic.instance.getAccidentalLeftPosition(index)
                const bottomPosition = MusicStaffPlacementLogic.instance.getAccidentalBottomPosition(note) - props.spaceHeight + 5
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
                const leftPosition = MusicStaffPlacementLogic.instance.getAccidentalLeftPosition(index)
                const bottomPosition = MusicStaffPlacementLogic.instance.getAccidentalBottomPosition(note) - props.spaceHeight / 2 + 5
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
