import { NoteDurationType } from '../types';

export abstract class NotationModel {
    durationType: NoteDurationType;
    startBeat: number;
}
