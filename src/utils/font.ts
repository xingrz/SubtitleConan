export interface Font {
  family: string;
  size: number;
  weight: FontWeight;
}

export enum FontWeight {
  THIN = 100,
  EXTRA_LIGHT = 200,
  LIGHT = 300,
  REGULAR = 400,
  MEDIUM = 500,
  SEMI_BOLD = 600,
  BOLD = 700,
  EXTRA_BOLD = 800,
  BLACK = 900,
}

export function toFontStyle(font: Font): string {
  return `${font.weight} ${font.size}px "${font.family}"`;
}
