export class PitchOscillator {
    private context: AudioContext;
    private node: OscillatorNode;
    private gainNode: GainNode;
    private activePitch: number;

    init(context: AudioContext) {
        this.context = context;
        this.node = this.context.createOscillator();
        this.gainNode = context.createGain();
        return this;
    }

    generateFrequencyFromPitch(pitch: number) {
        const frequency = this.convertPitchToFrequency(pitch);
        this.gainNode.connect(this.context.destination);
        this.node.connect(this.gainNode);
        this.node.frequency.setTargetAtTime(frequency, this.context.currentTime, 0);
        //this.node.connect(this.context.destination);
        this.node.start(0);
        this.activePitch = pitch;
        return this;
    }

    stop() {
        this.node.stop();
    }

    getActivePitch() {
        return this.activePitch;
    }

    setVolume(value) {
        this.gainNode.gain.setValueAtTime(value, this.context.currentTime);
    }

    private convertPitchToFrequency(pitch: number) {
        // See here for more info on pitch-to-frequency formula: https://newt.phys.unsw.edu.au/jw/notes.html
        return Math.pow(2, (pitch-69) / 12) * 440;
    }
}