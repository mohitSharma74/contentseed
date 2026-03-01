import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal, Award } from 'lucide-react';
import type { PlatformOutput } from '@/types';

interface RedditPreviewProps {
  output: PlatformOutput;
}

export function RedditPreview({ output }: RedditPreviewProps) {
  const paragraphs = output.content.split(/\n\n/).filter(p => p.trim());
  const hasTldr = output.content.toLowerCase().includes('tl;dr') || output.content.toLowerCase().includes('tldr');

  return (
    <div className="bg-[#1A1A1B] rounded-lg max-w-md mx-auto font-sans">
      <div className="flex">
        <div className="w-10 flex flex-col items-center py-3 px-1 bg-[#272729] rounded-l-lg">
          <button type="button" className="text-orange-500 hover:bg-gray-700 p-1 rounded">
            <ArrowBigUp className="h-6 w-6" />
          </button>
          <span className="text-sm font-semibold text-white">1.2k</span>
          <button type="button" className="text-gray-500 hover:bg-gray-700 p-1 rounded">
            <ArrowBigDown className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 p-3 pb-1">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1">
              <span className="bg-[#FF4500] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">r/</span>
              programming
            </span>
            <span>•</span>
            <span>Posted by u/contentseed</span>
            <span>•</span>
            <span>5 hours ago</span>
          </div>

          {output.hook && (
            <h3 className="text-lg font-semibold text-white mb-2">{output.hook}</h3>
          )}

          <div className="text-sm text-gray-200 whitespace-pre-wrap">
            {output.content}
          </div>

          {hasTldr && (
            <div className="mt-3 p-3 bg-[#34343a] rounded-lg border-l-4 border-[#FF4500]">
              <p className="text-xs font-semibold text-[#FF4500] mb-1">TL;DR</p>
              <p className="text-sm text-gray-300">
                {paragraphs.find(p => p.toLowerCase().includes('tldr'))?.replace(/tl;dr:?/i, '').trim() || ''}
              </p>
            </div>
          )}

          <div className="flex items-center gap-1 mt-3 -ml-2">
            {[
              { icon: MessageSquare, label: '42 comments' },
              { icon: Share2, label: 'Share' },
              { icon: Award, label: 'Award' },
              { icon: MoreHorizontal, label: 'More' },
            ].map(({ icon: Icon, label }) => (
              <button
                type="button"
                key={label}
                className="flex items-center gap-1.5 px-2 py-1.5 text-gray-400 hover:bg-gray-700 rounded text-xs font-medium transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {output.hashtags.length > 0 && (
        <div className="px-4 pb-3 pt-1 flex flex-wrap gap-2">
          {output.hashtags.map((tag) => (
            <span key={tag} className="text-[#7193FF] text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
