/**
 * Opens MIDI output port and sends MIDI messages to it.
 **/
export class MidiRelay {
    private midi: WebMidi.MIDIAccess

    /**
     * Gains and returns access to MIDI ports.
     *
     * @returns A promise containing the WebMidi object if access successful.
     **/
    async openAccess () {
        return await new Promise<WebMidi.MIDIAccess>((resolve, reject) => {
            navigator.requestMIDIAccess().then((midi: WebMidi.MIDIAccess) => {
                this.midi = midi
                resolve(midi)
            }, (err: string) => {
                console.log(`Failed to get MIDI access - ${err}`)
                reject(err)
            })
        })
    }

    /**
     * Sends MIDI ON message followed by OFF message on output port, which can be subsequently picked up by a component listening to input.
     *
     * @param pitch MIDI pitch, valid from 22 to 106.
     * @param duration Time in miliseconds that should elapse before OFF message is sent to end the frequency generated by this message.
     **/
    sendMidi (pitch: number, duration: number) {
        if (pitch < 22 || pitch > 106) {
            throw Error('Pitch must be between 22 and 106')
        }

        this.midi.outputs.forEach((output) => {
            output.send([0x90, pitch, 0x7f])
            window.setTimeout(() => output.send([0x80, pitch, 0x7f]), duration)
        })
    }
}