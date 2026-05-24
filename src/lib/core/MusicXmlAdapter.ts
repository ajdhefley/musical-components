import { Clef, NaturalNote, Notation, NotationType, Note, Pitch, Rest } from '@lib/core/models'
import { ScoreDocument } from '@lib/core/ScoreDocument'
import { MusicLogic } from '@lib/core/MusicLogic'

const DIVISIONS_PER_QUARTER = 32

const SHARP_ORDER: NaturalNote[] = [NaturalNote.F, NaturalNote.C, NaturalNote.G, NaturalNote.D, NaturalNote.A, NaturalNote.E, NaturalNote.B]
const FLAT_ORDER: NaturalNote[] = [NaturalNote.B, NaturalNote.E, NaturalNote.A, NaturalNote.D, NaturalNote.G, NaturalNote.C, NaturalNote.F]

export function exportScoreDocumentToMusicXml (score: ScoreDocument): string {
    const measureDuration = score.beatsPerMeasure * score.beatDuration.beatValue
    const sortedNotations = [...score.notations].sort((a, b) => a.startBeat - b.startBeat)
    const totalDuration = sortedNotations.reduce((max, notation) => Math.max(max, notation.startBeat + notation.totalBeatValue), 0)
    const measureCount = Math.max(1, Math.ceil(totalDuration / measureDuration))

    const measureXml: string[] = []

    for (let measureIndex = 0; measureIndex < measureCount; measureIndex++) {
        const measureStart = measureIndex * measureDuration
        const measureEnd = measureStart + measureDuration
        const measureNotations = sortedNotations.filter((notation) => notation.startBeat >= measureStart && notation.startBeat < measureEnd)

        let currentBeat = measureStart
        const measureElements: string[] = []

        if (measureIndex === 0) {
            measureElements.push(getAttributesXml(score))
        }

        for (const notation of measureNotations) {
            if (notation.startBeat > currentBeat) {
                const restDuration = notation.startBeat - currentBeat
                measureElements.push(...createRestNodes(restDuration))
                currentBeat = notation.startBeat
            }

            if (notation instanceof Note) {
                const previousNote = getPreviousNote(sortedNotations, notation)
                const tieStop = previousNote?.tieToNext === true && previousNote.pitch === notation.pitch
                measureElements.push(createNoteNode(notation, tieStop))
            } else if (notation instanceof Rest) {
                measureElements.push(createRestNode(notation.totalBeatValue, notation.dotCount))
            } else {
                throw new Error('Unsupported notation class in score')
            }

            currentBeat += notation.totalBeatValue
        }

        if (currentBeat < measureEnd) {
            measureElements.push(...createRestNodes(measureEnd - currentBeat))
        }

        measureXml.push(`<measure number="${measureIndex + 1}">${measureElements.join('')}</measure>`)
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1"><part-name>Music</part-name></score-part>
  </part-list>
  <part id="P1">${measureXml.join('')}</part>
</score-partwise>`
}

export function importScoreDocumentFromMusicXml (xml: string): ScoreDocument {
    const beats = parseInt(readFirstTagValue(xml, 'beats') ?? '4')
    const beatType = parseInt(readFirstTagValue(xml, 'beat-type') ?? '4')
    const beatDuration = notationTypeFromBeatType(beatType)
    const clefSign = readFirstTagValue(xml, 'sign') ?? 'G'
    const fifthsValue = parseInt(readFirstTagValue(xml, 'fifths') ?? '0')

    const score: ScoreDocument = {
        beatsPerMeasure: beats,
        beatDuration,
        clef: clefSign === 'F' ? Clef.BassClef : Clef.TrebleClef,
        sharps: fifthsValue > 0 ? SHARP_ORDER.slice(0, fifthsValue) : undefined,
        flats: fifthsValue < 0 ? FLAT_ORDER.slice(0, Math.abs(fifthsValue)) : undefined,
        notations: []
    }

    const measureBlocks = readTagBlocks(xml, 'measure')
    const measureDuration = beats * beatDuration.beatValue

    for (let measureIndex = 0; measureIndex < measureBlocks.length; measureIndex++) {
        const measureStartBeat = measureIndex * measureDuration
        const noteBlocks = readTagBlocks(measureBlocks[measureIndex], 'note')

        let cursor = 0

        for (const noteBlock of noteBlocks) {
            const duration = parseInt(readFirstTagValue(noteBlock, 'duration') ?? '0')
            const beatValue = durationToBeatValue(duration)
            const startBeat = measureStartBeat + cursor
            const dotCount = countTagInstances(noteBlock, 'dot')

            if (noteBlock.includes('<rest')) {
                const notationType = notationTypeFromDurationAndDots(beatValue, dotCount)
                score.notations.push(new Rest(notationType, startBeat, dotCount))
            } else {
                const step = readFirstTagValue(noteBlock, 'step')
                const octave = parseInt(readFirstTagValue(noteBlock, 'octave') ?? '-1')
                const alter = parseInt(readFirstTagValue(noteBlock, 'alter') ?? '0')
                const tieToNext = noteBlock.includes('tie type="start"')

                if (!step || octave < 0) {
                    throw new Error('Invalid note pitch in MusicXML')
                }

                const pitch = pitchFromComponents(step, alter, octave)
                const notationType = notationTypeFromDurationAndDots(beatValue, dotCount)
                score.notations.push(new Note(notationType, pitch, startBeat, dotCount, tieToNext))
            }

            cursor += beatValue
        }
    }

    return score
}

function getAttributesXml (score: ScoreDocument) {
    const fifths = fifthsFromKeySignature(score.sharps, score.flats)
    const clefSign = score.clef === Clef.BassClef ? 'F' : 'G'
    const clefLine = score.clef === Clef.BassClef ? 4 : 2
    const beatType = beatTypeFromNotationType(score.beatDuration)

    return `<attributes>
        <divisions>${DIVISIONS_PER_QUARTER}</divisions>
        <key><fifths>${fifths}</fifths></key>
        <time><beats>${score.beatsPerMeasure}</beats><beat-type>${beatType}</beat-type></time>
        <clef><sign>${clefSign}</sign><line>${clefLine}</line></clef>
    </attributes>`
}

function createNoteNode (note: Note, tieStop: boolean): string {
    const pitchData = pitchToComponents(note.pitch)
    const typeName = musicXmlTypeFromNotationType(note.type)
    const duration = beatValueToDuration(note.totalBeatValue)
    const dots = Array.from({ length: note.dotCount }, () => '<dot/>').join('')
    const tieStartNode = note.tieToNext ? '<tie type="start"/><notations><tied type="start"/></notations>' : ''
    const tieStopNode = tieStop ? '<tie type="stop"/><notations><tied type="stop"/></notations>' : ''
    const alterNode = pitchData.alter !== 0 ? `<alter>${pitchData.alter}</alter>` : ''

    return `<note>
        <pitch><step>${pitchData.step}</step>${alterNode}<octave>${pitchData.octave}</octave></pitch>
        <duration>${duration}</duration>
        <voice>1</voice>
        <type>${typeName}</type>
        ${dots}
        ${tieStopNode}
        ${tieStartNode}
    </note>`
}

function createRestNode (totalBeatValue: number, dotCount: number): string {
    const type = notationTypeFromDurationAndDots(totalBeatValue, dotCount)
    const typeName = musicXmlTypeFromNotationType(type)
    const duration = beatValueToDuration(totalBeatValue)
    const dots = Array.from({ length: dotCount }, () => '<dot/>').join('')

    return `<note>
        <rest/>
        <duration>${duration}</duration>
        <voice>1</voice>
        <type>${typeName}</type>
        ${dots}
    </note>`
}

function createRestNodes (totalBeatValue: number): string[] {
    return MusicLogic.decomposeIntoRests(totalBeatValue).map((rest) => createRestNode(rest.totalBeatValue, rest.dotCount))
}

function beatTypeFromNotationType (notationType: NotationType): number {
    if (notationType === NotationType.Whole) return 1
    if (notationType === NotationType.Half) return 2
    if (notationType === NotationType.Quarter) return 4
    if (notationType === NotationType.Eighth) return 8
    if (notationType === NotationType.Sixteenth) return 16
    if (notationType === NotationType.ThirtySecond) return 32
    throw new Error(`Unsupported beat duration for MusicXML export: ${notationType.name}`)
}

function notationTypeFromBeatType (beatType: number): NotationType {
    if (beatType === 1) return NotationType.Whole
    if (beatType === 2) return NotationType.Half
    if (beatType === 4) return NotationType.Quarter
    if (beatType === 8) return NotationType.Eighth
    if (beatType === 16) return NotationType.Sixteenth
    if (beatType === 32) return NotationType.ThirtySecond
    throw new Error(`Unsupported beat-type in MusicXML: ${beatType}`)
}

function musicXmlTypeFromNotationType (notationType: NotationType): string {
    if (notationType === NotationType.Whole) return 'whole'
    if (notationType === NotationType.Half) return 'half'
    if (notationType === NotationType.Quarter) return 'quarter'
    if (notationType === NotationType.Eighth) return 'eighth'
    if (notationType === NotationType.Sixteenth) return '16th'
    if (notationType === NotationType.ThirtySecond) return '32nd'
    throw new Error(`Unsupported notation type for MusicXML: ${notationType.name}`)
}

function durationToBeatValue (duration: number): number {
    return duration / (DIVISIONS_PER_QUARTER * 4)
}

function beatValueToDuration (beatValue: number): number {
    return Math.round(beatValue * DIVISIONS_PER_QUARTER * 4)
}

function notationTypeFromDurationAndDots (totalBeatValue: number, dotCount: number): NotationType {
    let value = totalBeatValue
    let factor = 1

    for (let i = 0; i < dotCount; i++) {
        factor += Math.pow(2, -(i + 1))
    }

    value = value / factor

    if (areEqual(value, NotationType.Whole.beatValue)) return NotationType.Whole
    if (areEqual(value, NotationType.Half.beatValue)) return NotationType.Half
    if (areEqual(value, NotationType.Quarter.beatValue)) return NotationType.Quarter
    if (areEqual(value, NotationType.Eighth.beatValue)) return NotationType.Eighth
    if (areEqual(value, NotationType.Sixteenth.beatValue)) return NotationType.Sixteenth
    if (areEqual(value, NotationType.ThirtySecond.beatValue)) return NotationType.ThirtySecond

    throw new Error(`Unsupported duration in MusicXML: ${totalBeatValue} with dotCount=${dotCount}`)
}

function pitchToComponents (pitch: Pitch): { step: string, alter: number, octave: number } {
    const semitone = pitch % 12
    const octave = Math.floor(pitch / 12) - 1

    const map: Record<number, { step: string, alter: number }> = {
        0: { step: 'C', alter: 0 },
        1: { step: 'C', alter: 1 },
        2: { step: 'D', alter: 0 },
        3: { step: 'D', alter: 1 },
        4: { step: 'E', alter: 0 },
        5: { step: 'F', alter: 0 },
        6: { step: 'F', alter: 1 },
        7: { step: 'G', alter: 0 },
        8: { step: 'G', alter: 1 },
        9: { step: 'A', alter: 0 },
        10: { step: 'A', alter: 1 },
        11: { step: 'B', alter: 0 }
    }

    return {
        step: map[semitone].step,
        alter: map[semitone].alter,
        octave
    }
}

function pitchFromComponents (step: string, alter: number, octave: number): Pitch {
    const base: Record<string, number> = {
        C: 0,
        D: 2,
        E: 4,
        F: 5,
        G: 7,
        A: 9,
        B: 11
    }

    const semitone = base[step] + alter
    return ((octave + 1) * 12 + semitone) as Pitch
}

function fifthsFromKeySignature (sharps?: NaturalNote[], flats?: NaturalNote[]): number {
    if (sharps?.length && flats?.length) {
        return 0
    }

    if (sharps?.length) {
        return isNaturalPrefix(sharps, SHARP_ORDER) ? sharps.length : 0
    }

    if (flats?.length) {
        return isNaturalPrefix(flats, FLAT_ORDER) ? -flats.length : 0
    }

    return 0
}

function isNaturalPrefix (notes: NaturalNote[], order: NaturalNote[]) {
    if (notes.length > order.length) {
        return false
    }

    for (let i = 0; i < notes.length; i++) {
        if (notes[i] !== order[i]) {
            return false
        }
    }

    return true
}

function getPreviousNote (notations: Notation[], current: Note): Note | undefined {
    const noteIndex = notations.indexOf(current)
    if (noteIndex <= 0) {
        return undefined
    }

    for (let i = noteIndex - 1; i >= 0; i--) {
        const previous = notations[i]
        if (previous instanceof Note) {
            return previous
        }
    }

    return undefined
}

function readFirstTagValue (xml: string, tagName: string): string | undefined {
    const matcher = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`)
    const match = xml.match(matcher)
    return match?.[1]?.trim()
}

function readTagBlocks (xml: string, tagName: string): string[] {
    const matcher = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'g')
    const results: string[] = []
    let match = matcher.exec(xml)

    while (match) {
        results.push(match[1])
        match = matcher.exec(xml)
    }

    return results
}

function countTagInstances (xml: string, tagName: string): number {
    const matcher = new RegExp(`<${tagName}(\\s*\\/|[\\s>])`, 'g')
    return xml.match(matcher)?.length ?? 0
}

function areEqual (left: number, right: number): boolean {
    return Math.abs(left - right) < 1e-9
}
