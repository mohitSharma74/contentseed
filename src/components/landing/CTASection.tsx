import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to stop reformatting?
      </h2>
      <p className="text-[var(--muted-foreground)] mb-8 max-w-xl mx-auto">
        Join technical content creators who write once and distribute everywhere.
      </p>
      <Link
        to="/app"
        className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        Open ContentSeed <ArrowRight className="h-5 w-5" />
      </Link>
    </section>
  );
}
