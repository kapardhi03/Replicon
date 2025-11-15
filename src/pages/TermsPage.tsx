import React from 'react';
import Container from '../components/layout/Container';
import { Card, CardContent } from '../components/ui';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <Container size="lg">
        <Card padding="lg">
          <CardContent>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-6">
              Terms and Conditions
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Last Updated: January 2025
            </p>

            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By accessing and using Replicon ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms and Conditions, please do not use this Platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Replicon is a copy-trading platform designed exclusively for the Indian stock market, providing automated order replication services between Master Traders and their managed Followers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  2. User Roles and Eligibility
                </h2>
                <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Master Traders</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Must be at least 18 years of age</li>
                  <li>Must possess valid IIFL Blaze API credentials</li>
                  <li>Must comply with SEBI regulations and Indian trading laws</li>
                  <li>Are responsible for managing their followers' accounts</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Followers</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Operate as sub-accounts under Master Traders</li>
                  <li>Must provide valid IIFL REST API credentials to their Master</li>
                  <li>Acknowledge that trades are executed automatically based on Master's actions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  3. Trading and Risk Disclaimer
                </h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-4">
                  <p className="text-foreground font-semibold mb-2">Important Risk Warning</p>
                  <p className="text-sm text-muted-foreground">
                    Trading in financial markets involves substantial risk of loss. Past performance is not indicative of future results. You should carefully consider whether trading is appropriate for you in light of your financial condition.
                  </p>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Replicon is a technology platform and does not provide investment advice</li>
                  <li>All trading decisions remain the responsibility of the Master Trader</li>
                  <li>Replicon is not liable for trading losses incurred through the platform</li>
                  <li>Users must comply with all applicable securities laws and regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  4. Platform Services
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Replicon provides the following services:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Automated order replication with sub-250ms latency</li>
                  <li>Real-time trade synchronization between Master and Followers</li>
                  <li>Risk management tools and emergency stop mechanisms</li>
                  <li>Performance analytics and reporting</li>
                  <li>Secure API key storage and encryption</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  5. Fees and Payment
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Fee structure and payment terms will be communicated separately. All fees are subject to applicable taxes and are non-refundable except as required by law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  6. Data Security and Privacy
                </h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>API credentials are encrypted and stored securely</li>
                  <li>We implement industry-standard security measures</li>
                  <li>User data is protected in accordance with our Privacy Policy</li>
                  <li>We maintain comprehensive audit trails of all transactions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  7. Prohibited Activities
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Users must not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Engage in market manipulation or fraudulent trading practices</li>
                  <li>Attempt to bypass security measures or access unauthorized data</li>
                  <li>Use the platform for money laundering or illegal activities</li>
                  <li>Share account credentials with unauthorized parties</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, Replicon shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  9. Termination
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for violation of these terms, suspicious activity, or at our sole discretion. Upon termination, your right to use the platform will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  10. Governing Law
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of courts in [Jurisdiction], India.
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                For questions regarding these Terms and Conditions, please contact us at{' '}
                <a href="mailto:legal@replicon.com" className="text-primary hover:underline">
                  legal@replicon.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default TermsPage;
