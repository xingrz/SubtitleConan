export interface Character {
  kanji: string;
  hinagara?: string;
}

export type Sentence = Character[];
export type Lyric = Sentence[];

export default function parseLyrics(text: string): Lyric {
  const lines = text.split('\n');
  return lines.map((line) => {
    const chars = line.match(/(\[[^\]]+\]|\S|\s)/g);
    if (!chars) return [];
    return chars.map((c) => {
      let m;
      if (m = c.match(/^\[([^\|]+)\|([^\|]+)\]$/)) {
        return { kanji: m[1], hinagara: m[2] };
      } else {
        return { kanji: c };
      }
    });
  });
}
