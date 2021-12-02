import { TimeSignatureModel } from "./TimeSignatureModel";

export class StaffModel {
    public static readonly StaffSpaceHeight: number = 20;

    constructor(public readonly timeSignature: TimeSignatureModel) {
        
    }
}
