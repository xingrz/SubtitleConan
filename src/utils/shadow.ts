export interface Shadow {
  color?: string;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
  type: ShadowType;
}

export type ShadowType = 'normal' | 'continious';

export function applyShadow(ctx: CanvasRenderingContext2D, shadow?: Shadow) {
  if (shadow) {
    ctx.shadowColor = shadow.color || 'transparent';
    ctx.shadowBlur = shadow.blur || 0;
    ctx.shadowOffsetX = shadow.offsetX || 0;
    ctx.shadowOffsetY = shadow.offsetY || 0;
  }
}
