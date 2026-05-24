import React from 'react'

import './StaffKeySignature.scss'
import { MusicStaffPlacementLogic, MusicStaffPlacementLogicConfig } from '@lib/core/MusicStaffPlacementLogic'

/**
 *
 **/
interface StaffKeySignatureProps {
    /**
     * All render layout and key context for this staff.
     **/
    renderConfig: MusicStaffPlacementLogicConfig
}

/**
 *
 **/
export function StaffKeySignature (props: StaffKeySignatureProps): React.ReactElement {
    const { renderConfig } = props

    const getTotalWidth = function () {
        return ((renderConfig.sharps?.length ?? 0) + (renderConfig.flats?.length ?? 0)) * (renderConfig.accidentalSize + 5)
    }

    const getSharpsAndFlats = function () {
        if (renderConfig.sharps) {
            return renderConfig.sharps.map((note, index) => {
                const leftPosition = MusicStaffPlacementLogic.getAccidentalLeftPosition(index, renderConfig)
                const bottomPosition = MusicStaffPlacementLogic.getAccidentalBottomPosition(note, renderConfig) - renderConfig.spaceHeight + 5
                return {
                    className: 'sharp',
                    style: {
                        left: `${leftPosition}px`,
                        bottom: `${bottomPosition}px`,
                        width: `${renderConfig.accidentalSize}px`,
                        height: `${renderConfig.accidentalSize}px`
                    }
                }
            })
        } else if (renderConfig.flats) {
            return renderConfig.flats.map((note, index) => {
                const leftPosition = MusicStaffPlacementLogic.getAccidentalLeftPosition(index, renderConfig)
                const bottomPosition = MusicStaffPlacementLogic.getAccidentalBottomPosition(note, renderConfig) - renderConfig.spaceHeight / 2 + 5
                return {
                    className: 'flat',
                    style: {
                        left: `${leftPosition}px`,
                        bottom: `${bottomPosition}px`,
                        width: `${renderConfig.accidentalSize}px`,
                        height: `${renderConfig.accidentalSize}px`
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

