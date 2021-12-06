import React from 'react';

import './Note.scss';
import { ClefType, Octaves, Pitches } from '../types';
import { NoteModel } from '../models';

interface Props {
    model: NoteModel;
    clef: ClefType;
    left: number;
    bottom: number;
}

interface State {
    active: boolean;
}

export class Note extends React.Component<Props, State> {
    public static readonly Size: number = 30;

    protected get stemDown(): boolean {
        return this.props.model.getOctavePosition() >= (Pitches.length * Octaves.length / 2) - 1;
    }

    private getNoteClass = () => {
        let cls = `note note-${this.props.model.type}`;
        if (this.state?.active)
            cls += ' active';
        return cls;
    }
    
    private getNoteStyle = () => {
        return {
            width: `${Note.Size}px`,
            height: `${Note.Size}px`,
            backgroundSize: `${Note.Size}px ${Note.Size}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            left: `${this.props.left - Note.Size/2}px`,
            bottom: `${this.props.bottom - Note.Size/2}px`, 
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

    componentWillMount() {
        if (!this.props.model.getDomain().includes(this.props.model.time)) {
            throw new Error(`${this.props.model.type} note cannot exist at slot ${this.props.model.time}`);
        }
    }

    render() {
        return (
            <div data-note={this.props.model} className={this.getNoteClass()} style={this.getNoteStyle()}>
                {this.props.model.type !== 'whole' && <div className={this.getStemClass()} style={this.getStemStyle()}></div>}
                {/* {['8th', '16th', '32nd'].includes(this.props.model.type) && <div className={this.getFlagClass()} style={this.getFlagStyle()}></div>} */}
            </div>
        );
    }
}

export default Note;
