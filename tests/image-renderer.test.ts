import html2canvas from 'html2canvas';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  renderToImage,
  replaceOklchTokens,
  sanitizeClonedDocument,
} from '@/lib/export/image-renderer';

vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

const html2canvasMock = vi.mocked(html2canvas);

describe('image renderer color sanitization', () => {
  beforeEach(() => {
    html2canvasMock.mockReset();
    html2canvasMock.mockResolvedValue({
      toBlob: (callback: BlobCallback) => callback(new Blob(['test'], { type: 'image/png' })),
    } as unknown as HTMLCanvasElement);
    document.body.innerHTML = '';
  });

  it('replaces every oklch token in a compound css value', () => {
    const value =
      '0 1px 2px oklch(0 0 0 / 0.1), inset 0 0 0 1px oklch(0.72 0.134 49.98)';

    const converted = replaceOklchTokens(value);

    expect(converted).not.toContain('oklch(');
    expect(converted).toContain('rgb(');
  });

  it('converts alpha oklch values to rgba', () => {
    const converted = replaceOklchTokens('oklch(0.62 0.12 42 / 0.5)');

    expect(converted).toContain('rgba(');
    expect(converted).toContain('0.5');
    expect(converted).not.toContain('oklch(');
  });

  it('keeps non-oklch values unchanged', () => {
    const value = '1px solid #1DA1F2';

    const converted = replaceOklchTokens(value);

    expect(converted).toBe(value);
  });

  it('sanitizes cloned document style blocks, inline styles and svg attrs', () => {
    const clonedDocument = document.implementation.createHTMLDocument('clone');
    const style = clonedDocument.createElement('style');
    style.textContent = `
      :root { --background: oklch(0.18 0.004 308.19); }
      .card { color: oklch(0.81 0 0); border-top: 1px solid oklch(0.25 0 0); }
    `;
    clonedDocument.head.appendChild(style);

    const inlineElement = clonedDocument.createElement('div');
    inlineElement.setAttribute(
      'style',
      'background: oklch(0.18 0.004 308.19); box-shadow: 0 1px 2px oklch(0 0 0 / 0.1);'
    );
    clonedDocument.body.appendChild(inlineElement);

    const svg = clonedDocument.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = clonedDocument.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'oklch(0.72 0.134 49.98)');
    svg.appendChild(path);
    clonedDocument.body.appendChild(svg);

    sanitizeClonedDocument(clonedDocument);

    expect(style.textContent ?? '').not.toContain('oklch(');
    expect(style.textContent ?? '').toContain('rgb(');
    expect(inlineElement.getAttribute('style') ?? '').not.toContain('oklch(');
    expect(inlineElement.getAttribute('style') ?? '').toContain('rgb(');
    expect(path.getAttribute('fill') ?? '').not.toContain('oklch(');
    expect(path.getAttribute('fill') ?? '').toContain('rgb(');
  });

  it('wires sanitizer into html2canvas onclone hook', async () => {
    const element = document.createElement('div');
    element.textContent = 'Preview card';
    element.style.width = '400px';
    element.style.height = '200px';
    document.body.appendChild(element);

    await renderToImage(element, 'png');

    expect(html2canvasMock).toHaveBeenCalledTimes(1);
    const options = html2canvasMock.mock.calls[0]?.[1];
    expect(options).toBeDefined();
    expect(typeof options?.onclone).toBe('function');

    const clonedDocument = document.implementation.createHTMLDocument('cloned');
    const style = clonedDocument.createElement('style');
    style.textContent = '.root { color: oklch(0.81 0 0); }';
    clonedDocument.head.appendChild(style);
    options?.onclone?.(clonedDocument, clonedDocument.body as unknown as HTMLElement);
    expect(style.textContent ?? '').not.toContain('oklch(');
  });
});
