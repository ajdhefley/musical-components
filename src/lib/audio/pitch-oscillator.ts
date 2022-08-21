export class PitchOscillator {
    private context: AudioContext;
    private node: OscillatorNode;

    init() {
        this.context = new AudioContext();
        this.context.resume();
    }

    generateFrequencyFromPitch(pitch: number) {
        const frequency = this.convertPitchToFrequency(pitch);
        this.node = this.context.createOscillator();
        this.node.frequency.setTargetAtTime(frequency, this.context.currentTime, 0);
        this.node.connect(this.context.destination);
        this.node.start(0);
    }

    stop() {
        this.node.stop();
    }

    private convertPitchToFrequency(pitch: number) {
        // See here for more info on pitch-to-frequency formula: https://newt.phys.unsw.edu.au/jw/notes.html
        return Math.pow(2, (pitch-69) / 12) * 440;
    }
}