import React from 'react';

import './Note.scss';
import { NoteType } from '../../types';
import { NoteModel } from '../../models';

interface Props {
    model: NoteModel;
    down?: true;
    left: number;
    bottom: number;
}

export abstract class Note extends React.Component<Props> {
    protected readonly abstract Type: NoteType;
    protected readonly abstract Domain: number[];

    private getClass = () => {
        let cls = 'note ' + (this.Type == 'whole' ? 'whole' : 'standard');
        if (this.props.down)
            cls += ' down';
        return cls;
    }
    
    private getStyle = () => {
        const noteSize = 30;

        return {
            width: `${noteSize}px`,
            height: `${noteSize}px`,
            left: `${this.props.left}px`,
            bottom: `${this.props.bottom - noteSize/2}px`,
            backgroundSize: `${noteSize}px ${noteSize}px`
        };
    }

    componentWillMount() {
        if (!this.Domain.includes(this.props.model.time)) {
            throw new Error(`${this.Type} note cannot exist at slot ${this.props.model.time}`);
        }
    }

    render() {
        return (
            <div data-note={this.props.model} className={this.getClass()} style={this.getStyle()}>
            </div>
        );
    }
}

export default Note;
