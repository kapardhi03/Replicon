import { supabase } from '../supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// =====================================================
// TYPES
// =====================================================

export type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface OrderUpdate {
  id: string;
  user_id: string;
  status: string;
  filled_quantity?: number;
  average_price?: number;
  message?: string;
}

export interface PortfolioUpdate {
  id: string;
  user_id: string;
  symbol: string;
  quantity: number;
  average_price: number;
  current_price?: number;
  unrealized_pnl?: number;
}

export interface BalanceUpdate {
  id: string;
  user_id: string;
  available_balance: number;
  used_margin: number;
  total_balance: number;
}

export interface NotificationUpdate {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface TradeUpdate {
  id: string;
  user_id: string;
  order_id: string;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  executed_at: string;
}

// =====================================================
// REALTIME SERVICE
// =====================================================

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 2000; // 2 seconds

  /**
   * Subscribe to order updates for a user
   */
  subscribeToOrders(
    userId: string,
    callback: (event: RealtimeEventType, order: OrderUpdate) => void
  ): () => void {
    const channelName = `orders:${userId}`;

    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to ${channelName}`);
      return this.createUnsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const eventType = payload.eventType as RealtimeEventType;
          const order = payload.new as OrderUpdate;

          console.log(`Order ${eventType}:`, order);
          callback(eventType, order);
        }
      )
      .subscribe((status) => {
        console.log(`Orders subscription status: ${status}`);

        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts.set(channelName, 0);
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName, () =>
            this.subscribeToOrders(userId, callback)
          );
        }
      });

    this.channels.set(channelName, channel);
    return this.createUnsubscribe(channelName);
  }

  /**
   * Subscribe to portfolio updates for a user
   */
  subscribeToPortfolio(
    userId: string,
    callback: (event: RealtimeEventType, position: PortfolioUpdate) => void
  ): () => void {
    const channelName = `portfolio:${userId}`;

    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to ${channelName}`);
      return this.createUnsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolios',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const eventType = payload.eventType as RealtimeEventType;
          const position = payload.new as PortfolioUpdate;

          console.log(`Portfolio ${eventType}:`, position);
          callback(eventType, position);
        }
      )
      .subscribe((status) => {
        console.log(`Portfolio subscription status: ${status}`);

        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts.set(channelName, 0);
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName, () =>
            this.subscribeToPortfolio(userId, callback)
          );
        }
      });

    this.channels.set(channelName, channel);
    return this.createUnsubscribe(channelName);
  }

  /**
   * Subscribe to account balance updates for a user
   */
  subscribeToBalance(
    userId: string,
    callback: (event: RealtimeEventType, balance: BalanceUpdate) => void
  ): () => void {
    const channelName = `balance:${userId}`;

    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to ${channelName}`);
      return this.createUnsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'account_balances',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const eventType = payload.eventType as RealtimeEventType;
          const balance = payload.new as BalanceUpdate;

          console.log(`Balance ${eventType}:`, balance);
          callback(eventType, balance);
        }
      )
      .subscribe((status) => {
        console.log(`Balance subscription status: ${status}`);

        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts.set(channelName, 0);
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName, () =>
            this.subscribeToBalance(userId, callback)
          );
        }
      });

    this.channels.set(channelName, channel);
    return this.createUnsubscribe(channelName);
  }

  /**
   * Subscribe to notifications for a user
   */
  subscribeToNotifications(
    userId: string,
    callback: (event: RealtimeEventType, notification: NotificationUpdate) => void
  ): () => void {
    const channelName = `notifications:${userId}`;

    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to ${channelName}`);
      return this.createUnsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const eventType = payload.eventType as RealtimeEventType;
          const notification = payload.new as NotificationUpdate;

          console.log(`Notification ${eventType}:`, notification);
          callback(eventType, notification);
        }
      )
      .subscribe((status) => {
        console.log(`Notifications subscription status: ${status}`);

        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts.set(channelName, 0);
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName, () =>
            this.subscribeToNotifications(userId, callback)
          );
        }
      });

    this.channels.set(channelName, channel);
    return this.createUnsubscribe(channelName);
  }

  /**
   * Subscribe to trade executions for a user
   */
  subscribeToTrades(
    userId: string,
    callback: (event: RealtimeEventType, trade: TradeUpdate) => void
  ): () => void {
    const channelName = `trades:${userId}`;

    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to ${channelName}`);
      return this.createUnsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const trade = payload.new as TradeUpdate;

          console.log(`Trade executed:`, trade);
          callback('INSERT', trade);
        }
      )
      .subscribe((status) => {
        console.log(`Trades subscription status: ${status}`);

        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts.set(channelName, 0);
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName, () =>
            this.subscribeToTrades(userId, callback)
          );
        }
      });

    this.channels.set(channelName, channel);
    return this.createUnsubscribe(channelName);
  }

  /**
   * Subscribe to strategy performance updates
   */
  subscribeToStrategyPerformance(
    strategyId: string,
    callback: (event: RealtimeEventType, performance: any) => void
  ): () => void {
    const channelName = `strategy-performance:${strategyId}`;

    if (this.channels.has(channelName)) {
      console.warn(`Already subscribed to ${channelName}`);
      return this.createUnsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'strategy_performance',
          filter: `strategy_id=eq.${strategyId}`,
        },
        (payload) => {
          const eventType = payload.eventType as RealtimeEventType;
          const performance = payload.new;

          console.log(`Strategy performance ${eventType}:`, performance);
          callback(eventType, performance);
        }
      )
      .subscribe((status) => {
        console.log(`Strategy performance subscription status: ${status}`);

        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts.set(channelName, 0);
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName, () =>
            this.subscribeToStrategyPerformance(strategyId, callback)
          );
        }
      });

    this.channels.set(channelName, channel);
    return this.createUnsubscribe(channelName);
  }

  /**
   * Subscribe to all updates for a user (comprehensive)
   */
  subscribeToAll(
    userId: string,
    callbacks: {
      onOrder?: (event: RealtimeEventType, order: OrderUpdate) => void;
      onPortfolio?: (event: RealtimeEventType, position: PortfolioUpdate) => void;
      onBalance?: (event: RealtimeEventType, balance: BalanceUpdate) => void;
      onNotification?: (event: RealtimeEventType, notification: NotificationUpdate) => void;
      onTrade?: (event: RealtimeEventType, trade: TradeUpdate) => void;
    }
  ): () => void {
    const unsubscribers: Array<() => void> = [];

    if (callbacks.onOrder) {
      unsubscribers.push(this.subscribeToOrders(userId, callbacks.onOrder));
    }
    if (callbacks.onPortfolio) {
      unsubscribers.push(this.subscribeToPortfolio(userId, callbacks.onPortfolio));
    }
    if (callbacks.onBalance) {
      unsubscribers.push(this.subscribeToBalance(userId, callbacks.onBalance));
    }
    if (callbacks.onNotification) {
      unsubscribers.push(this.subscribeToNotifications(userId, callbacks.onNotification));
    }
    if (callbacks.onTrade) {
      unsubscribers.push(this.subscribeToTrades(userId, callbacks.onTrade));
    }

    // Return combined unsubscribe function
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }

  /**
   * Unsubscribe from a specific channel
   */
  async unsubscribe(channelName: string): Promise<void> {
    const channel = this.channels.get(channelName);

    if (channel) {
      await supabase.removeChannel(channel);
      this.channels.delete(channelName);
      this.reconnectAttempts.delete(channelName);
      console.log(`Unsubscribed from ${channelName}`);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  async unsubscribeAll(): Promise<void> {
    const channelNames = Array.from(this.channels.keys());

    for (const channelName of channelNames) {
      await this.unsubscribe(channelName);
    }

    console.log('Unsubscribed from all channels');
  }

  /**
   * Get connection status for a channel
   */
  getChannelStatus(channelName: string): string | null {
    const channel = this.channels.get(channelName);
    return channel ? channel.state : null;
  }

  /**
   * Get all active channels
   */
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(channelName: string, resubscribe: () => void): void {
    const attempts = this.reconnectAttempts.get(channelName) || 0;

    if (attempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error(`Max reconnection attempts reached for ${channelName}`);
      return;
    }

    this.reconnectAttempts.set(channelName, attempts + 1);

    const delay = this.RECONNECT_DELAY * Math.pow(2, attempts); // Exponential backoff

    console.log(
      `Reconnecting to ${channelName} in ${delay}ms (attempt ${attempts + 1}/${this.MAX_RECONNECT_ATTEMPTS})`
    );

    setTimeout(async () => {
      await this.unsubscribe(channelName);
      resubscribe();
    }, delay);
  }

  /**
   * Create unsubscribe function for a channel
   */
  private createUnsubscribe(channelName: string): () => void {
    return () => {
      this.unsubscribe(channelName);
    };
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
