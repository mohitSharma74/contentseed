import html2canvas from 'html2canvas';
import { themeConfig } from './theme-config';

export type ExportFormat = 'png' | 'jpg' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number;
}

export async function renderToImage(
  element: HTMLElement,
  format: 'png' | 'jpg' = 'png',
  quality = 0.95
): Promise<Blob> {
  const canvas = await html2canvas(element, {
    backgroundColor: themeConfig.dark.background,
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const qualitySetting = format === 'jpg' ? quality : undefined;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      mimeType,
      qualitySetting
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportAsImage(
  element: HTMLElement,
  platform: string,
  format: 'png' | 'jpg' = 'png'
): Promise<void> {
  const blob = await renderToImage(element, format);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `contentseed-${platform}-${timestamp}.${format}`;
  downloadBlob(blob, filename);
}
