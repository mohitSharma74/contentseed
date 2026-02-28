interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste your blog post here as Markdown..."
      className="flex-1 w-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm"
    />
  );
}
