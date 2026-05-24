import React, { useEffect } from 'react'
import { Score } from '@lib/core/Score'
import { ScorePlayback } from '@lib/core/ScorePlayback'
import { MusicLogic } from '@lib/core/MusicLogic'
import { Staff } from '@lib/components/Staff/Staff'

/**
 * Props for the ScoreView component.
 **/
interface ScoreViewProps {
    /**
     * The full score to render, containing one or more staves and voices.
     **/
    score: Score

    /**
     * Beats per minute used for audio playback.
     **/
    beatsPerMinute?: number

    /**
     * Whether the user is allowed to place notes interactively.
     **/
    interactive?: boolean

    /**
     * Playback controller for the full score.
     **/
    playback?: ScorePlayback
}

/**
 * Renders all staves in a Score, mapping each staff/voice to a Staff component.
 * This is the primary entry point for rendering a serializable Score document.
 **/
export function ScoreView (props: ScoreViewProps): React.ReactElement {
    useEffect(() => {
        if (props.playback) {
            props.playback.setScore(props.score)
        }
    }, [props.score, props.playback])

    return <>
        {props.score.staves.map((staff, staffIndex) => {
            // Merge all voices for this staff into a single notation timeline.
            // addNotations fills any gaps between notes with auto-generated rests.
            const rawNotations = staff.voices.flatMap((v) => v.notations)
            const notations = MusicLogic.addNotations([], rawNotations)

            return (
                <Staff
                    key={staff.id ?? staffIndex}
                    staff={staff}
                    notations={notations}
                    beatsPerMeasure={props.score.beatsPerMeasure}
                    beatDuration={props.score.beatDuration}
                    interactive={props.interactive}
                />
            )
        })}
    </>
}
