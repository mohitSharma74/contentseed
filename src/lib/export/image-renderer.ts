import html2canvas from 'html2canvas';

export type ExportFormat = 'png' | 'jpg' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number;
}

const OKLCH_FUNCTION_PATTERN = /oklch\([^)]*\)/gi;
const OKLCH_TOKEN_PATTERN = /^oklch\(\s*([^\s/]+)\s+([^\s/]+)\s+([^\s/)]+)(?:\s*\/\s*([^)]+))?\s*\)$/i;
const SVG_COLOR_ATTRIBUTES = ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'];

interface ParsedOklch {
  l: number;
  c: number;
  h: number;
  alpha: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parseNumber(value: string): number | null {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseLightness(value: string): number | null {
  const token = value.trim().toLowerCase();

  if (token.endsWith('%')) {
    const percentage = parseNumber(token.slice(0, -1));
    return percentage === null ? null : clamp(percentage / 100, 0, 1);
  }

  const numeric = parseNumber(token);
  if (numeric === null) {
    return null;
  }

  if (numeric > 1) {
    return clamp(numeric / 100, 0, 1);
  }

  return clamp(numeric, 0, 1);
}

function parseChroma(value: string): number | null {
  const token = value.trim().toLowerCase();

  if (token.endsWith('%')) {
    const percentage = parseNumber(token.slice(0, -1));
    return percentage === null ? null : Math.max(0, percentage / 100);
  }

  const numeric = parseNumber(token);
  return numeric === null ? null : Math.max(0, numeric);
}

function parseHue(value: string): number | null {
  const token = value.trim().toLowerCase();

  if (token.endsWith('deg')) {
    return parseNumber(token.slice(0, -3));
  }

  if (token.endsWith('grad')) {
    const grad = parseNumber(token.slice(0, -4));
    return grad === null ? null : grad * 0.9;
  }

  if (token.endsWith('rad')) {
    const rad = parseNumber(token.slice(0, -3));
    return rad === null ? null : (rad * 180) / Math.PI;
  }

  if (token.endsWith('turn')) {
    const turn = parseNumber(token.slice(0, -4));
    return turn === null ? null : turn * 360;
  }

  return parseNumber(token);
}

function parseAlpha(value: string): number | null {
  const token = value.trim().toLowerCase();

  if (token.endsWith('%')) {
    const percentage = parseNumber(token.slice(0, -1));
    return percentage === null ? null : clamp(percentage / 100, 0, 1);
  }

  const numeric = parseNumber(token);
  return numeric === null ? null : clamp(numeric, 0, 1);
}

function parseOklchToken(token: string): ParsedOklch | null {
  const match = token.match(OKLCH_TOKEN_PATTERN);
  if (!match) {
    return null;
  }

  const l = parseLightness(match[1]);
  const c = parseChroma(match[2]);
  const h = parseHue(match[3]);
  const alpha = match[4] ? parseAlpha(match[4]) : 1;

  if (l === null || c === null || h === null || alpha === null) {
    return null;
  }

  return { l, c, h, alpha };
}

function linearToSrgb(value: number): number {
  if (value <= 0.0031308) {
    return 12.92 * value;
  }

  return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

function formatAlpha(alpha: number): string {
  if (Number.isInteger(alpha)) {
    return String(alpha);
  }

  return alpha.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

function oklchToCssColor({ l, c, h, alpha }: ParsedOklch): string {
  const hueRadians = (h * Math.PI) / 180;
  const a = c * Math.cos(hueRadians);
  const b = c * Math.sin(hueRadians);

  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;

  const lLinear = lPrime ** 3;
  const mLinear = mPrime ** 3;
  const sLinear = sPrime ** 3;

  const rLinear = 4.0767416621 * lLinear - 3.3077115913 * mLinear + 0.2309699292 * sLinear;
  const gLinear = -1.2684380046 * lLinear + 2.6097574011 * mLinear - 0.3413193965 * sLinear;
  const bLinear = -0.0041960863 * lLinear - 0.7034186147 * mLinear + 1.707614701 * sLinear;

  const r = Math.round(clamp(linearToSrgb(rLinear), 0, 1) * 255);
  const g = Math.round(clamp(linearToSrgb(gLinear), 0, 1) * 255);
  const bChannel = Math.round(clamp(linearToSrgb(bLinear), 0, 1) * 255);

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${bChannel}, ${formatAlpha(alpha)})`;
  }

  return `rgb(${r}, ${g}, ${bChannel})`;
}

function convertOklchToken(token: string): string {
  const parsed = parseOklchToken(token);
  if (!parsed) {
    return token;
  }

  return oklchToCssColor(parsed);
}

export function replaceOklchTokens(value: string): string {
  if (!value || !value.includes('oklch(')) {
    return value;
  }

  return value.replace(OKLCH_FUNCTION_PATTERN, convertOklchToken);
}

function sanitizeStyleDeclaration(style: CSSStyleDeclaration): void {
  for (const property of Array.from(style)) {
    const value = style.getPropertyValue(property);
    if (!value || !value.includes('oklch(')) {
      continue;
    }

    const converted = replaceOklchTokens(value);
    if (converted !== value) {
      style.setProperty(property, converted, style.getPropertyPriority(property));
    }
  }
}

function sanitizeCssRules(rules: CSSRuleList): void {
  for (const rule of Array.from(rules)) {
    const ruleWithStyle = rule as CSSRule & { style?: CSSStyleDeclaration };
    if (ruleWithStyle.style) {
      sanitizeStyleDeclaration(ruleWithStyle.style);
    }

    const groupedRule = rule as CSSRule & { cssRules?: CSSRuleList };
    if (groupedRule.cssRules) {
      sanitizeCssRules(groupedRule.cssRules);
    }
  }
}

export function sanitizeClonedDocument(clonedDocument: Document): void {
  for (const styleElement of Array.from(clonedDocument.querySelectorAll('style'))) {
    const cssText = styleElement.textContent;
    if (!cssText || !cssText.includes('oklch(')) {
      continue;
    }

    styleElement.textContent = replaceOklchTokens(cssText);
  }

  for (const styleSheet of Array.from(clonedDocument.styleSheets)) {
    try {
      sanitizeCssRules(styleSheet.cssRules);
    } catch {
      // Ignore cross-origin or non-readable stylesheets.
    }
  }

  for (const element of Array.from(clonedDocument.querySelectorAll('[style]'))) {
    const styleAttr = element.getAttribute('style');
    if (!styleAttr || !styleAttr.includes('oklch(')) {
      continue;
    }

    element.setAttribute('style', replaceOklchTokens(styleAttr));
  }

  for (const attributeName of SVG_COLOR_ATTRIBUTES) {
    for (const element of Array.from(clonedDocument.querySelectorAll(`[${attributeName}]`))) {
      const value = element.getAttribute(attributeName);
      if (!value || !value.includes('oklch(')) {
        continue;
      }

      element.setAttribute(attributeName, replaceOklchTokens(value));
    }
  }
}

export async function renderToImage(
  element: HTMLElement,
  format: 'png' | 'jpg' = 'png',
  quality = 0.95
): Promise<Blob> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.appendChild(element.cloneNode(true));
  document.body.appendChild(container);

  const clone = container.firstElementChild as HTMLElement;
  clone.style.width = `${element.offsetWidth}px`;

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: '#2d2d2d',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      onclone: (clonedDocument) => {
        sanitizeClonedDocument(clonedDocument);
      },
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
  } finally {
    document.body.removeChild(container);
  }
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
  try {
    const blob = await renderToImage(element, format);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `contentseed-${platform}-${timestamp}.${format}`;
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Error exporting image:', error);
    throw error;
  }
}
