import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Layers, Shield, Zap } from 'lucide-react';
import Navbar from './-(components)/Navbar';
import FeatureCard from './-(components)/FeatureCard';

export const Route = createFileRoute('/_public/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary"></div>
          <span className="text-2xl font-bold">Quirely</span>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                to="/auth/login"
                className="text-muted-foreground hover:text-primary"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <Navbar />

      <main>
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="mb-6 text-5xl font-bold">
              Organize Your Workspaces with Quirely
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Streamline your workflow, collaborate seamlessly, and boost
              productivity.
            </p>
            <Button size="lg" asChild>
              <Link to="/auth/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section id="features" className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Key Features
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Layers className="h-10 w-10 text-primary" />}
                title="Multiple Workspaces"
                description="Organize your projects into separate workspaces for better management."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Fast Performance"
                description="Experience lightning-fast load times and smooth interactions."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Secure Collaboration"
                description="Work together safely with robust security measures in place."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Quirely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
