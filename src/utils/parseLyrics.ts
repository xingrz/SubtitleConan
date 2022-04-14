export interface Slice {
  kanjis: string[];
  hinagaras?: string[];
}

export type Sentence = Slice[];
export type Lyric = Sentence[];

export default function parseLyrics(text: string): Lyric {
  const lines = text.split('\n');
  return lines.map((line) => {
    const chars = line.match(/(\[[^\]]+\]|\S|\s)/g);
    if (!chars) return [];
    return chars.map((c) => {
      let m;
      if (m = c.match(/^\[([^\|]+)\|([^\|]+)\]$/)) {
        return { kanjis: m[1].split(''), hinagaras: m[2].split('') };
      } else {
        return { kanjis: c.split('') };
      }
    });
  });
}
