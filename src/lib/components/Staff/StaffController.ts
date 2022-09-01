import { ComponentStateHandler } from '@lib/components/component-state-handler'
import { Notation, Note } from '@lib/core/models'
import { MidiNotationPlayer } from '@lib/core/midi-notation-player'
import { MusicLogic } from '@lib/core/music-logic'
import { StaffProps } from '@lib/components/Staff/Staff'

export class StaffController {
    private readonly midiPlayer: MidiNotationPlayer
    private readonly notationsState: ComponentStateHandler<Notation[]>

    constructor (private readonly props: StaffProps) {
        this.midiPlayer = new MidiNotationPlayer(props.beatsPerMeasure, props.beatsPerMeasure)
        this.notationsState = new ComponentStateHandler(new Array<Notation>())
    }

    public addNote (note: Note) {
        const notes = MusicLogic.addNotations(this.notationsState.value, [note])
        this.notationsState.update(this.notationsState.value.concat(notes))
    }

    public activateNotation (notation: Notation) {
        const newNotes = this.notationsState.value.map((iteratedNotation) => {
            if (iteratedNotation === notation) {
                iteratedNotation.active = true
                return iteratedNotation
            }

            iteratedNotation.active = false
            return iteratedNotation
        })

        this.notationsState.update(newNotes)
    }

    public deactivateNotations () {
        const newNotes = this.notationsState.value.map((iteratedNotation) => {
            iteratedNotation.active = false
            return iteratedNotation
        })

        this.notationsState.update(newNotes)
    }

    public async togglePlayback () {
        this.deactivateNotations()

        if (this.midiPlayer.running()) {
            this.midiPlayer.stop()
        } else {
            this.midiPlayer.play(this.notationsState.value, false)
                .on('message', (note) => this.activateNotation(note))
                .on('stop', () => this.deactivateNotations())
        }
    }

    public getMeasures () {
        return MusicLogic.splitIntoMeasures(this.notationsState.value, this.props.beatsPerMeasure, this.props.beatDuration)
    }
}
