import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Shield, TrendingUp, Mail, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent } from '../components/ui';
import Container from '../components/layout/Container';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Zap,
      title: 'Welcome to Replicon!',
      description: 'Your journey to ultra-fast copy trading begins here',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Replicon is a production-ready, ultra-low-latency copy-trading platform designed
            exclusively for the Indian stock market. We enable automated order replication with
            sub-250ms latency.
          </p>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Sub-250ms Latency</p>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast order replication for zero missed opportunities
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">500+ Followers Per Master</p>
                <p className="text-sm text-muted-foreground">
                  Scale your trading operations with high-concurrency support
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Enterprise Security</p>
                <p className="text-sm text-muted-foreground">
                  Bank-grade encryption and full audit trails
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Mail,
      title: 'Verify Your Email',
      description: 'Secure your account and unlock all features',
      content: (
        <div className="space-y-4">
          {user?.isEmailVerified ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-profit/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-profit" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Verified!</h3>
              <p className="text-sm text-muted-foreground">
                Your email address has been successfully verified
              </p>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  We've sent a verification email to <strong>{user?.email}</strong>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Please check your inbox and click the verification link to activate your account.
                If you don't see the email, check your spam folder.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Verification Email Sent',
                    message: 'Please check your inbox',
                  });
                }}
              >
                Resend Verification Email
              </Button>
            </>
          )}
        </div>
      ),
    },
    {
      icon: TrendingUp,
      title: user?.role === 'master' ? 'Master Trader Setup' : 'Follower Setup',
      description:
        user?.role === 'master'
          ? 'Get ready to manage your followers'
          : 'Start copying trades from experts',
      content: (
        <div className="space-y-4">
          {user?.role === 'master' ? (
            <>
              <p className="text-muted-foreground leading-relaxed">
                As a Master Trader, you have full control over your followers. Here's what you can do:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Connect IIFL Blaze API</p>
                    <p className="text-sm text-muted-foreground">
                      Link your trading account for real-time order detection
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Add Your Followers</p>
                    <p className="text-sm text-muted-foreground">
                      Manually add follower accounts with their API credentials
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Configure Risk Settings</p>
                    <p className="text-sm text-muted-foreground">
                      Set scaling factors and risk parameters for each follower
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-muted-foreground leading-relaxed">
                As a Follower, your Master Trader will manage your account. Here's how it works:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Provide API Credentials</p>
                    <p className="text-sm text-muted-foreground">
                      Share your IIFL REST API details with your Master Trader
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Automatic Trade Copying</p>
                    <p className="text-sm text-muted-foreground">
                      Your master's trades will be replicated to your account in real-time
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Monitor Performance</p>
                    <p className="text-sm text-muted-foreground">
                      Track your P&L and trading activity through your master
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      icon: Shield,
      title: "You're All Set!",
      description: 'Ready to start your trading journey',
      content: (
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="h-20 w-20 rounded-full bg-profit/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-profit" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              Congratulations!
            </h3>
            <p className="text-muted-foreground">
              Your account is ready. Let's explore the platform.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-3">Quick Tips:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Start by connecting your IIFL API credentials in Settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Explore the dashboard to familiarize yourself with the interface</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Check out our FAQ section if you have any questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Contact support anytime for assistance</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      // Mark onboarding as completed and navigate to dashboard
      updateUser({ onboardingCompleted: true });
      navigate(user?.role === 'master' ? '/master/dashboard' : '/');
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    updateUser({ onboardingCompleted: true });
    navigate(user?.role === 'master' ? '/master/dashboard' : '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center py-12 px-4">
      <Container size="md">
        <Card padding="lg" className="relative">
          <CardContent>
            {/* Progress Indicator */}
            <div className="flex gap-2 mb-8">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    index <= currentSlide ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                {currentSlideData.title}
              </h2>
              <p className="text-muted-foreground">{currentSlideData.description}</p>
            </div>

            <div className="mb-8">{currentSlideData.content}</div>

            {/* Actions */}
            <div className="flex gap-3">
              {!isLastSlide && (
                <Button type="button" variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              <Button
                type="button"
                className="flex-1"
                onClick={handleNext}
                rightIcon={!isLastSlide ? <ArrowRight className="h-5 w-5" /> : undefined}
              >
                {isLastSlide ? 'Go to Dashboard' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Slide Indicator */}
        <div className="text-center mt-6 text-white/80 text-sm">
          Step {currentSlide + 1} of {slides.length}
        </div>
      </Container>
    </div>
  );
};

export default OnboardingPage;
