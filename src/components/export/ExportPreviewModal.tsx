import { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Download, Image, FileText } from 'lucide-react';
import { ExportCard } from './ExportCard';
import { exportAsImage } from '@/lib/export/image-renderer';
import { generatePDF } from '@/lib/export/pdf-renderer';
import type { PlatformOutput, Platform } from '@/types';
import { cn } from '@/lib/utils';

export type ExportFormat = 'png' | 'jpg' | 'pdf';

interface ExportPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outputs: Record<Platform, PlatformOutput | null>;
  title?: string;
  singlePlatform?: Platform;
}

export function ExportPreviewModal({
  open,
  onOpenChange,
  outputs,
  title,
  singlePlatform,
}: ExportPreviewModalProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [jpgQuality, setJpgQuality] = useState(0.9);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setFormat(singlePlatform ? 'png' : 'pdf');
    }
  }, [open, singlePlatform]);

  const handleExport = async () => {
    if (!exportRef.current) return;

    setIsExporting(true);

    try {
      if (format === 'pdf') {
        await generatePDF(outputs, title || 'ContentSeed Export');
      } else {
        if (singlePlatform && outputs[singlePlatform]) {
          await exportAsImage(
            exportRef.current,
            singlePlatform,
            format as 'png' | 'jpg'
          );
        } else {
          await exportAsImage(exportRef.current, 'content', format as 'png' | 'jpg');
        }
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const platforms: Platform[] = ['twitter', 'linkedin', 'reddit', 'substack'];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden z-50 bg-[var(--background)] border border-[var(--border)] rounded-xl">
          <div className="flex flex-col h-full max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <Dialog.Title className="text-lg font-semibold">
                Export Preview
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-[var(--muted)]/20">
              <div
                ref={exportRef}
                className="flex flex-col items-center gap-6"
              >
                {singlePlatform ? (
                  outputs[singlePlatform] && (
                    <ExportCard output={outputs[singlePlatform]!} />
                  )
                ) : (
                  platforms.map((platform) =>
                    outputs[platform] ? (
                      <ExportCard key={platform} output={outputs[platform]!} />
                    ) : null
                  )
                )}
              </div>
            </div>

            <div className="p-4 border-t border-[var(--border)] space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-[var(--muted-foreground)]">
                  Format:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('png')}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      format === 'png'
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80'
                    )}
                  >
                    <Image className="h-4 w-4" />
                    PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('jpg')}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      format === 'jpg'
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80'
                    )}
                  >
                    <Image className="h-4 w-4" />
                    JPG
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      format === 'pdf'
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80'
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    PDF
                  </button>
                </div>

                {format === 'jpg' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--muted-foreground)]">
                      Quality:
                    </span>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.1"
                      value={jpgQuality}
                      onChange={(e) => setJpgQuality(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm">{Math.round(jpgQuality * 100)}%</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Download'}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
