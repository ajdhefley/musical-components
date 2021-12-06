import { DurationType } from '../types';

export class TimeSignatureModel {
    constructor(public readonly beatsPerMeasure: number, public readonly beatDuration: DurationType) {

    }
}