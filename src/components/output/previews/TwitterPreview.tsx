import { Heart, MessageCircle, Repeat, Share, BarChart2 } from 'lucide-react';
import type { PlatformOutput } from '@/types';

interface TwitterPreviewProps {
  output: PlatformOutput;
}

export function TwitterPreview({ output }: TwitterPreviewProps) {
  const tweets = output.content.split(/\n\n/).filter(t => t.trim());
  const hook = output.hook;

  return (
    <div className="bg-black rounded-xl p-4 text-white max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold">
          CS
        </div>
        <div>
          <div className="font-bold flex items-center gap-1">
            ContentSeed
            <span className="text-gray-400 text-sm font-normal">@contentseed</span>
          </div>
          <div className="text-gray-400 text-sm">Your content, repurposed</div>
        </div>
      </div>

      {hook && (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-xs text-gray-400 mb-1">Suggested Hook</p>
          <p className="text-sm">{hook}</p>
        </div>
      )}

      <div className="space-y-1">
        {tweets.map((tweet, index) => (
          <div key={`tweet-${tweet.slice(0, 20)}-${index}`} className="flex gap-3 py-2">
            <div className="flex flex-col items-center">
              <span className="text-gray-500 font-mono text-xs">{index + 1}</span>
              <div className="h-full w-px bg-gray-800 mt-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="whitespace-pre-wrap text-[15px] leading-normal">{tweet}</p>
              <div className="flex items-center justify-between mt-2 text-gray-500">
                <button type="button" className="hover:text-[#1DA1F2] transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button type="button" className="hover:text-green-500 transition-colors">
                  <Repeat className="h-4 w-4" />
                </button>
                <button type="button" className="hover:text-pink-500 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
                <button type="button" className="hover:text-[#1DA1F2] transition-colors">
                  <BarChart2 className="h-4 w-4" />
                </button>
                <button type="button" className="hover:text-[#1DA1F2] transition-colors">
                  <Share className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {tweet.length}/280
                {tweet.length > 280 && (
                  <span className="text-red-500 ml-1">({tweet.length - 280} over)</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {output.hashtags.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="flex flex-wrap gap-2">
            {output.hashtags.map((tag) => (
              <span key={tag} className="text-[#1DA1F2] text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
