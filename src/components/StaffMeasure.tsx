import React from 'react';

import './StaffMeasure.scss';
import Note from './Note';
import Rest from './Rest';
import { ClefType, OctaveType, Pitches } from '../types';
import { NotationDto, NoteDto, RestDto } from '../dtos';

interface Props {
    clef: ClefType;
}

interface State {
    notes: Array<NoteDto>;
    rests: Array<RestDto>;
}

export class StaffMeasure extends React.Component<Props, State> {
    public static readonly MinMeasureWidth: number = 400;
    public static readonly SpaceHeight: number = 20;
    public static readonly NoteLeftOffset: number = 100;
    public static readonly NoteSpacing: number = 300;
    public static readonly TreblePositionC: number = 6;
    public static readonly BassLocationC: number = 4;
    public static readonly MiddleOctave: OctaveType = 4;

    private getNotationLeftPosition = (notation: NotationDto) => {
        return (Note.Size + StaffMeasure.NoteSpacing) * notation.time;
    }

    private getNoteBottomPosition = (note: NoteDto) => {
        let cPosition = 0;

        switch (this.props.clef) {
            case 'treble':
                cPosition = StaffMeasure.TreblePositionC;
                break;
            case 'bass':
                cPosition = StaffMeasure.BassLocationC;
                break;
        }

        const noteHeight = StaffMeasure.SpaceHeight / 2;

        const cIndex = cPosition - 1;
        const basePosition = cIndex * noteHeight;

        const pitchIndex = Pitches.indexOf(note.pitch);
        const pitchPosition = pitchIndex * noteHeight;

        const octaveDiff = note.octave - StaffMeasure.MiddleOctave;
        const octaveDiffPosition = octaveDiff * noteHeight * Pitches.length;
        
        return basePosition + pitchPosition + octaveDiffPosition;
    }

    private getStaffWidth = () => {
        const noteWidth = this.state.notes.length === 0 ? 0 : this.state.notes
            .map((note) => this.getNotationLeftPosition(note))
            .reduce((prev, next) => prev + next);
        const restWidth = this.state.rests.length === 0 ? 0 : this.state.rests
            .map((rest) => this.getNotationLeftPosition(rest))
            .reduce((prev, next) => prev + next);
        return Math.max(StaffMeasure.MinMeasureWidth, noteWidth + restWidth + StaffMeasure.NoteLeftOffset);
    };

    private getStaffStyle = () => {
        return {
            width: `${this.getStaffWidth()}px`
        };
    }

    private getStaffSpaceStyle = () => {
        return {

        };
    }

    private getRenderedItems = () => {
        const notes = this.state?.notes.map((note: NoteDto) => {
            const leftPosition = this.getNotationLeftPosition(note as NotationDto) + StaffMeasure.NoteLeftOffset;
            const bottomPosition = this.getNoteBottomPosition(note);
            return (<Note model={note} left={leftPosition} bottom={bottomPosition} />);
        });

        const rests = this.state?.rests.map((rest: RestDto) => {
            const leftPosition = this.getNotationLeftPosition(rest) + StaffMeasure.NoteLeftOffset;
            return (<Rest model={rest} left={leftPosition} />);
        });

        return Array().concat(notes, rests);
    }
    
    private addNotes = async (...notes: NoteDto[]) => {
        await this.setState({ ...this.state, notes: this.state.notes.concat(notes) });
    }

    // TODO
    // private addNoteNext = async (type: NoteType, pitch: PitchType, octave: OctaveType) => {
    //     const lastNote = this.state.notes[this.state.notes.length-1];
    //     const nextTime = (lastNote?.time ?? 0) + (lastNote?.getDuration().value ?? 0);
    //     await this.addNotes(new NoteModel(type, pitch, octave, nextTime));
    // }

    async componentWillMount() {
        // TODO
        // this.setState({ notes: [], rests: [] }, async () => {
        //     for (let note of this.props.model.getNotes()) {
        //         await this.addNoteNext('quarter', 'G', 3);
        //     }
        // });
    }

    render() {
        return (
            <div className="staff-measure" style={this.getStaffStyle()}>
                {this.getRenderedItems()}
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
            </div>
        );
    }
}

export default StaffMeasure;
