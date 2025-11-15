import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Shield,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { Button, Card, CardContent } from '../components/ui';
import Container from '../components/layout/Container';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <Container className="relative py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6">
                <Zap className="h-4 w-4 text-profit" />
                <span>Sub-250ms Latency</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
                Ultra-Fast Copy Trading for India
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Replicate trades with precision. Automated order copying for the Indian stock market with enterprise-grade security and real-time synchronization.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Master Login
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold font-numbers">{'<'}250ms</div>
                  <div className="text-sm text-white/70 mt-1">Avg Latency</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-numbers">500+</div>
                  <div className="text-sm text-white/70 mt-1">Followers/Master</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-numbers">99.9%</div>
                  <div className="text-sm text-white/70 mt-1">Uptime</div>
                </div>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-profit/20 to-transparent rounded-2xl" />
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-4">
                        <div className="h-10 w-10 rounded-full bg-profit/20 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-profit" />
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-white/20 rounded w-3/4 mb-2" />
                          <div className="h-2 bg-white/10 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Built for Professional Traders
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to scale your trading operations with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} variant="elevated" padding="lg" className="hover:shadow-xl transition-shadow">
                <CardContent>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Simple. Fast. Reliable.
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border -z-10" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Ready to Scale Your Trading?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join professional traders who trust Replicon for their copy-trading needs
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Your Journey
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <Container>
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-heading font-bold">Replicon</span>
              </div>
              <p className="text-white/70 text-sm">
                Ultra-low latency copy trading platform for the Indian stock market
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/compliance" className="hover:text-white transition-colors">Compliance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/status" className="hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
              <p>© 2025 Replicon. All rights reserved.</p>
              <p>SEBI Registered | Compliant with Indian Trading Regulations</p>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-250ms order replication ensures your followers never miss a trade opportunity.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, MFA, and full audit trails keep your data secure.',
  },
  {
    icon: Users,
    title: 'Manage Followers',
    description: 'Add and manage up to 500+ followers per master with granular control.',
  },
  {
    icon: TrendingUp,
    title: 'Strategy Control',
    description: 'Create multiple strategies with custom risk parameters and scaling factors.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive P&L tracking and performance metrics for data-driven decisions.',
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'WebSocket-based live updates for trades, orders, and risk alerts.',
  },
];

const steps = [
  {
    title: 'Register & Connect',
    description: 'Sign up as a Master Trader and connect your IIFL Blaze API',
  },
  {
    title: 'Add Followers',
    description: 'Manually add your followers with their account details and risk settings',
  },
  {
    title: 'Start Trading',
    description: 'Place trades and watch them replicate automatically to all followers',
  },
];

export default LandingPage;
