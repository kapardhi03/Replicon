import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, BarChart3, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container className="py-8">
      <PageHeader
        title={`Welcome back, ${user?.name}!`}
        description="Your Master Trader dashboard"
      />

      {/* Email Verification Alert */}
      {!user?.isEmailVerified && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Verify your email address
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                Please check your inbox and verify your email to unlock all features.
              </p>
              <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-500 dark:text-yellow-400 dark:hover:bg-yellow-900/30">
                Resend Verification Email
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Total Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-numbers text-foreground">0</p>
            <p className="text-sm text-muted-foreground mt-1">No followers added yet</p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-profit" />
              Active Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-numbers text-foreground">0</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first strategy</p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-primary" />
              Today's P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-numbers text-foreground">₹0.00</p>
            <p className="text-sm text-muted-foreground mt-1">No trades executed</p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Complete these steps to start copy trading:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Connect IIFL Blaze API</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Link your trading account to enable real-time order detection
                  </p>
                  <Button size="sm" onClick={() => navigate('/master/api-setup')}>
                    Connect API
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg opacity-60">
                <div className="h-8 w-8 rounded-full bg-border flex items-center justify-center flex-shrink-0">
                  <span className="text-muted-foreground font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Add Your Followers</h4>
                  <p className="text-sm text-muted-foreground">
                    Add follower accounts with their API credentials and risk settings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg opacity-60">
                <div className="h-8 w-8 rounded-full bg-border flex items-center justify-center flex-shrink-0">
                  <span className="text-muted-foreground font-bold">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Start Trading</h4>
                  <p className="text-sm text-muted-foreground">
                    Place orders and watch them replicate automatically to all followers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DashboardPage;
