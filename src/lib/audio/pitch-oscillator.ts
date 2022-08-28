/**
 * Converts pitch to an audio frequency generated in the browser using the Web Audio API.
 **/
export class PitchOscillator {
    private context: AudioContext
    private node: OscillatorNode
    private gainNode: GainNode
    private activePitch: number

    /**
     *
     * @param context
     **/
    init (context: AudioContext) {
        this.context = context
        this.node = this.context.createOscillator()
        this.gainNode = context.createGain()
        return this
    }

    /**
     * Converts MIDI pitch to frequency using standard formula.
     * Plays frequency with Web Audio oscillator.
     *
     * @param pitch
     **/
    generateFrequencyFromPitch (pitch: number) {
        const frequency = this.convertPitchToFrequency(pitch)
        this.gainNode.connect(this.context.destination)
        this.node.connect(this.gainNode)
        this.node.frequency.setTargetAtTime(frequency, this.context.currentTime, 0)
        // this.node.connect(this.context.destination);
        this.node.start(0)
        this.activePitch = pitch
        return this
    }

    /**
     *
     **/
    stop () {
        this.node.stop()
    }

    /**
     *
     * @returns
     **/
    getActivePitch () {
        return this.activePitch
    }

    /**
     *
     * @param value
     **/
    setVolume (value) {
        this.gainNode.gain.setValueAtTime(value, this.context.currentTime)
    }

    /**
     * See here for more info on pitch-to-frequency formula:
     * https://newt.phys.unsw.edu.au/jw/notes.html
     *
     * @param pitch
     * @returns Numeric audio frequency from pitch.
     **/
    private convertPitchToFrequency (pitch: number) {
        const value = Math.pow(2, (pitch - 69) / 12) * 440
        return parseFloat(value.toFixed(2))
    }
}
