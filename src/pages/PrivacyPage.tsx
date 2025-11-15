import React from 'react';
import Container from '../components/layout/Container';
import { Card, CardContent } from '../components/ui';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <Container size="lg">
        <Card padding="lg">
          <CardContent>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Last Updated: January 2025
            </p>

            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  1. Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Replicon ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our copy-trading platform. Please read this policy carefully to understand our practices regarding your personal data.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  2. Information We Collect
                </h2>

                <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Personal Information</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Name, email address, and phone number</li>
                  <li>KYC documents (PAN card, Aadhaar, address proof)</li>
                  <li>Bank account and payment information</li>
                  <li>Trading account details and broker API credentials</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Trading Data</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Order details (buy, sell, modify, cancel)</li>
                  <li>Portfolio holdings and positions</li>
                  <li>Transaction history and P&L data</li>
                  <li>Strategy configurations and risk parameters</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3">2.3 Technical Data</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>IP address, browser type, and device information</li>
                  <li>Usage data, log files, and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Service Delivery:</strong> To provide automated order replication and copy-trading services</li>
                  <li><strong>Account Management:</strong> To create and maintain user accounts, verify identity, and process transactions</li>
                  <li><strong>Security:</strong> To detect fraud, prevent unauthorized access, and ensure platform security</li>
                  <li><strong>Communication:</strong> To send trade alerts, notifications, and important updates</li>
                  <li><strong>Analytics:</strong> To analyze platform performance and improve user experience</li>
                  <li><strong>Compliance:</strong> To meet regulatory requirements and legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  4. Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Encryption:</strong> All API credentials and sensitive data are encrypted using AES-256</li>
                  <li><strong>Secure Transmission:</strong> SSL/TLS encryption for all data in transit</li>
                  <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
                  <li><strong>Audit Trails:</strong> Comprehensive logging of all system activities</li>
                  <li><strong>Regular Security Audits:</strong> Periodic penetration testing and vulnerability assessments</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  5. Data Sharing and Disclosure
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not sell your personal information. We may share your data only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Service Providers:</strong> With IIFL and other essential service providers for trade execution</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory authorities</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  6. Data Retention
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Trading data and transaction records are retained for a minimum of 7 years as required by SEBI regulations. After this period, data may be anonymized or securely deleted.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  7. Your Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                  <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                  <li><strong>Objection:</strong> Object to certain data processing activities</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  8. Cookies and Tracking
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Maintain user sessions and authentication</li>
                  <li>Remember user preferences and settings</li>
                  <li>Analyze platform usage and performance</li>
                  <li>Improve user experience and security</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You can control cookie preferences through your browser settings, though some features may not function properly without cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  9. Third-Party Links
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  10. Children's Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Replicon is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such data, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  11. Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through a prominent notice on our platform. Your continued use of Replicon after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  12. Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground mb-2"><strong>Email:</strong> privacy@replicon.com</p>
                  <p className="text-foreground mb-2"><strong>Address:</strong> [Company Address], India</p>
                  <p className="text-foreground"><strong>Data Protection Officer:</strong> dpo@replicon.com</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default PrivacyPage;
