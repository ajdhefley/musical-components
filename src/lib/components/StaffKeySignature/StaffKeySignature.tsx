import React from 'react'

import '@lib/components/StaffKeySignature/StaffKeySignature.scss'
import { Clef, NaturalNote } from '@lib/core/models'
import { StaffKeySignatureController } from './StaffKeySignatureController'

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
    const controller = new StaffKeySignatureController(props)

    return <>
        <div
            className="key-signature-container"
            style={{ width: `${controller.getTotalWidth()}px` }}
        >
            {controller.getSharpsAndFlats()?.map((accidental, index) => (
                <div
                    key={index}
                    className={accidental.className}
                    style={accidental.style}
                />
            ))}
        </div>
    </>
}
