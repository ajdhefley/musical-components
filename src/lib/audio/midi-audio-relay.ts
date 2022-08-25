import { Pitch } from '../types';
import { PitchOscillator } from './pitch-oscillator';

export class MidiAudioRelay {
    private static readonly COMMAND_NOTE_ON = 0x90;
    private static readonly COMMAND_NOTE_OFF = 0x80;

    private context: AudioContext;
    private midiInput: WebMidi.MIDIInput;
    private pitchOscillators: PitchOscillator[];

    async init(midiAccess: WebMidi.MIDIAccess) {
        this.pitchOscillators = new Array<PitchOscillator>();
        this.context = new AudioContext();
        this.context.resume();
        this.midiInput = midiAccess.inputs.values().next().value;
        this.midiInput.open();
        this.midiInput.onmidimessage = (e) => this.onMessage(e);
    }

    private onMessage(e: WebMidi.MIDIMessageEvent) {
        switch (e.data[0]) {
            case MidiAudioRelay.COMMAND_NOTE_ON:
                this.pitchOscillators.push(
                    new PitchOscillator()
                        .init(this.context)
                        .generateFrequencyFromPitch(e.data[1])
                );
                this.normalizeOscillatorVolume();
                break;
            case MidiAudioRelay.COMMAND_NOTE_OFF:
                const oscillator = this.pitchOscillators.find(o => o.getActivePitch() == e.data[1]);
                oscillator.stop();
                this.pitchOscillators.splice(this.pitchOscillators.indexOf(oscillator), 1);
                this.normalizeOscillatorVolume();
                break;
        }
    }

    private normalizeOscillatorVolume() {
        this.pitchOscillators.forEach(o => {
            o.setVolume(1 / this.pitchOscillators.length);
        });
    }
}