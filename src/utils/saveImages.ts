import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default async function saveImages(images: string[], length: number, name: string): Promise<void> {
  const zip = new JSZip();
  const suffix = 'data:image/png;base64,';
  for (let i = 0; i < length; i++) {
    if (images[i] && images[i].startsWith(suffix)) {
      zip.file(`${i}.png`, images[i].substring(suffix.length), { base64: true });
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, name);
}
