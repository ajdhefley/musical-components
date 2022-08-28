import { PitchOscillator } from './pitch-oscillator'

/**
 * Binds to MIDI input port, listens for MIDI messages, and generates
 * frequences based on the pitches encoded in the MIDI messages.
 *
 * Once listening:
 *
 * Generates frequency from pitch when ON command is received in message.
 * Stops frequency matching pitch when OFF command is received in message.
 **/
export class MidiAudio {
    private static readonly COMMAND_NOTE_ON = 0x90
    private static readonly COMMAND_NOTE_OFF = 0x80

    private context: AudioContext
    private midiInput: WebMidi.MIDIInput
    private pitchOscillators: PitchOscillator[]

    /**
     * Prepares relay for converting MIDI messages into audio.
     *
     * @param midiInputs Inputs provided by Web MIDI API access.
     */
    async listen (midiInputs: WebMidi.MIDIInputMap) {
        this.pitchOscillators = new Array<PitchOscillator>()
        this.context = new AudioContext()
        this.context.resume()
        this.midiInput = midiInputs.values().next().value
        this.midiInput.open()
        this.midiInput.onmidimessage = (e) => this.onMessage(e)
    }

    /**
     *
     * @param e
     **/
    private onMessage (e: WebMidi.MIDIMessageEvent) {
        switch (e.data[0]) {
            case MidiAudio.COMMAND_NOTE_ON:
                this.handleMessageNoteOn(e)
                this.normalizeOscillatorVolume()
                break
            case MidiAudio.COMMAND_NOTE_OFF:
                this.handleMessageNoteOff(e)
                this.normalizeOscillatorVolume()
                break
        }
    }

    /**
     *
     * @param e
     **/
    private handleMessageNoteOn (e: WebMidi.MIDIMessageEvent) {
        this.pitchOscillators.push(
            new PitchOscillator()
                .init(this.context)
                .generateFrequencyFromPitch(e.data[1])
        )
    }

    /**
     *
     * @param e
     **/
    private handleMessageNoteOff (e: WebMidi.MIDIMessageEvent) {
        const oscillator = this.pitchOscillators.find(o => o.getActivePitch() === e.data[1])
        oscillator.stop()
        this.pitchOscillators.splice(this.pitchOscillators.indexOf(oscillator), 1)
    }

    /**
     *
     **/
    private normalizeOscillatorVolume () {
        this.pitchOscillators.forEach(o => {
            o.setVolume(1 / this.pitchOscillators.length)
        })
    }
}
