export interface Stroke {
  color?: string;
  width?: number;
}

export function applyStroke(ctx: CanvasRenderingContext2D, stroke?: Stroke) {
  if (stroke) {
    ctx.strokeStyle = stroke.color || 'transparent';
    ctx.lineWidth = stroke.width || 0;
  }
}
