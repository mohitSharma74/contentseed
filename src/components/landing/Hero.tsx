import { Link } from 'react-router-dom';
import { ArrowRight, Twitter, Linkedin, MessageCircle, Mail } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-24 px-6 text-center">
      <h1 className="text-5xl font-bold mb-6 tracking-tight">
        Write once.<br />
        <span className="text-[var(--primary)]">Distribute everywhere.</span>
      </h1>
      
      <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10">
        Turn any blog post into platform-native content for Twitter/X, LinkedIn, Reddit, and Substack — in one click.
      </p>
      
      <div className="flex items-center justify-center gap-4">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Start Repurposing <ArrowRight className="h-5 w-5" />
        </Link>
        <button
          onClick={() => {
            const event = new CustomEvent('loadSamplePost');
            window.dispatchEvent(event);
          }}
          className="px-6 py-3 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--muted)] transition-colors"
        >
          Try Demo
        </button>
      </div>
      
      <div className="flex items-center justify-center gap-8 mt-12">
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <Twitter className="h-5 w-5" />
          <span>Twitter/X</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <Linkedin className="h-5 w-5" />
          <span>LinkedIn</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <MessageCircle className="h-5 w-5" />
          <span>Reddit</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <Mail className="h-5 w-5" />
          <span>Substack</span>
        </div>
      </div>
    </section>
  );
}
