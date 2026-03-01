import { ThumbsUp, MessageSquare, Repeat2, Send } from 'lucide-react';
import type { PlatformOutput } from '@/types';

interface LinkedInPreviewProps {
  output: PlatformOutput;
}

export function LinkedInPreview({ output }: LinkedInPreviewProps) {
  const paragraphs = output.content.split(/\n\n/).filter(p => p.trim());
  const firstLine = paragraphs[0] || '';
  const isLongPost = paragraphs.length > 1;
  const foldLine = 140;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto font-sans">
      <div className="p-4 pb-2">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
            CS
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">ContentSeed</span>
              <span className="text-gray-500 text-sm">• 1st</span>
            </div>
            <p className="text-sm text-gray-500">Your content, repurposed</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>•</span>
              <span>Promoted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-2">
        {output.hook && (
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">{output.hook}</p>
          </div>
        )}

        <p className={`text-sm text-gray-900 whitespace-pre-wrap ${isLongPost && firstLine.length > foldLine ? 'line-clamp-[7]' : ''}`}>
          {output.content}
        </p>

        {isLongPost && firstLine.length > foldLine && (
          <button type="button" className="text-[#0A66C2] text-sm font-medium mt-1 hover:underline">
            ...see more
          </button>
        )}
      </div>

      {output.content.includes('http') && (
        <div className="px-4 pb-2">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Link Preview</span>
            </div>
            <div className="p-3 bg-white">
              <p className="text-sm font-medium text-gray-900">Blog Post</p>
              <p className="text-xs text-gray-500">yoursite.com</p>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-1 text-xs text-gray-500">
        127 reactions • 23 comments
      </div>

      <div className="px-2 py-1 border-t border-gray-100 flex items-center justify-between">
        {[
          { icon: ThumbsUp, label: 'Like' },
          { icon: MessageSquare, label: 'Comment' },
          { icon: Repeat2, label: 'Repost' },
          { icon: Send, label: 'Send' },
        ].map(({ icon: Icon, label }) => (
          <button
            type="button"
            key={label}
            className="flex-1 flex items-center justify-center gap-1 py-3 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      {output.hashtags.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {output.hashtags.map((tag) => (
              <span key={tag} className="text-[#0A66C2] text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
