import { Pitch } from '../types';
import { PitchOscillator } from './pitch-oscillator';

export class MidiAudioRelay {
    private static readonly COMMAND_NOTE_ON = 0x90;
    private static readonly COMMAND_NOTE_OFF = 0x80;

    private midiInput: WebMidi.MIDIInput;
    private pitchOscillator: PitchOscillator;

    async init(midiAccess: WebMidi.MIDIAccess) {
        this.pitchOscillator = new PitchOscillator();
        this.pitchOscillator.init();
        this.midiInput = midiAccess.inputs.values().next().value;
        this.midiInput.open();
        this.midiInput.onmidimessage = (e) => this.onMessage(e);
    }

    private onMessage(e: WebMidi.MIDIMessageEvent) {
        switch (e.data[0]) {
            case MidiAudioRelay.COMMAND_NOTE_ON:
                this.pitchOscillator.generateFrequencyFromPitch(e.data[1]);
                break;
            case MidiAudioRelay.COMMAND_NOTE_OFF:
                this.pitchOscillator.stop();
                break;
        }
    }
}