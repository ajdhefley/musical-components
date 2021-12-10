import React from 'react';

import './Rest.scss';
import Staff from './StaffMeasure';
import { RestDto } from '../dtos/Rest.dto';

interface Props {
    model: RestDto;
    left: number;
}

export class Rest extends React.Component<Props> {
    public static readonly Size: number = 50;

    private getClass = () => {
        return `rest rest-${this.props.model.type}`;
    }
    
    private getStyle = () => {
        return {
            width: `${Rest.Size}px`,
            height: `${Rest.Size}px`,
            backgroundSize: `${Rest.Size}px ${Rest.Size}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            left: `${this.props.left - Rest.Size/2}px`,
            bottom: `${Staff.SpaceHeight*2 - Rest.Size/2 + 2}px` // 4 staff spaces total: center at half the height (x2 instead of x4)
        };
    }

    componentWillMount() {
        // TODO
        // if (!this.props.model.getDomain().includes(this.props.model.time)) {
        //     throw new Error(`${this.props.model.type} note cannot exist at slot ${this.props.model.time}`);
        // }
    }

    render() {
        return (
            <div className={this.getClass()} style={this.getStyle()}></div>
        );
    }
}

export default Rest;
