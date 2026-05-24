import { exportScoreDocumentToMusicXml, importScoreDocumentFromMusicXml } from '../src/lib/core/MusicXmlAdapter'
import { Clef } from '../src/lib/core/models/Clef'
import { NaturalNote } from '../src/lib/core/models/NaturalNote'
import { NotationType } from '../src/lib/core/models/NotationType'
import { Note } from '../src/lib/core/models/Note'
import { Pitch } from '../src/lib/core/models/Pitch'
import { Rest } from '../src/lib/core/models/Rest'

describe('MusicXmlAdapter', () => {
    it('exports score document to MusicXML with expected core tags', () => {
        const xml = exportScoreDocumentToMusicXml({
            beatsPerMeasure: 4,
            beatDuration: NotationType.Quarter,
            clef: Clef.TrebleClef,
            sharps: [NaturalNote.F, NaturalNote.C],
            notations: [
                new Note(NotationType.Eighth, Pitch.C4, 0, 1, true),
                new Note(NotationType.Eighth, Pitch.C4, 3 / 16),
                new Rest(NotationType.Quarter, 1 / 4)
            ]
        })

        expect(xml.includes('<score-partwise')).toBe(true)
        expect(xml.includes('<fifths>2</fifths>')).toBe(true)
        expect(xml.includes('<beats>4</beats>')).toBe(true)
        expect(xml.includes('<beat-type>4</beat-type>')).toBe(true)
        expect(xml.includes('tie type="start"')).toBe(true)
        expect(xml.includes('<rest/>')).toBe(true)
    })

    it('imports score document from MusicXML', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1"><part-name>Music</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>32</divisions>
        <key><fifths>1</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>24</duration>
        <voice>1</voice>
        <type>eighth</type>
        <dot/>
        <tie type="start"/>
      </note>
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>16</duration>
        <voice>1</voice>
        <type>eighth</type>
      </note>
      <note>
        <rest/>
        <duration>32</duration>
        <voice>1</voice>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`

        const score = importScoreDocumentFromMusicXml(xml)

        expect(score.beatsPerMeasure).toBe(4)
        expect(score.beatDuration).toBe(NotationType.Quarter)
        expect(score.clef).toBe(Clef.TrebleClef)
        expect(score.sharps?.length).toBe(1)
        expect(score.notations).toHaveLength(3)

        const first = score.notations[0] as Note
        const third = score.notations[2] as Rest

        expect(first).toBeInstanceOf(Note)
        expect(first.pitch).toBe(Pitch.C4)
        expect(first.dotCount).toBe(1)
        expect(first.tieToNext).toBe(true)
        expect(third).toBeInstanceOf(Rest)
        expect(third.type).toBe(NotationType.Quarter)
    })
})
