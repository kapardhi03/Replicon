import React from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import Container from '../components/layout/Container';
import { Card } from '../components/ui';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is Replicon?',
    answer: 'Replicon is an ultra-low-latency copy-trading platform designed exclusively for the Indian stock market. It enables automated order replication between Master Traders and their managed Followers with sub-250ms latency, powered by IIFL\'s Blaze WebSocket API.',
  },
  {
    question: 'How does the copy-trading work?',
    answer: 'When a Master Trader places, modifies, or cancels an order, Replicon automatically replicates that action to all connected Follower accounts in real-time. The system uses WebSocket connections for Masters (for instant order detection) and REST API for Followers (for order execution).',
  },
  {
    question: 'Who can become a Master Trader?',
    answer: 'Any individual over 18 years of age with a valid IIFL trading account and Blaze API credentials can register as a Master Trader. Masters are typically professional traders or fund managers who want to replicate their trades across multiple accounts.',
  },
  {
    question: 'Do Followers need to create an account?',
    answer: 'No, Followers do not need to create separate accounts or log in to Replicon. They operate as sub-accounts managed entirely by their Master Trader. The Master adds Follower details (name, mobile, API credentials) directly through their dashboard.',
  },
  {
    question: 'What is the latency for order replication?',
    answer: 'Replicon achieves sub-250ms average latency for order replication. This means that when a Master places an order, it is typically replicated to all Followers within a quarter of a second, ensuring minimal slippage.',
  },
  {
    question: 'How many Followers can a Master manage?',
    answer: 'A single Master Trader can manage up to 500+ Followers simultaneously. The platform is designed for high-concurrency support and can handle large-scale operations efficiently.',
  },
  {
    question: 'What risk management features are available?',
    answer: 'Replicon includes comprehensive risk management tools including: Emergency stop (global kill switch), Stop Loss settings, Drawdown limits, Exposure controls, Position sizing, and Scaling factors for each Follower.',
  },
  {
    question: 'How are API credentials stored?',
    answer: 'All API credentials are encrypted using AES-256 encryption and stored securely in our database. We implement bank-grade security measures including SSL/TLS for data transmission, multi-factor authentication, and comprehensive audit trails.',
  },
  {
    question: 'Can I customize order sizes for different Followers?',
    answer: 'Yes, each Follower can have a custom scaling factor. For example, if a Master buys 100 shares and a Follower has a 0.5x scaling factor, the Follower will automatically buy 50 shares. This allows for proportional position sizing based on account size.',
  },
  {
    question: 'What happens if my internet connection drops?',
    answer: 'Replicon uses redundant WebSocket connections and automatic reconnection mechanisms. If a connection is lost, the system will attempt to reconnect immediately. Critical orders are queued and executed once the connection is restored.',
  },
  {
    question: 'Is Replicon SEBI compliant?',
    answer: 'Yes, Replicon operates in full compliance with SEBI regulations and Indian securities laws. We maintain proper audit trails, KYC procedures, and adhere to all regulatory requirements for trading platforms.',
  },
  {
    question: 'What markets and instruments are supported?',
    answer: 'Currently, Replicon supports all instruments available through IIFL\'s Blaze API, including Equities, Futures, Options, and Commodities traded on NSE, BSE, and MCX exchanges.',
  },
  {
    question: 'How do I monitor Follower performance?',
    answer: 'The Master Dashboard provides real-time analytics including individual Follower P&L, trade history, success rates, and performance metrics. You can export detailed reports and track performance over custom time periods.',
  },
  {
    question: 'Can I pause trading for specific Followers?',
    answer: 'Yes, you can pause or stop trading for individual Followers at any time. When paused, new orders from the Master will not be replicated to that specific Follower, but existing positions remain unchanged.',
  },
  {
    question: 'What are the pricing and fees?',
    answer: 'Pricing details are available upon registration. We offer tiered pricing based on the number of Followers and trading volume. All fees are transparent with no hidden charges.',
  },
  {
    question: 'How do I get started?',
    answer: 'To get started: 1) Register as a Master Trader, 2) Complete KYC verification, 3) Connect your IIFL Blaze API, 4) Add your Followers with their API credentials, 5) Configure strategies and risk parameters, 6) Start trading!',
  },
  {
    question: 'What support is available?',
    answer: 'We provide comprehensive support including email support, live chat during market hours, detailed documentation, video tutorials, and a dedicated support team for technical issues. Enterprise customers also receive priority support.',
  },
  {
    question: 'Can I backtest my strategies?',
    answer: 'Yes, Replicon includes backtesting capabilities where you can test your trading strategies against historical data to evaluate performance before deploying them live.',
  },
];

const FAQPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <Container size="lg">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about Replicon
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <Card padding="none" className="overflow-hidden">
                  <Disclosure.Button className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors">
                    <span className="font-semibold text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-muted-foreground transition-transform duration-200`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </Disclosure.Panel>
                  </Transition>
                </Card>
              )}
            </Disclosure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card padding="lg">
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </a>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default FAQPage;
