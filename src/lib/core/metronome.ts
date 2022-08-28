import audio_MetronomeStart from '../audio/metronome_click_start.mp3'
import audio_MetronomeBeat from '../audio/metronome_click_beat.mp3'

/**
 *
 **/
export class Metronome {
    private active: boolean

    private readonly audioMetronomeStart = new Audio(audio_MetronomeStart)
    private readonly audioMetronomeBeat = new Audio(audio_MetronomeBeat)

    constructor (
        private readonly beatsPerMeasure: number,
        private readonly beatsPerMinute: number
    ) {

    }

    /**
     *
     **/
    start () {
        this.active = true
        this.click(0)
    }

    /**
     *
     **/
    stop () {
        this.active = false
    }

    /**
     *
     * @param count
     **/
    private click (count: number) {
        if (count > this.beatsPerMeasure) {
            count = 0
        }

        if (count === 0) {
            this.audioMetronomeStart.load()
            this.audioMetronomeStart.play()
        } else {
            this.audioMetronomeBeat.load()
            this.audioMetronomeBeat.play()
        }

        if (this.active) {
            const baseBpm = 60
            const baseCountDuration = 1000
            const countDuration = (baseBpm / this.beatsPerMinute) * baseCountDuration
            window.setTimeout(() => this.click(count + 1), countDuration)
        }
    }
}
