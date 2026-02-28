import { Heart, Repeat, Share2, MoreHorizontal, Send } from 'lucide-react';
import type { PlatformOutput } from '@/types';

interface SubstackPreviewProps {
  output: PlatformOutput;
}

export function SubstackPreview({ output }: SubstackPreviewProps) {
  const contentLength = output.content.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 max-w-md mx-auto font-serif">
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
              CS
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">ContentSeed</p>
              <p className="text-xs text-gray-500">Your content, repurposed</p>
            </div>
          </div>
          <button type="button" className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {output.hook && (
          <p className="text-xl font-bold text-gray-900 mb-2">{output.hook}</p>
        )}

        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {output.content}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          {contentLength} characters (sweet spot: 400-550)
        </p>
      </div>

      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Heart className="h-5 w-5" />
            <span className="text-sm">24</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Repeat className="h-5 w-5" />
            <span className="text-sm">8</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        <button type="button" className="flex items-center gap-1.5 px-3 py-2 bg-[#FF6719] text-white rounded-full text-sm font-medium hover:bg-[#E55B0F] transition-colors">
          <Send className="h-4 w-4" />
          <span>Reshare</span>
        </button>
      </div>

      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Note preview • Substack
        </p>
      </div>
    </div>
  );
}
