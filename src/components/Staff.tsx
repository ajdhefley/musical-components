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
        const leftPosition = note.getPositionLeft();
        const bottomPosition = note.getPositionBottom(this.props.clef);

        switch (note.type) {
            case '32nd':
                return <ThirtySecondNote model={note} left={leftPosition} bottom={bottomPosition} />
            case '16th':
                return <SixteenthNote model={note} left={leftPosition} bottom={bottomPosition} />
            case '8th':
                return <EighthNote model={note} left={leftPosition} bottom={bottomPosition} />
            case 'quarter':
                return <QuarterNote model={note} left={leftPosition} bottom={bottomPosition} />
            case 'half':
                return <HalfNote model={note} left={leftPosition} bottom={bottomPosition} />
            case 'whole':
                return <WholeNote model={note} left={leftPosition} bottom={bottomPosition} />
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
        notes.push(new NoteModel('8th', 'E', 3, 1.0));
        notes.push(new NoteModel('8th', 'F', 3, 1.5));
        notes.push(new NoteModel('8th', 'G', 3, 2.0));
        notes.push(new NoteModel('8th', 'A', 3, 2.5));
        notes.push(new NoteModel('8th', 'B', 3, 3.0));
        notes.push(new NoteModel('8th', 'C', 4, 3.5));
        notes.push(new NoteModel('8th', 'D', 4, 4.0));
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
