import React from 'react';
import { NoteModel, RestModel } from '../models';
import { ClefType } from '../types';
import Note from './Note';
import Rest from './Rest';

import './Staff.scss';

interface Props {
    clef: ClefType;
}

interface State {
    notes: Array<NoteModel | RestModel>;
}

export class Staff extends React.Component<Props, State> {
    public static readonly SpaceHeight: number = 22;

    private getStaffStyle = () => {
        return {

        };
    }

    private getStaffSpaceStyle = () => {
        return {

        };
    }

    private getRenderedItems = () => {
        return this.state?.notes.map(model => {
            const anyModel = model as any;
            if (anyModel.pitch)
                return (<Note model={anyModel} clef={this.props.clef} />);
            else
                return (<Rest model={anyModel} />);
        });
    }

    componentDidMount() {
        const notes = new Array<NoteModel | RestModel>();
        notes.push(new RestModel('half', 1.0));
        notes.push(new RestModel('8th', 3.0));
        notes.push(new RestModel('16th', 3.5));
        notes.push(new NoteModel('32nd', 'G', 3, 4.0));
        notes.push(new NoteModel('8th', 'G', 3, 4.5));
        this.setState({ notes });
    }

    render() {
        return (
            <div className="staff" style={this.getStaffStyle()}>
                {this.getRenderedItems()}
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
                <div className="staff-space" style={this.getStaffSpaceStyle()}></div>
            </div>
        );
    }
}

export default Staff;
