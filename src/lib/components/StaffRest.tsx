import { Component } from 'react';

import './StaffRest.scss';
import { RestModel } from '../models/Rest.model';

/**
 * 
 **/
interface RestProps {
    /**
     * 
     **/
    model: RestModel;

    /**
     * 
     **/
    left: number;
}

/**
 * 
 **/
function Rest({ model, left }: RestProps) {
    const RestSize: number = 50;
    const SpaceHeight: number = 20;

    const getClass = () => {
        return `rest rest-${model.durationType}`;
    }
    
    const getStyle = () => {
        return {
            width: `${RestSize}px`,
            height: `${RestSize}px`,
            backgroundSize: `${RestSize}px ${RestSize}px`,

            // Subtracting by half the note size centers it horizontally/vertically
            left: `${left - RestSize/2}px`,
            bottom: `${SpaceHeight*2 - RestSize/2 + 2}px` // 4 staff spaces total: center at half the height (x2 instead of x4)
        };
    }

    return (
        <div className={this.getClass()} style={this.getStyle()}></div>
    );
}

export default Rest;
