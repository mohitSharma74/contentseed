import { Shield, Lock, EyeOff, Database } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'No Backend',
    description: 'All processing happens in your browser',
  },
  {
    icon: EyeOff,
    title: 'No Tracking',
    description: 'Zero analytics, zero telemetry',
  },
  {
    icon: Database,
    title: 'Your Keys Stay Local',
    description: 'API keys encrypted with AES-256',
  },
  {
    icon: Shield,
    title: 'Open Source',
    description: 'Verify everything on GitHub',
  },
];

export function PrivacyBadge() {
  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-4">
        Privacy First
      </h2>
      <p className="text-center text-[var(--muted-foreground)] mb-12 max-w-2xl mx-auto">
        We built ContentSeed with a zero-trust architecture. Your content never touches our servers — ever.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <feature.icon className="h-5 w-5 text-[var(--primary)] mt-0.5" />
            <div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
