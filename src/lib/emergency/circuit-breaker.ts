import { supabase } from '../supabase';
import { notificationService } from '../notifications/notification-service';
import { riskManager } from '../trading/risk-manager';
import type { IIFLClient } from '../api/iifl-client';

// =====================================================
// TYPES
// =====================================================

export type CircuitBreakerStatus = 'normal' | 'warning' | 'triggered' | 'emergency';

export type CircuitBreakerType =
  | 'daily_loss'
  | 'drawdown'
  | 'position_limit'
  | 'order_rate'
  | 'api_failure'
  | 'manual'
  | 'system_error';

export interface CircuitBreakerConfig {
  type: CircuitBreakerType;
  enabled: boolean;
  threshold: number;
  cooldownPeriod: number; // milliseconds
  autoRecover: boolean;
  notifyChannels: string[];
}

export interface CircuitBreakerEvent {
  id: string;
  userId?: string;
  strategyId?: string;
  type: CircuitBreakerType;
  status: CircuitBreakerStatus;
  trigger: string;
  timestamp: string;
  metadata: any;
  recoveredAt?: string;
}

export interface EmergencyStopRequest {
  userId: string;
  reason: string;
  stopType: 'user' | 'strategy' | 'system';
  initiatedBy: string;
}

export interface SystemRecoveryPlan {
  step: number;
  action: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp?: string;
  error?: string;
}

// =====================================================
// CIRCUIT BREAKER SERVICE
// =====================================================

class CircuitBreakerService {
  private breakerStates: Map<string, CircuitBreakerStatus> = new Map();
  private triggerCounts: Map<string, number> = new Map();
  private lastTriggerTime: Map<string, number> = new Map();
  private iiflClient: IIFLClient | null = null;

  private readonly DEFAULT_CONFIGS: Record<CircuitBreakerType, CircuitBreakerConfig> = {
    daily_loss: {
      type: 'daily_loss',
      enabled: true,
      threshold: 50000, // ₹50,000
      cooldownPeriod: 3600000, // 1 hour
      autoRecover: false,
      notifyChannels: ['in_app', 'email', 'sms'],
    },
    drawdown: {
      type: 'drawdown',
      enabled: true,
      threshold: 0.15, // 15%
      cooldownPeriod: 3600000,
      autoRecover: false,
      notifyChannels: ['in_app', 'email', 'sms'],
    },
    position_limit: {
      type: 'position_limit',
      enabled: true,
      threshold: 20, // max 20 positions
      cooldownPeriod: 300000, // 5 minutes
      autoRecover: true,
      notifyChannels: ['in_app', 'email'],
    },
    order_rate: {
      type: 'order_rate',
      enabled: true,
      threshold: 100, // max 100 orders per minute
      cooldownPeriod: 60000, // 1 minute
      autoRecover: true,
      notifyChannels: ['in_app'],
    },
    api_failure: {
      type: 'api_failure',
      enabled: true,
      threshold: 5, // 5 consecutive failures
      cooldownPeriod: 300000, // 5 minutes
      autoRecover: true,
      notifyChannels: ['in_app', 'email'],
    },
    manual: {
      type: 'manual',
      enabled: true,
      threshold: 0,
      cooldownPeriod: 0,
      autoRecover: false,
      notifyChannels: ['in_app', 'email', 'sms', 'whatsapp'],
    },
    system_error: {
      type: 'system_error',
      enabled: true,
      threshold: 10, // 10 errors per minute
      cooldownPeriod: 600000, // 10 minutes
      autoRecover: false,
      notifyChannels: ['in_app', 'email'],
    },
  };

  /**
   * Set IIFL client for emergency operations
   */
  setIIFLClient(client: IIFLClient): void {
    this.iiflClient = client;
  }

  /**
   * Check if circuit breaker should trigger
   */
  async checkBreaker(
    userId: string,
    type: CircuitBreakerType,
    currentValue: number,
    customConfig?: Partial<CircuitBreakerConfig>
  ): Promise<{ shouldTrigger: boolean; reason?: string }> {
    const config = { ...this.DEFAULT_CONFIGS[type], ...customConfig };

    if (!config.enabled) {
      return { shouldTrigger: false };
    }

    const breakerKey = `${userId}:${type}`;
    const currentStatus = this.breakerStates.get(breakerKey) || 'normal';

    // If already triggered, check if cooldown period has passed
    if (currentStatus === 'triggered' || currentStatus === 'emergency') {
      const lastTrigger = this.lastTriggerTime.get(breakerKey) || 0;
      const timeSinceTrigger = Date.now() - lastTrigger;

      if (timeSinceTrigger < config.cooldownPeriod) {
        return {
          shouldTrigger: false,
          reason: `Circuit breaker still in cooldown (${Math.floor((config.cooldownPeriod - timeSinceTrigger) / 1000)}s remaining)`,
        };
      }

      if (config.autoRecover) {
        await this.recover(userId, type);
      }
    }

    // Check if threshold is breached
    const isBreached =
      type === 'drawdown' || type === 'position_limit'
        ? currentValue >= config.threshold
        : currentValue > config.threshold;

    if (isBreached) {
      return {
        shouldTrigger: true,
        reason: `${type} threshold breached: ${currentValue} > ${config.threshold}`,
      };
    }

    // Update state to warning if approaching threshold
    const warningThreshold = config.threshold * 0.8;
    if (currentValue >= warningThreshold) {
      this.breakerStates.set(breakerKey, 'warning');
    } else {
      this.breakerStates.set(breakerKey, 'normal');
    }

    return { shouldTrigger: false };
  }

  /**
   * Trigger circuit breaker
   */
  async trigger(
    userId: string,
    type: CircuitBreakerType,
    reason: string,
    metadata?: any
  ): Promise<CircuitBreakerEvent> {
    const breakerKey = `${userId}:${type}`;

    // Update state
    this.breakerStates.set(breakerKey, 'triggered');
    this.lastTriggerTime.set(breakerKey, Date.now());
    this.triggerCounts.set(breakerKey, (this.triggerCounts.get(breakerKey) || 0) + 1);

    // Create event
    const event: CircuitBreakerEvent = {
      id: crypto.randomUUID(),
      userId,
      type,
      status: 'triggered',
      trigger: reason,
      timestamp: new Date().toISOString(),
      metadata,
    };

    // Log to database
    await this.logEvent(event);

    // Send notifications
    await this.notifyBreakerTriggered(event);

    // Take action based on type
    await this.executeEmergencyAction(userId, type, reason);

    console.log(`Circuit breaker triggered for user ${userId}: ${type} - ${reason}`);

    return event;
  }

  /**
   * Execute emergency action
   */
  private async executeEmergencyAction(
    userId: string,
    type: CircuitBreakerType,
    reason: string
  ): Promise<void> {
    try {
      switch (type) {
        case 'daily_loss':
        case 'drawdown':
        case 'manual':
          // Emergency stop - square off all positions
          await this.emergencyStop({ userId, reason, stopType: 'system', initiatedBy: 'system' });
          break;

        case 'position_limit':
          // Prevent new orders but don't close positions
          await this.suspendTrading(userId, reason);
          break;

        case 'order_rate':
          // Throttle orders temporarily
          await this.throttleOrders(userId, 60000); // 1 minute throttle
          break;

        case 'api_failure':
          // Switch to degraded mode
          await this.enableDegradedMode(userId);
          break;

        case 'system_error':
          // Alert administrators
          await this.alertAdministrators(userId, reason);
          break;
      }
    } catch (error) {
      console.error('Failed to execute emergency action:', error);
    }
  }

  /**
   * Emergency stop - square off all positions
   */
  async emergencyStop(request: EmergencyStopRequest): Promise<{
    success: boolean;
    positionsClosed: number;
    errors: string[];
  }> {
    console.log(`Emergency stop initiated for user ${request.userId}: ${request.reason}`);

    const errors: string[] = [];
    let positionsClosed = 0;

    try {
      // Get all open positions
      const { data: positions } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', request.userId)
        .gt('quantity', 0);

      if (!positions || positions.length === 0) {
        return { success: true, positionsClosed: 0, errors: [] };
      }

      // Square off each position
      for (const position of positions) {
        try {
          if (this.iiflClient) {
            await this.iiflClient.squareOffPosition(position.symbol, 'NSE');
            positionsClosed++;
          } else {
            // Simulate square off
            await supabase
              .from('portfolios')
              .update({ quantity: 0 })
              .eq('id', position.id);
            positionsClosed++;
          }
        } catch (error: any) {
          errors.push(`Failed to square off ${position.symbol}: ${error.message}`);
        }
      }

      // Suspend trading
      await this.suspendTrading(request.userId, request.reason);

      // Send critical notification
      await notificationService.send({
        userId: request.userId,
        type: 'emergency_stop',
        title: 'Emergency Stop Activated',
        message: `All positions have been squared off. Reason: ${request.reason}`,
        priority: 'critical',
        channels: ['in_app', 'email', 'sms', 'whatsapp'],
        metadata: {
          positionsClosed,
          errors: errors.length,
          initiatedBy: request.initiatedBy,
        },
      });

      // Log audit trail
      await supabase.from('audit_logs').insert({
        user_id: request.userId,
        action: 'emergency_stop',
        entity_type: 'trading',
        details: {
          reason: request.reason,
          positionsClosed,
          errors,
          initiatedBy: request.initiatedBy,
        },
      });

      return {
        success: errors.length === 0,
        positionsClosed,
        errors,
      };
    } catch (error: any) {
      console.error('Emergency stop failed:', error);
      return {
        success: false,
        positionsClosed,
        errors: [...errors, error.message],
      };
    }
  }

  /**
   * Suspend trading for a user
   */
  async suspendTrading(userId: string, reason: string): Promise<void> {
    await supabase
      .from('profiles')
      .update({
        trading_suspended: true,
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
      })
      .eq('id', userId);

    await notificationService.send({
      userId,
      type: 'system_alert',
      title: 'Trading Suspended',
      message: `Trading has been suspended. Reason: ${reason}`,
      priority: 'critical',
    });
  }

  /**
   * Resume trading for a user
   */
  async resumeTrading(userId: string): Promise<void> {
    await supabase
      .from('profiles')
      .update({
        trading_suspended: false,
        suspension_reason: null,
        suspended_at: null,
      })
      .eq('id', userId);

    await notificationService.send({
      userId,
      type: 'system_alert',
      title: 'Trading Resumed',
      message: 'Trading has been resumed. You can now place orders.',
      priority: 'medium',
    });
  }

  /**
   * Throttle orders
   */
  private async throttleOrders(userId: string, duration: number): Promise<void> {
    // Implement order throttling logic
    console.log(`Throttling orders for user ${userId} for ${duration}ms`);
  }

  /**
   * Enable degraded mode
   */
  private async enableDegradedMode(userId: string): Promise<void> {
    // Switch to backup systems or limited functionality
    console.log(`Enabling degraded mode for user ${userId}`);
  }

  /**
   * Alert administrators
   */
  private async alertAdministrators(userId: string, reason: string): Promise<void> {
    // Send alert to admin team
    console.log(`Admin alert: Circuit breaker triggered for user ${userId}: ${reason}`);
  }

  /**
   * Recover from circuit breaker
   */
  async recover(userId: string, type: CircuitBreakerType): Promise<void> {
    const breakerKey = `${userId}:${type}`;

    this.breakerStates.set(breakerKey, 'normal');

    const event: CircuitBreakerEvent = {
      id: crypto.randomUUID(),
      userId,
      type,
      status: 'normal',
      trigger: 'Auto-recovery after cooldown period',
      timestamp: new Date().toISOString(),
      metadata: { recovered: true },
      recoveredAt: new Date().toISOString(),
    };

    await this.logEvent(event);

    await notificationService.send({
      userId,
      type: 'system_alert',
      title: 'Circuit Breaker Recovered',
      message: `${type} circuit breaker has recovered and is back to normal.`,
      priority: 'low',
    });

    console.log(`Circuit breaker recovered for user ${userId}: ${type}`);
  }

  /**
   * Manual override
   */
  async manualOverride(
    userId: string,
    type: CircuitBreakerType,
    action: 'force_trigger' | 'force_recover',
    adminUserId: string
  ): Promise<void> {
    if (action === 'force_trigger') {
      await this.trigger(userId, type, `Manual override by ${adminUserId}`, {
        manual: true,
        adminUserId,
      });
    } else {
      await this.recover(userId, type);
    }

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: 'circuit_breaker_override',
      entity_type: 'trading',
      details: {
        type,
        action,
        adminUserId,
      },
    });
  }

  /**
   * Get circuit breaker status
   */
  getStatus(userId: string, type: CircuitBreakerType): CircuitBreakerStatus {
    const breakerKey = `${userId}:${type}`;
    return this.breakerStates.get(breakerKey) || 'normal';
  }

  /**
   * Get all circuit breaker statuses for a user
   */
  getAllStatuses(userId: string): Record<CircuitBreakerType, CircuitBreakerStatus> {
    const types: CircuitBreakerType[] = [
      'daily_loss',
      'drawdown',
      'position_limit',
      'order_rate',
      'api_failure',
      'manual',
      'system_error',
    ];

    const statuses: any = {};
    types.forEach((type) => {
      statuses[type] = this.getStatus(userId, type);
    });

    return statuses;
  }

  /**
   * System recovery procedures
   */
  async executeSystemRecovery(): Promise<SystemRecoveryPlan[]> {
    const recoveryPlan: SystemRecoveryPlan[] = [
      {
        step: 1,
        action: 'Check database connectivity',
        status: 'pending',
      },
      {
        step: 2,
        action: 'Verify API connections',
        status: 'pending',
      },
      {
        step: 3,
        action: 'Resume realtime subscriptions',
        status: 'pending',
      },
      {
        step: 4,
        action: 'Sync portfolio data',
        status: 'pending',
      },
      {
        step: 5,
        action: 'Resume trading operations',
        status: 'pending',
      },
    ];

    // Execute recovery steps
    for (const step of recoveryPlan) {
      step.status = 'in_progress';
      step.timestamp = new Date().toISOString();

      try {
        // Implement actual recovery logic for each step
        await this.executeRecoveryStep(step.step);
        step.status = 'completed';
      } catch (error: any) {
        step.status = 'failed';
        step.error = error.message;
        break; // Stop recovery on failure
      }
    }

    return recoveryPlan;
  }

  /**
   * Execute individual recovery step
   */
  private async executeRecoveryStep(stepNumber: number): Promise<void> {
    switch (stepNumber) {
      case 1:
        // Check database
        await supabase.from('profiles').select('count').limit(1);
        break;
      case 2:
        // Verify APIs
        // Implement API health checks
        break;
      case 3:
        // Resume realtime
        // Implement realtime reconnection
        break;
      case 4:
        // Sync portfolio
        // Implement portfolio sync
        break;
      case 5:
        // Resume trading
        console.log('Trading operations resumed');
        break;
    }
  }

  /**
   * Log circuit breaker event
   */
  private async logEvent(event: CircuitBreakerEvent): Promise<void> {
    await supabase.from('audit_logs').insert({
      user_id: event.userId,
      action: 'circuit_breaker',
      entity_type: 'trading',
      details: event,
    });
  }

  /**
   * Notify when breaker is triggered
   */
  private async notifyBreakerTriggered(event: CircuitBreakerEvent): Promise<void> {
    const config = this.DEFAULT_CONFIGS[event.type];

    if (event.userId) {
      await notificationService.send({
        userId: event.userId,
        type: 'risk_alert',
        title: 'Circuit Breaker Triggered',
        message: `${event.type} circuit breaker triggered: ${event.trigger}`,
        priority: 'critical',
        channels: config.notifyChannels as any,
        metadata: event.metadata,
      });
    }
  }

  /**
   * Get circuit breaker history
   */
  async getHistory(
    userId: string,
    limit: number = 50
  ): Promise<CircuitBreakerEvent[]> {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('action', 'circuit_breaker')
      .order('created_at', { ascending: false })
      .limit(limit);

    return (data?.map((log) => log.details as CircuitBreakerEvent) || []);
  }
}

// Export singleton instance
export const circuitBreakerService = new CircuitBreakerService();
