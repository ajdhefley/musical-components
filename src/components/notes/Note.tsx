import React from 'react';

import './Note.scss';
import { ClefType, NoteType, Octaves, Pitches } from '../../types';
import { NoteModel, StaffModel } from '../../models';

interface Props {
    model: NoteModel;
    clef: ClefType;
}

export abstract class Note extends React.Component<Props> {
    protected readonly abstract type: NoteType;
    protected readonly abstract domain: number[];

    protected get stemDown(): boolean {
        return this.props.model.getOctavePosition() >= (Pitches.length * Octaves.length / 2) - 1;
    }

    private getStemClass = () => {
        return 'stem ' + (this.stemDown ? 'down' : 'up');
    }

    private getStemStyle = () => {
        return {
            width: `${NoteModel.NoteSize}px`,
            height: `${NoteModel.NoteSize * 2.5}px`,
            top: this.stemDown ? `${NoteModel.NoteSize/2}px` : `${-NoteModel.NoteSize*2}px`,
            left: this.stemDown ? '1px' : '0' // hack for now
        };
    }

    private getNoteClass = () => {
        return `note note-${this.type}`;
    }
    
    private getNoteStyle = () => {
        return {
            width: `${NoteModel.NoteSize}px`,
            height: `${NoteModel.NoteSize}px`,
            backgroundSize: `${NoteModel.NoteSize}px ${NoteModel.NoteSize}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            left: `${this.getAbsolutePositionLeft() - NoteModel.NoteSize/2}px`,
            bottom: `${this.getAbsolutePositionBottom() - NoteModel.NoteSize/2}px`, 
        };
    }

    private getFlagClass = () => {
        return 'stem-flag ' + (this.stemDown ? 'down' : 'up');;
    }

    private getFlagStyle = () => {
        return {
            width: `${NoteModel.NoteSize}px`,
            height: `${NoteModel.NoteSize*2}px`,
            top: this.stemDown ? `${NoteModel.NoteSize}px` : `${-NoteModel.NoteSize*2}px`,
            left: this.stemDown ? '2px' : `${NoteModel.NoteSize/2}px`
        };
    }

    public getAbsolutePositionLeft(): number {
        return this.props.model.time * 150;
    }

    public getAbsolutePositionBottom(): number {
        let cPosition = 0;

        switch (this.props.clef) {
            case 'treble':
                cPosition = NoteModel.TreblePositionC;
                break;
            case 'bass':
                cPosition = NoteModel.BassLocationC;
                break;
        }

        const noteHeight = StaffModel.StaffSpaceHeight / 2;

        const cIndex = cPosition - 1;
        const basePosition = cIndex * noteHeight;

        const pitchIndex = Pitches.indexOf(this.props.model.pitch);
        const pitchPosition = pitchIndex * noteHeight;

        const octaveDiff = this.props.model.octave - NoteModel.MiddleOctave;
        const octaveDiffPosition = octaveDiff * noteHeight * Pitches.length;
        
        return basePosition + pitchPosition + octaveDiffPosition;
    }

    componentWillMount() {
        if (!this.domain.includes(this.props.model.time)) {
            throw new Error(`${this.type} note cannot exist at slot ${this.props.model.time}`);
        }
    }

    render() {
        return (
            <div data-note={this.props.model} className={this.getNoteClass()} style={this.getNoteStyle()}>
                {this.props.model.type != 'whole' && <div className={this.getStemClass()} style={this.getStemStyle()}></div>}
                {['8th', '16th', '32nd'].includes(this.props.model.type) && <div className={this.getFlagClass()} style={this.getFlagStyle()}></div>}
            </div>
        );
    }
}

export default Note;
