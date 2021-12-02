import React from 'react';
import { NoteModel } from '../models';
import { ClefType } from '../types';

import './Staff.scss';
import ThirtySecondNote from './notes/ThirtySecondNote';
import SixteenthNote from './notes/SixteenthNote';
import EighthNote from './notes/EighthNote';
import QuarterNote from './notes/QuarterNote';
import HalfNote from './notes/HalfNote';
import WholeNote from './notes/WholeNote';

interface Props {
    clef: ClefType;
}

interface State {
    notes: NoteModel[];
}

export class Staff extends React.Component<Props, State> {
    private getComponentFromNote = (note: NoteModel) => {
        switch (note.type) {
            case '32nd':
                return <ThirtySecondNote model={note} clef={this.props.clef} />
            case '16th':
                return <SixteenthNote model={note} clef={this.props.clef} />
            case '8th':
                return <EighthNote model={note} clef={this.props.clef} />
            case 'quarter':
                return <QuarterNote model={note} clef={this.props.clef} />
            case 'half':
                return <HalfNote model={note} clef={this.props.clef} />
            case 'whole':
                return <WholeNote model={note} clef={this.props.clef} />
        }
    }

    private getStaffStyle = () => {
        return {

        };
    }

    private getStaffSpaceStyle = () => {
        return {

        };
    }

    componentDidMount() {
        const notes = new Array<NoteModel>();
        notes.push(new NoteModel('half', 'E', 3, 1.0));
        notes.push(new NoteModel('8th', 'F', 3, 3.0));
        notes.push(new NoteModel('16th', 'F', 3, 3.5));
        notes.push(new NoteModel('32nd', 'G', 3, 4.0));
        notes.push(new NoteModel('8th', 'D', 4, 4.5));
        this.setState({ notes });
    }

    render() {
        return (
            <div className="staff" style={this.getStaffStyle()}>
                {this.state?.notes.map(note => this.getComponentFromNote(note))}
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
            </div>
        );
    }
}

export default Staff;
