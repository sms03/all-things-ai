import { Link } from 'react-router-dom';
import DotGrid from '@/components/backgrounds/DotGrid';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border mt-16">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <DotGrid dotSize={10} gap={28} baseColor="#60A5FA" activeColor="#1D4ED8" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground tracking-tight">All Things AI</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Discover, compare, and track the best AI tools. Curated categories, reviews, and insights to help you build faster.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6 md:gap-10">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link className="text-muted-foreground hover:text-foreground transition" to="/explore">Browse Tools</Link></li>
                <li><Link className="text-muted-foreground hover:text-foreground transition" to="/project-ideas">Project Ideas</Link></li>
                <li><Link className="text-muted-foreground hover:text-foreground transition" to="/comparisons">Comparisons</Link></li>
                <li><Link className="text-muted-foreground hover:text-foreground transition" to="/analytics">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Contribute</h4>
              <ul className="space-y-2 text-sm">
                <li><Link className="text-muted-foreground hover:text-foreground transition" to="/submit">Submit a Tool</Link></li>
                <li><Link className="text-muted-foreground hover:text-foreground transition" to="/profile">Profile</Link></li>
                <li><a className="text-muted-foreground hover:text-foreground transition" href="#" aria-disabled>Changelog</a></li>
                <li><a className="text-muted-foreground hover:text-foreground transition" href="#" aria-disabled>Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter / Note */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Stay in the loop</h4>
            <p className="text-sm text-muted-foreground mb-4">Get weekly updates on new AI tools and trends.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 rounded-md border border-border bg-background/70 text-foreground px-3 py-2 text-sm focus-ring"
                aria-label="Email address"
              />
              <button
                type="button"
                className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition"
                aria-label="Subscribe"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {year} All Things AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition">Terms</a>
            <a href="#" className="hover:text-foreground transition">Privacy</a>
            <a href="#" className="hover:text-foreground transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
