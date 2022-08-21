import { Duration } from '../types';

export abstract class NotationModel {
    durationType: Duration;
    startBeat: number;
    active: boolean;
}
