# Real-time Features & Advanced Integrations Guide

This document explains how to use Replicon's real-time features, AI-powered analytics, notification system, and emergency controls.

## Table of Contents

1. [Real-time WebSocket System](#real-time-websocket-system)
2. [Multi-Channel Notifications](#multi-channel-notifications)
3. [AI-Powered Market Analysis](#ai-powered-market-analysis)
4. [Advanced Analytics & Reporting](#advanced-analytics--reporting)
5. [System Monitoring & Health Checks](#system-monitoring--health-checks)
6. [Emergency Controls & Circuit Breakers](#emergency-controls--circuit-breakers)

---

## Real-time WebSocket System

Replicon uses Supabase Realtime for live updates on orders, portfolios, balances, and notifications.

### Setting up Real-time Subscriptions

```typescript
import { realtimeService } from './lib/realtime/realtime-service';

// Subscribe to all updates for a user
const unsubscribe = realtimeService.subscribeToAll('user-id', {
  onOrder: (event, order) => {
    console.log(`Order ${event}:`, order);
    // Update UI with order status
  },
  onPortfolio: (event, position) => {
    console.log(`Position ${event}:`, position);
    // Update portfolio view
  },
  onBalance: (event, balance) => {
    console.log(`Balance ${event}:`, balance);
    // Update balance display
  },
  onNotification: (event, notification) => {
    console.log(`Notification ${event}:`, notification);
    // Show notification toast
  },
  onTrade: (event, trade) => {
    console.log(`Trade executed:`, trade);
    // Update trade history
  },
});

// Later, unsubscribe
unsubscribe();
```

### Individual Subscriptions

```typescript
// Subscribe to orders only
const unsubOrders = realtimeService.subscribeToOrders('user-id', (event, order) => {
  if (event === 'UPDATE' && order.status === 'FILLED') {
    showNotification('Order Filled', `Your order for ${order.symbol} was filled`);
  }
});

// Subscribe to portfolio updates
const unsubPortfolio = realtimeService.subscribeToPortfolio('user-id', (event, position) => {
  if (event === 'UPDATE') {
    updatePositionCard(position);
  }
});

// Subscribe to strategy performance
const unsubStrategy = realtimeService.subscribeToStrategyPerformance(
  'strategy-id',
  (event, performance) => {
    updatePerformanceChart(performance);
  }
);
```

### Connection Management

```typescript
// Check channel status
const status = realtimeService.getChannelStatus('orders:user-id');
console.log('Channel status:', status); // 'SUBSCRIBED', 'CHANNEL_ERROR', etc.

// Get all active channels
const channels = realtimeService.getActiveChannels();
console.log('Active channels:', channels);

// Unsubscribe from all channels
await realtimeService.unsubscribeAll();
```

### Reconnection Logic

The realtime service includes automatic reconnection with exponential backoff:

- Max 5 reconnection attempts
- Exponential backoff: 2s, 4s, 8s, 16s, 32s
- Automatic recovery on connection restore

---

## Multi-Channel Notifications

Send notifications through multiple channels: in-app, email, SMS, WhatsApp, and push (future).

### Sending Notifications

```typescript
import { notificationService } from './lib/notifications/notification-service';

// Send notification
const result = await notificationService.send({
  userId: 'user-id',
  type: 'order_filled',
  title: 'Order Filled',
  message: 'Your order for RELIANCE was filled at ₹2,500',
  priority: 'medium',
  channels: ['in_app', 'email', 'sms'],
  metadata: {
    orderId: 'order-123',
    symbol: 'RELIANCE',
    price: 2500,
    quantity: 10,
  },
});

console.log('Delivery status:', result.deliveryStatus);
// { in_app: true, email: true, sms: true, whatsapp: false, push: false }
```

### Notification Types

```typescript
// Order notifications
await notificationService.send({
  userId: 'user-id',
  type: 'order_rejected',
  title: 'Order Rejected',
  message: 'Your order was rejected due to insufficient balance',
  priority: 'high',
});

// Risk alerts
await notificationService.send({
  userId: 'user-id',
  type: 'daily_loss_limit',
  title: 'Daily Loss Limit Reached',
  message: 'Daily loss limit of ₹50,000 has been reached. Trading suspended.',
  priority: 'critical',
  channels: ['in_app', 'email', 'sms', 'whatsapp'],
});

// Payment notifications
await notificationService.send({
  userId: 'user-id',
  type: 'payment_success',
  title: 'Payment Successful',
  message: 'Your subscription payment of ₹299 was processed successfully',
  priority: 'medium',
});
```

### Managing Notification Preferences

```typescript
// Update preferences
await notificationService.updatePreferences('user-id', {
  email: true,
  sms: false,
  whatsapp: true,
  order_updates: true,
  risk_alerts: true,
  payment_updates: true,
  marketing: false,
});
```

### Reading Notifications

```typescript
// Get user notifications
const notifications = await notificationService.getUserNotifications('user-id', 50);

// Get unread count
const unreadCount = await notificationService.getUnreadCount('user-id');

// Mark as read
await notificationService.markAsRead('notification-id');

// Mark all as read
await notificationService.markAllAsRead('user-id');

// Delete notification
await notificationService.deleteNotification('notification-id');
```

### Bulk Notifications

```typescript
// Send to multiple users
await notificationService.sendBulk([
  {
    userId: 'user-1',
    type: 'system_alert',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Sunday 2AM-4AM',
    priority: 'low',
  },
  {
    userId: 'user-2',
    type: 'system_alert',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Sunday 2AM-4AM',
    priority: 'low',
  },
]);
```

---

## AI-Powered Market Analysis

Use OpenAI GPT-4o for market sentiment analysis, strategy recommendations, and trading signals.

### Market Sentiment Analysis

```typescript
import { openAIService } from './lib/ai/openai-service';

// Analyze market sentiment
const sentiment = await openAIService.analyzeMarketSentiment(
  'RELIANCE',
  [
    'Reliance Industries reports strong Q4 earnings',
    'Oil prices surge amid supply concerns',
    'Analysts upgrade Reliance target price',
  ],
  {
    current_price: 2500,
    change_percent: 2.5,
    volume: 1500000,
  }
);

console.log(`Sentiment: ${sentiment.sentiment}`); // 'bullish'
console.log(`Score: ${sentiment.score}`); // 0.75
console.log(`Confidence: ${sentiment.confidence}`); // 0.85
console.log(`Recommendation: ${sentiment.recommendation}`); // 'buy'
console.log(`Reasoning: ${sentiment.reasoning}`);
```

### Strategy Recommendations

```typescript
// Get AI-powered strategy recommendations
const recommendations = await openAIService.getStrategyRecommendations(
  'strategy-id',
  {
    totalTrades: 100,
    winRate: 55,
    profitFactor: 1.8,
    sharpeRatio: 1.2,
    maxDrawdown: 15000,
  },
  {
    dailyPnL: -5000,
    drawdown: 0.12,
    currentExposure: 200000,
  }
);

console.log('Recommendations:');
recommendations.recommendations.forEach((rec) => {
  console.log(`- [${rec.priority}] ${rec.title}`);
  console.log(`  ${rec.description}`);
  console.log(`  Expected Impact: ${rec.expectedImpact}`);
});
```

### Market Summary

```typescript
// Generate daily market summary
const summary = await openAIService.generateMarketSummary({
  nifty: { value: 19850, change: 0.5 },
  sensex: { value: 66500, change: 0.3 },
  topStocks: [
    { symbol: 'RELIANCE', change: 3.2 },
    { symbol: 'TCS', change: -2.1 },
  ],
});

console.log(`Market Condition: ${summary.marketCondition}`); // 'bullish'
console.log('Key Highlights:', summary.keyHighlights);
console.log('AI Insights:', summary.aiInsights);
console.log('Trading Opportunities:', summary.tradingOpportunities);
```

### Trading Signals

```typescript
// Generate trading signals
const signals = await openAIService.generateTradingSignals(
  ['RELIANCE', 'TCS', 'INFY'],
  'bullish'
);

signals.forEach((signal) => {
  console.log(`${signal.symbol}: ${signal.action} (strength: ${signal.strength})`);
  console.log(`  Entry: ₹${signal.entryPrice}, Target: ₹${signal.targetPrice}`);
  console.log(`  Stop Loss: ₹${signal.stopLoss}`);
  console.log(`  Reasoning: ${signal.reasoning}`);
});
```

### Trade Performance Analysis

```typescript
// Analyze your trading performance
const analysis = await openAIService.analyzeTradePerformance('user-id', trades);

console.log('Overall Score:', analysis.overallScore, '/100');
console.log('Strengths:', analysis.strengths);
console.log('Weaknesses:', analysis.weaknesses);
console.log('Suggestions:', analysis.suggestions);
```

### Risk Assessment

```typescript
// Get AI-powered risk assessment
const risk = await openAIService.generateRiskAssessment(portfolio, riskMetrics);

console.log(`Risk Level: ${risk.riskLevel}`); // 'medium'
console.log('Concerns:', risk.concerns);
console.log('Recommendations:', risk.recommendations);
console.log('Hedging Suggestions:', risk.hedgingSuggestions);
```

---

## Advanced Analytics & Reporting

Generate comprehensive reports for performance, risk, compliance, and tax.

### Performance Reports

```typescript
import { reportingService } from './lib/analytics/reporting';

// Generate performance report
const report = await reportingService.generatePerformanceReport(
  'user-id',
  new Date('2024-01-01'),
  new Date('2024-12-31')
);

console.log('Summary:', report.summary);
console.log('Metrics:', report.metrics);
console.log('Top Symbols:', report.symbolPerformance);
console.log('Monthly Breakdown:', report.monthlyBreakdown);
```

### Risk Reports

```typescript
// Generate risk report
const riskReport = await reportingService.generateRiskReport(
  'user-id',
  new Date('2024-01-01'),
  new Date('2024-12-31')
);

console.log('Current Risk:', riskReport.currentRisk);
console.log('Risk Metrics:', riskReport.riskMetrics);
console.log('Risk Events:', riskReport.riskEvents);
console.log('Recommendations:', riskReport.recommendations);
```

### Compliance Reports

```typescript
// Generate compliance report
const complianceReport = await reportingService.generateComplianceReport(
  'user-id',
  new Date('2024-01-01'),
  new Date('2024-12-31')
);

console.log('KYC Status:', complianceReport.kycStatus);
console.log('Trading Activity:', complianceReport.tradingActivity);
console.log('Audit Trail:', complianceReport.auditTrail);
```

### Tax Reports

```typescript
// Generate tax report for financial year
const taxReport = await reportingService.generateTaxReport('user-id', '2023-2024');

console.log('Short-term Capital Gains:', taxReport.shortTermGains);
console.log('Long-term Capital Gains:', taxReport.longTermGains);
console.log('Total Tax:', taxReport.totalTax);
console.log('Trade Details:', taxReport.tradeDetails);
```

### Export Reports

```typescript
// Export as JSON
const { data, filename } = await reportingService.exportReport(report, 'json');
downloadFile(data, filename);

// Export as CSV
const { data, filename } = await reportingService.exportReport(report, 'csv');
downloadFile(data, filename);
```

---

## System Monitoring & Health Checks

Monitor system health, performance, and detect issues automatically.

### Health Checks

```typescript
import { healthCheckService } from './lib/monitoring/health-check';

// Run comprehensive health check
const health = await healthCheckService.checkHealth();

console.log(`Overall Status: ${health.status}`); // 'healthy', 'degraded', 'unhealthy', 'critical'
console.log('Database:', health.checks.database);
console.log('IIFL API:', health.checks.iiflAPI);
console.log('Razorpay:', health.checks.razorpay);
console.log('OpenAI:', health.checks.openai);
console.log('Performance:', health.performance);
console.log('System:', health.system);
```

### System Metrics

```typescript
// Get system metrics
const metrics = await healthCheckService.getSystemMetrics();

console.log('Order Latency:', metrics.orderLatency);
console.log('API Latency:', metrics.apiLatency);
console.log('Error Rate:', metrics.errorRate);
console.log('Orders Per Minute:', metrics.ordersPerMinute);
```

### Track Custom Metrics

```typescript
// Track metric
healthCheckService.trackMetric('order_processing', 245); // 245ms
healthCheckService.trackMetric('api_response', 125); // 125ms
healthCheckService.trackMetric('errors', 0.5); // 0.5% error rate
```

### Monitor Trading System

```typescript
// Monitor trading system health
const tradingHealth = await healthCheckService.monitorTradingSystem();

console.log('Order Success Rate:', tradingHealth.orderSuccess, '%');
console.log('Order Failures:', tradingHealth.orderFailures);
console.log('Avg Order Latency:', tradingHealth.avgOrderLatency, 'ms');
console.log('API Connection:', tradingHealth.apiConnectionStatus);
```

### Automatic Issue Detection

```typescript
// Detect issues automatically
const issues = await healthCheckService.detectIssues();

if (issues.length > 0) {
  console.log('Issues detected:');
  issues.forEach((issue) => console.log(`- ${issue}`));

  // Alert administrators
  notifyAdmins(issues);
}
```

### Status Dashboard

```typescript
// Get complete status dashboard
const dashboard = await healthCheckService.getStatusDashboard();

console.log('Health:', dashboard.health);
console.log('Metrics:', dashboard.metrics);
console.log('Issues:', dashboard.issues);
console.log('Trading System:', dashboard.tradingSystem);
```

---

## Emergency Controls & Circuit Breakers

Protect users and the system with automatic circuit breakers and emergency controls.

### Circuit Breaker Types

```typescript
import { circuitBreakerService } from './lib/emergency/circuit-breaker';

// Available circuit breaker types:
// - daily_loss: Triggered when daily loss exceeds limit
// - drawdown: Triggered when portfolio drawdown exceeds threshold
// - position_limit: Triggered when too many positions are open
// - order_rate: Triggered when order rate is too high
// - api_failure: Triggered on consecutive API failures
// - manual: Manually triggered emergency stop
// - system_error: Triggered on system errors
```

### Check Circuit Breaker Status

```typescript
// Check if breaker should trigger
const check = await circuitBreakerService.checkBreaker(
  'user-id',
  'daily_loss',
  45000 // Current loss: ₹45,000
);

if (check.shouldTrigger) {
  console.log('Circuit breaker will trigger:', check.reason);
}

// Get current status
const status = circuitBreakerService.getStatus('user-id', 'daily_loss');
console.log('Status:', status); // 'normal', 'warning', 'triggered', 'emergency'
```

### Emergency Stop

```typescript
// Trigger emergency stop
const result = await circuitBreakerService.emergencyStop({
  userId: 'user-id',
  reason: 'Daily loss limit exceeded',
  stopType: 'system',
  initiatedBy: 'risk-manager',
});

console.log('Positions Closed:', result.positionsClosed);
console.log('Errors:', result.errors);

if (result.success) {
  console.log('Emergency stop completed successfully');
} else {
  console.log('Emergency stop completed with errors');
}
```

### Manual Circuit Breaker Trigger

```typescript
// Manually trigger circuit breaker
await circuitBreakerService.trigger(
  'user-id',
  'manual',
  'User requested emergency stop',
  { requestedBy: 'user' }
);
```

### Suspend/Resume Trading

```typescript
// Suspend trading
await circuitBreakerService.suspendTrading('user-id', 'Risk limit exceeded');

// Resume trading
await circuitBreakerService.resumeTrading('user-id');
```

### Manual Override (Admin)

```typescript
// Force trigger (admin only)
await circuitBreakerService.manualOverride(
  'user-id',
  'daily_loss',
  'force_trigger',
  'admin-user-id'
);

// Force recover (admin only)
await circuitBreakerService.manualOverride(
  'user-id',
  'daily_loss',
  'force_recover',
  'admin-user-id'
);
```

### Get All Circuit Breaker Statuses

```typescript
// Get all statuses for a user
const statuses = circuitBreakerService.getAllStatuses('user-id');

console.log('Daily Loss:', statuses.daily_loss);
console.log('Drawdown:', statuses.drawdown);
console.log('Position Limit:', statuses.position_limit);
console.log('Order Rate:', statuses.order_rate);
```

### Circuit Breaker History

```typescript
// Get circuit breaker event history
const history = await circuitBreakerService.getHistory('user-id', 50);

history.forEach((event) => {
  console.log(`${event.timestamp}: ${event.type} - ${event.status}`);
  console.log(`  Trigger: ${event.trigger}`);
  if (event.recoveredAt) {
    console.log(`  Recovered: ${event.recoveredAt}`);
  }
});
```

### System Recovery

```typescript
// Execute system-wide recovery
const recoveryPlan = await circuitBreakerService.executeSystemRecovery();

recoveryPlan.forEach((step) => {
  console.log(`Step ${step.step}: ${step.action}`);
  console.log(`  Status: ${step.status}`);
  if (step.error) {
    console.log(`  Error: ${step.error}`);
  }
});
```

---

## Best Practices

### Real-time Subscriptions

1. **Always unsubscribe when component unmounts** to prevent memory leaks
2. **Use selective subscriptions** - only subscribe to data you need
3. **Handle reconnection gracefully** - show UI indicators for connection status
4. **Debounce rapid updates** to avoid overwhelming the UI

### Notifications

1. **Set appropriate priorities** - use 'critical' sparingly
2. **Respect user preferences** - honor notification settings
3. **Include actionable information** in notification metadata
4. **Use templates** for consistent messaging

### AI Features

1. **Handle API failures gracefully** - fall back to mock data
2. **Cache AI responses** when appropriate
3. **Rate limit AI calls** to manage costs
4. **Validate AI outputs** before using them

### Monitoring

1. **Set up automated alerts** for critical metrics
2. **Track custom metrics** relevant to your use case
3. **Regular health checks** - run every 5-10 minutes
4. **Dashboard visibility** - display system status prominently

### Emergency Controls

1. **Test circuit breakers regularly** in staging
2. **Document recovery procedures** for your team
3. **Monitor breaker triggers** to adjust thresholds
4. **Have manual overrides** for edge cases

---

## Configuration

### Required Environment Variables

```bash
# Twilio (for SMS and WhatsApp)
VITE_TWILIO_ACCOUNT_SID=your_account_sid
VITE_TWILIO_AUTH_TOKEN=your_auth_token
VITE_TWILIO_PHONE_NUMBER=your_phone_number
VITE_TWILIO_WHATSAPP_NUMBER=your_whatsapp_number

# Resend (for emails)
VITE_RESEND_API_KEY=your_api_key
VITE_FROM_EMAIL=noreply@replicon.app

# OpenAI (for AI features)
VITE_OPENAI_API_KEY=your_api_key

# Feature Flags
VITE_ENABLE_AI_FEATURES=false
VITE_ENABLE_REALTIME=true
VITE_ENABLE_EMERGENCY_CONTROLS=true
```

### Supabase Realtime Setup

Enable realtime replication in Supabase dashboard for:

- `orders`
- `trades`
- `portfolios`
- `account_balances`
- `notifications`
- `strategy_performance`

---

## Troubleshooting

### Real-time Issues

**Problem**: Subscriptions not receiving updates

**Solution**:
- Check Supabase replication is enabled for the table
- Verify RLS policies allow SELECT for the user
- Check browser console for WebSocket errors

**Problem**: Frequent disconnections

**Solution**:
- Check network stability
- Verify Supabase project is active
- Reduce number of concurrent subscriptions

### Notification Issues

**Problem**: SMS/WhatsApp not sending

**Solution**:
- Verify Twilio credentials are correct
- Check user phone number format (+country code)
- Ensure Twilio account has sufficient balance

**Problem**: Emails not sending

**Solution**:
- Verify Resend API key
- Check sender email domain is verified
- Review email content for spam triggers

### AI Features Issues

**Problem**: OpenAI API errors

**Solution**:
- Check API key is valid
- Verify API quota/usage limits
- Fall back to mock data if API unavailable

### Circuit Breaker Issues

**Problem**: Breaker triggering too frequently

**Solution**:
- Adjust thresholds in circuit breaker config
- Review trading strategy risk parameters
- Check for system issues causing false triggers

---

## Next Steps

After implementing these features:

1. Build UI components for real-time data display
2. Create notification preference settings page
3. Implement AI insights dashboard
4. Build admin dashboard for system monitoring
5. Add user-facing circuit breaker status indicators

For more information, see:
- [Trading API Guide](./TRADING_API.md)
- [Database Schema](../supabase/README.md)
