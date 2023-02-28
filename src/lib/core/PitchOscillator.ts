/**
 * Converts pitch to an audio frequency generated in the browser using the Web Audio API.
 **/
export class PitchOscillator {
    private context: AudioContext
    private node: OscillatorNode
    private gainNode: GainNode
    private activePitch: number

    /**
     * @param context Web Audio API entry used to create and control frequency oscillators.
     **/
    init (context: AudioContext) {
        this.context = context
        this.node = this.context.createOscillator()
        this.gainNode = context.createGain()
    }

    /**
     * Converts MIDI pitch to frequency using standard formula.
     * Plays frequency with Web Audio oscillator.
     *
     * @param pitch Valid musical pitch (error will be thrown if value if not between 22 and 106.)
     **/
    generateFrequencyFromPitch (pitch: number) {
        if (pitch < 22 || pitch > 106) {
            throw Error('Pitch must be between 22 and 106')
        }

        const frequency = this.convertPitchToFrequency(pitch)
        this.gainNode.connect(this.context.destination)
        this.node.connect(this.gainNode)
        this.node.frequency.setTargetAtTime(frequency, this.context.currentTime, 0)
        // this.node.connect(this.context.destination);
        this.node.start(0)
        this.activePitch = pitch
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
     * @param value Volume between 0 and 1.
     **/
    setVolume (value: number) {
        if (value < 0 || value > 1) {
            throw Error()
        }

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
