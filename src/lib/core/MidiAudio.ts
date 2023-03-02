import { PitchOscillator } from '@lib/core/PitchOscillator'

/**
 * Binds to MIDI input port, listens for MIDI messages, and generates
 * audio frequencies based on the pitches encoded in the MIDI messages.
 *
 * Once listening:
 *
 * - Generates frequency from pitch when Note On command is received in MIDI message.
 * - Stops frequency matching pitch when Note Off command is received in MIDI message.
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
    listen (midiInputs: WebMidi.MIDIInputMap) {
        this.pitchOscillators = new Array<PitchOscillator>()
        this.context = new AudioContext()
        this.context.resume()
        this.midiInput = midiInputs.values().next().value
        this.midiInput.open()
        this.midiInput.onmidimessage = (e) => this.onMessage(e)
    }

    /**
     * Handles Note On and Note Off messages, maintaining
     * a list of pitch/frequency oscillators underneath.
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
     * Initializes new pitch oscillator from data encoded in MIDI message.
     *
     * @param e
     **/
    private handleMessageNoteOn (e: WebMidi.MIDIMessageEvent) {
        const oscillator = new PitchOscillator()
        oscillator.init(this.context)
        oscillator.generateFrequencyFromPitch(e.data[1])
        this.pitchOscillators.push(oscillator)
    }

    /**
     * Finds the oscillator actively generating pitch encoded
     * in this MIDI message. Stops and disposes the oscillator.
     *
     * @param e
     **/
    private handleMessageNoteOff (e: WebMidi.MIDIMessageEvent) {
        const oscillator = this.pitchOscillators.find(o => o.getActivePitch() === e.data[1])

        if (oscillator) {
            this.pitchOscillators.splice(this.pitchOscillators.indexOf(oscillator), 1)
            oscillator.stop()
        }
    }

    /**
     * Sets the volume of all currently active oscillators proportionally to the
     * total number of active oscillators, such that the total output volume will
     * remain consistent and all oscillators will output at equal volume.
     **/
    private normalizeOscillatorVolume () {
        this.pitchOscillators.forEach(o => {
            o.setVolume(1 / this.pitchOscillators.length)
        })
    }
}
