import React from 'react';

import './Note.scss';
import { ClefType, Octaves, Pitches } from '../types';
import { NoteModel, StaffModel } from '../models';
import Staff from './Staff';

interface Props {
    model: NoteModel;
    clef: ClefType;
}

export class Note extends React.Component<Props> {
    public static readonly Size: number = 30;

    protected get stemDown(): boolean {
        return this.props.model.getOctavePosition() >= (Pitches.length * Octaves.length / 2) - 1;
    }

    private getNoteClass = () => {
        return `note note-${this.props.model.type}`;
    }
    
    private getNoteStyle = () => {
        return {
            width: `${Note.Size}px`,
            height: `${Note.Size}px`,
            backgroundSize: `${Note.Size}px ${Note.Size}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            left: `${this.getAbsolutePositionLeft() - Note.Size/2}px`,
            bottom: `${this.getAbsolutePositionBottom() - Note.Size/2}px`, 
        };
    }

    private getStemClass = () => {
        return 'stem ' + (this.stemDown ? 'down' : 'up');
    }

    private getStemStyle = () => {
        return {
            width: `${Note.Size}px`,
            height: `${Note.Size * 2.5}px`,
            top: this.stemDown ? `${Note.Size/2}px` : `${-Note.Size*2}px`,
            left: this.stemDown ? '1px' : '0' // hack for now
        };
    }

    private getFlagClass = () => {
        return 'stem-flag ' + (this.stemDown ? 'down' : 'up');;
    }

    private getFlagStyle = () => {
        return {
            width: `${Note.Size}px`,
            height: `${Note.Size*2}px`,
            top: this.stemDown ? `${Note.Size}px` : `${-Note.Size*2}px`,
            left: this.stemDown ? '2px' : `${Note.Size/2}px`
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

        const noteHeight = Staff.SpaceHeight / 2;

        const cIndex = cPosition - 1;
        const basePosition = cIndex * noteHeight;

        const pitchIndex = Pitches.indexOf(this.props.model.pitch);
        const pitchPosition = pitchIndex * noteHeight;

        const octaveDiff = this.props.model.octave - NoteModel.MiddleOctave;
        const octaveDiffPosition = octaveDiff * noteHeight * Pitches.length;
        
        return basePosition + pitchPosition + octaveDiffPosition;
    }

    componentWillMount() {
        if (!this.props.model.getDomain().includes(this.props.model.time)) {
            throw new Error(`${this.props.model.type} note cannot exist at slot ${this.props.model.time}`);
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
