export default function generateCanvas(size: number, color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size * 2;

  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);

  return canvas.toDataURL();
}
