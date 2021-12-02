import React from 'react';

import './Rest.scss';
import { RestModel } from '../models';
import Staff from './Staff';

interface Props {
    model: RestModel;
}

export abstract class Rest extends React.Component<Props> {
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
            left: `${this.getAbsolutePositionLeft() - Rest.Size/2}px`,
            bottom: `${this.getAbsolutePositionBottom() - Rest.Size/2 + 2}px`, 
        };
    }

    public getAbsolutePositionLeft(): number {
        return this.props.model.time * 150;
    }

    public getAbsolutePositionBottom(): number {
        let position = Staff.SpaceHeight * 2; // 4 spaces total: center at half the height (x2 instead of x4)

        // if (this.props.model.type == 'half' || this.props.model.type == 'whole')
        //     position += 5;

        return position;
    }

    render() {
        return (
            <div className={this.getClass()} style={this.getStyle()}></div>
        );
    }
}

export default Rest;
