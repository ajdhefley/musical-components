import { PitchOscillator } from '../../../core/audio/pitch-oscillator'
import { AudioContext as StandardizedAudioContext } from 'standardized-audio-context-mock'

describe('PitchOscillator', () => {
    it('should convert common pitches to frequencies', () => {
        // Arrange
        // Frequencies, starting on Middle C: C4 - B4
        const expectedValues = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88]
        const oscillator = new PitchOscillator() as any;

        // Act
        // Assert
        // Pitches, starting on Middle C: C4 - B4
        [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70].forEach((pitch, index) => {
            const value = oscillator.convertPitchToFrequency(pitch)
            expect(value).toBe(expectedValues[index])
        })
    })
})
