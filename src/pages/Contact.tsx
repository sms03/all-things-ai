import Navigation from '@/components/Navigation';
import { Background } from '@/components/Background';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // No backend wired yet; simulate success
      await new Promise((r) => setTimeout(r, 600));
      (e.currentTarget as HTMLFormElement).reset();
      toast({
        title: 'Message sent',
        description: 'Thanks! We will get back to you shortly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Background variant="gradient" />
      <Navigation />
      <main className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
            <p className="mt-3 text-muted-foreground">
              Questions, feedback, or partnership ideas? Send us a message.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-soft">
            <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-md border border-border bg-background/70 text-foreground px-3 py-2 text-sm focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-border bg-background/70 text-foreground px-3 py-2 text-sm focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="w-full rounded-md border border-border bg-background/70 text-foreground px-3 py-2 text-sm focus-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full rounded-md border border-border bg-background/70 text-foreground px-3 py-2 text-sm focus-ring"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">We typically respond within 1–2 business days.</p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
