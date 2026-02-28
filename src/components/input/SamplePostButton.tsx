import samplePost from '@/lib/demo/sample-post.md?raw';

interface SamplePostButtonProps {
  onLoad: (content: string) => void;
}

export function SamplePostButton({ onLoad }: SamplePostButtonProps) {
  const handleClick = () => {
    onLoad(samplePost);
  };

  return (
    <button
      onClick={handleClick}
      className="text-sm text-[var(--primary)] hover:underline"
    >
      Try Sample Post
    </button>
  );
}
