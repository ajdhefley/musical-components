import { ComponentStateHandler } from '@lib/components/component-state-handler'
import { Notation, Note } from '@lib/core/models'
import { MusicLogic } from '@lib/core/MusicLogic'
import { StaffProps } from '@lib/components/Staff/Staff'

export class StaffController {
    private readonly notationsState: ComponentStateHandler<Notation[]>

    constructor (private readonly props: StaffProps) {
        this.notationsState = new ComponentStateHandler(new Array<Notation>())
        this.notationsState.update(this.props.initialNotes as Notation[])
        this.props.playback.setNotations(this.notationsState.value)
    }

    public addNote (note: Note) {
        const notes = MusicLogic.addNotations(this.notationsState.value, [note])
        this.notationsState.update(this.notationsState.value.concat(notes))
        this.props.playback.setNotations(this.notationsState.value)
    }

    public getMeasures () {
        return MusicLogic.splitIntoMeasures(this.notationsState.value, this.props.beatsPerMeasure, this.props.beatDuration)
    }
}
