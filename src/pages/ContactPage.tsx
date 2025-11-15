import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Container from '../components/layout/Container';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '../components/ui';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <Container size="lg">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with our support team
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information Cards */}
          <Card padding="lg" variant="elevated">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">Email</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Our team typically responds within 24 hours
                </p>
                <a
                  href="mailto:support@replicon.com"
                  className="text-primary hover:underline"
                >
                  support@replicon.com
                </a>
              </div>
            </CardContent>
          </Card>

          <Card padding="lg" variant="elevated">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">Phone</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Mon-Fri from 9am to 6pm IST
                </p>
                <a href="tel:+911234567890" className="text-primary hover:underline">
                  +91 123 456 7890
                </a>
              </div>
            </CardContent>
          </Card>

          <Card padding="lg" variant="elevated">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">Office</h3>
                <p className="text-sm text-muted-foreground">
                  123 Business District
                  <br />
                  Mumbai, Maharashtra 400001
                  <br />
                  India
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-background text-foreground resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <Button type="submit" size="lg" rightIcon={<Send className="h-5 w-5" />}>
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Support Options */}
        <div className="mt-12">
          <Card padding="lg">
            <CardContent>
              <h3 className="text-xl font-heading font-bold text-foreground mb-4">
                Other Ways to Get Help
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Documentation</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Browse our comprehensive guides and tutorials
                  </p>
                  <a href="/docs" className="text-primary hover:underline text-sm">
                    View Documentation →
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">FAQ</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Find answers to commonly asked questions
                  </p>
                  <a href="/faq" className="text-primary hover:underline text-sm">
                    Browse FAQ →
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">System Status</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Check real-time platform status and uptime
                  </p>
                  <a href="/status" className="text-primary hover:underline text-sm">
                    View Status →
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Community</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Join our community forum for discussions
                  </p>
                  <a href="/community" className="text-primary hover:underline text-sm">
                    Join Community →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
