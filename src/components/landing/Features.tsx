import { Twitter, Linkedin, MessageCircle, Mail, Sparkles } from 'lucide-react';

const platforms = [
  {
    name: 'Twitter/X',
    icon: Twitter,
    color: '#1DA1F2',
    description: 'Hook-first threading with proper numbering',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0A66C2',
    description: '"Broetry" format with professional engagement',
  },
  {
    name: 'Reddit',
    icon: MessageCircle,
    color: '#FF4500',
    description: 'Value-first structure with TL;DR extraction',
  },
  {
    name: 'Substack',
    icon: Mail,
    color: '#FF6719',
    description: 'Information-gap teasers without giving it away',
  },
];

export function Features() {
  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-12">
        Platform-native content, <span className="text-[var(--primary)]">not generic summaries</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className="p-6 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: `${platform.color}20` }}
            >
              <platform.icon className="h-6 w-6" style={{ color: platform.color }} />
            </div>
            <h3 className="font-semibold mb-2">{platform.name}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {platform.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-12 flex items-center justify-center gap-2 text-[var(--muted-foreground)]">
        <Sparkles className="h-5 w-5 text-[var(--primary)]" />
        <span>Powered by Claude or OpenAI — you choose</span>
      </div>
    </section>
  );
}
