import { Clef, NaturalNote } from '@lib/core/models'
import { StaffKeySignatureProps } from '@lib/components/StaffKeySignature/StaffKeySignature'

export class StaffKeySignatureController {
    constructor (private readonly props: StaffKeySignatureProps) {

    }

    public getTotalWidth () {
        return ((this.props.sharps?.length ?? 0) + (this.props.flats?.length ?? 0)) * (this.props.accidentalSize + 5)
    }

    public getSharpsAndFlats () {
        if (this.props.sharps) {
            return this.props.sharps.map((note, index) => {
                const leftPosition = this.getAccidentalLeftPosition(index)
                const bottomPosition = this.getAccidentalBottomPosition(note) - this.props.spaceHeight + 5
                return {
                    className: 'sharp',
                    style: {
                        left: `${leftPosition}px`,
                        bottom: `${bottomPosition}px`,
                        width: `${this.props.accidentalSize}px`,
                        height: `${this.props.accidentalSize}px`
                    }
                }
            })
        } else if (this.props.flats) {
            return this.props.flats.map((note, index) => {
                const leftPosition = index * this.props.accidentalSize
                const bottomPosition = this.getAccidentalBottomPosition(note) - this.props.spaceHeight / 2 + 5
                return {
                    className: 'flat',
                    style: {
                        left: `${leftPosition}px`,
                        bottom: `${bottomPosition}px`,
                        width: `${this.props.accidentalSize}px`,
                        height: `${this.props.accidentalSize}px`
                    }
                }
            })
        }
    }

    private getAccidentalLeftPosition (index: number) {
        return index * this.props.accidentalSize
    }

    private getAccidentalBottomPosition (note: NaturalNote) {
        // String value ("A", "B", "C", etc) of the note
        const noteValue = NaturalNote[note]

        // @ts-expect-error
        const totalNaturalNotes = Object.values(NaturalNote).filter(isNaN).length

        // The position of Middle C on the staff is different depending on the clef.
        // We calculate the position of each note relative to Middle C, so this needs
        // to be known ahead of time.

        let maxValidPosition = 0
        let middleCPosition = 0

        switch (this.props.clef) {
            case Clef.TrebleClef:
                // Occupies the 3rd space from the bottom, which is the 5th index where the bottom line is 0
                middleCPosition = 5
                maxValidPosition = 11
                break
            case Clef.BassClef:
                // Occupies a whole step above the 4th line from the bottom, which is the 10th index where the bottom line is 0
                middleCPosition = 10
                maxValidPosition = 9
                break
        }

        // Sharps/flats for key signature should occupy visible lines and spaces only
        // If a note exceeds it, bring it down an octave (total number of natural notes in terms of position)
        let pitchPosition = Object.values(NaturalNote).indexOf(noteValue)
        while (middleCPosition + pitchPosition >= maxValidPosition) {
            pitchPosition -= totalNaturalNotes
        }

        // One note per line and one per space equates to each note occupying a height of half each space
        const noteHeight = this.props.spaceHeight / 2

        return (middleCPosition + pitchPosition) * noteHeight - 4
    }
}
