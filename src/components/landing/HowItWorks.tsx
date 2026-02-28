import { FileText, GitBranch, Rocket } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Paste Your Post',
    description: 'Drop in your blog post as Markdown. We parse it structurally.',
  },
  {
    icon: GitBranch,
    title: 'We Generate',
    description: 'AI transforms it into platform-native versions using proven templates.',
  },
  {
    icon: Rocket,
    title: 'You Distribute',
    description: 'Copy, tweak, and share. Export as images or PDFs too.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-[var(--muted)]/30">
      <h2 className="text-3xl font-bold text-center mb-12">
        How It Works
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.title} className="text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-4">
              <step.icon className="h-8 w-8 text-[var(--primary)]" />
            </div>
            <div className="text-sm font-medium text-[var(--primary)] mb-2">
              Step {index + 1}
            </div>
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
