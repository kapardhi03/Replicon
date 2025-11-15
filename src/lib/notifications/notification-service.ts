import { supabase } from '../supabase';
import axios from 'axios';

// =====================================================
// TYPES
// =====================================================

export type NotificationType =
  | 'order_filled'
  | 'order_rejected'
  | 'order_partially_filled'
  | 'position_closed'
  | 'risk_alert'
  | 'daily_loss_limit'
  | 'drawdown_alert'
  | 'strategy_subscribed'
  | 'strategy_unsubscribed'
  | 'payment_success'
  | 'payment_failed'
  | 'subscription_renewed'
  | 'subscription_expired'
  | 'kyc_approved'
  | 'kyc_rejected'
  | 'emergency_stop'
  | 'system_alert'
  | 'general';

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'whatsapp' | 'push';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface NotificationPreferences {
  userId: string;
  in_app: boolean;
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
  // Specific notification type preferences
  order_updates: boolean;
  risk_alerts: boolean;
  payment_updates: boolean;
  system_alerts: boolean;
  marketing: boolean;
}

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
}

export interface SendNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  metadata?: Record<string, any>;
}

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SMSNotification {
  to: string;
  message: string;
}

export interface WhatsAppNotification {
  to: string;
  message: string;
}

// =====================================================
// NOTIFICATION TEMPLATES
// =====================================================

const NOTIFICATION_TEMPLATES: Record<NotificationType, Partial<NotificationTemplate>> = {
  order_filled: {
    title: 'Order Filled',
    message: 'Your {{orderType}} order for {{symbol}} has been filled at ₹{{price}}',
    priority: 'medium',
    channels: ['in_app', 'email'],
  },
  order_rejected: {
    title: 'Order Rejected',
    message: 'Your order for {{symbol}} was rejected: {{reason}}',
    priority: 'high',
    channels: ['in_app', 'email', 'sms'],
  },
  order_partially_filled: {
    title: 'Order Partially Filled',
    message: 'Your order for {{symbol}} was partially filled: {{filledQty}}/{{totalQty}}',
    priority: 'medium',
    channels: ['in_app'],
  },
  position_closed: {
    title: 'Position Closed',
    message: 'Your position in {{symbol}} has been closed with P&L: ₹{{pnl}}',
    priority: 'medium',
    channels: ['in_app', 'email'],
  },
  risk_alert: {
    title: 'Risk Alert',
    message: 'Risk threshold reached: {{alertType}}',
    priority: 'high',
    channels: ['in_app', 'email', 'sms'],
  },
  daily_loss_limit: {
    title: 'Daily Loss Limit Reached',
    message: 'Daily loss limit of ₹{{limit}} has been reached. Trading suspended.',
    priority: 'critical',
    channels: ['in_app', 'email', 'sms', 'whatsapp'],
  },
  drawdown_alert: {
    title: 'Drawdown Alert',
    message: 'Portfolio drawdown of {{percentage}}% detected. Current drawdown: {{amount}}',
    priority: 'critical',
    channels: ['in_app', 'email', 'sms'],
  },
  strategy_subscribed: {
    title: 'Strategy Subscription Confirmed',
    message: 'You have successfully subscribed to {{strategyName}}',
    priority: 'low',
    channels: ['in_app', 'email'],
  },
  strategy_unsubscribed: {
    title: 'Strategy Unsubscribed',
    message: 'You have unsubscribed from {{strategyName}}',
    priority: 'low',
    channels: ['in_app', 'email'],
  },
  payment_success: {
    title: 'Payment Successful',
    message: 'Your payment of ₹{{amount}} was processed successfully',
    priority: 'medium',
    channels: ['in_app', 'email'],
  },
  payment_failed: {
    title: 'Payment Failed',
    message: 'Your payment of ₹{{amount}} failed: {{reason}}',
    priority: 'high',
    channels: ['in_app', 'email', 'sms'],
  },
  subscription_renewed: {
    title: 'Subscription Renewed',
    message: 'Your {{planName}} subscription has been renewed',
    priority: 'low',
    channels: ['in_app', 'email'],
  },
  subscription_expired: {
    title: 'Subscription Expired',
    message: 'Your {{planName}} subscription has expired. Renew now to continue.',
    priority: 'high',
    channels: ['in_app', 'email', 'sms'],
  },
  kyc_approved: {
    title: 'KYC Approved',
    message: 'Your KYC verification has been approved. You can now start trading.',
    priority: 'medium',
    channels: ['in_app', 'email', 'sms'],
  },
  kyc_rejected: {
    title: 'KYC Rejected',
    message: 'Your KYC verification was rejected: {{reason}}. Please resubmit.',
    priority: 'high',
    channels: ['in_app', 'email'],
  },
  emergency_stop: {
    title: 'Emergency Stop Activated',
    message: 'Emergency stop has been activated: {{reason}}',
    priority: 'critical',
    channels: ['in_app', 'email', 'sms', 'whatsapp'],
  },
  system_alert: {
    title: 'System Alert',
    message: '{{message}}',
    priority: 'high',
    channels: ['in_app', 'email'],
  },
  general: {
    title: 'Notification',
    message: '{{message}}',
    priority: 'low',
    channels: ['in_app'],
  },
};

// =====================================================
// NOTIFICATION SERVICE
// =====================================================

class NotificationService {
  private readonly TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  private readonly TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  private readonly TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER;
  private readonly TWILIO_WHATSAPP_NUMBER = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER;
  private readonly RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
  private readonly FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || 'noreply@replicon.app';

  /**
   * Send notification through multiple channels
   */
  async send(request: SendNotificationRequest): Promise<{
    success: boolean;
    deliveryStatus: Record<NotificationChannel, boolean>;
  }> {
    try {
      const template = NOTIFICATION_TEMPLATES[request.type];
      const priority = request.priority || template.priority || 'medium';
      const channels = request.channels || template.channels || ['in_app'];

      // Get user preferences
      const preferences = await this.getUserPreferences(request.userId);

      // Filter channels based on user preferences
      const enabledChannels = channels.filter((channel) =>
        this.isChannelEnabled(channel, request.type, preferences)
      );

      // Get user contact info
      const userInfo = await this.getUserContactInfo(request.userId);

      // Send through each enabled channel
      const deliveryStatus: Record<NotificationChannel, boolean> = {
        in_app: false,
        email: false,
        sms: false,
        whatsapp: false,
        push: false,
      };

      const deliveryPromises = enabledChannels.map(async (channel) => {
        try {
          let success = false;

          switch (channel) {
            case 'in_app':
              success = await this.sendInApp(request);
              break;
            case 'email':
              if (userInfo.email) {
                success = await this.sendEmail({
                  to: userInfo.email,
                  subject: request.title,
                  html: this.generateEmailHTML(request),
                  text: request.message,
                });
              }
              break;
            case 'sms':
              if (userInfo.phone) {
                success = await this.sendSMS({
                  to: userInfo.phone,
                  message: `${request.title}: ${request.message}`,
                });
              }
              break;
            case 'whatsapp':
              if (userInfo.phone) {
                success = await this.sendWhatsApp({
                  to: userInfo.phone,
                  message: `*${request.title}*\n\n${request.message}`,
                });
              }
              break;
            case 'push':
              // Future implementation for PWA push notifications
              success = false;
              break;
          }

          deliveryStatus[channel] = success;
        } catch (error) {
          console.error(`Failed to send ${channel} notification:`, error);
          deliveryStatus[channel] = false;
        }
      });

      await Promise.allSettled(deliveryPromises);

      // Track delivery status
      await this.trackDelivery(request.userId, request.type, deliveryStatus);

      return {
        success: Object.values(deliveryStatus).some((status) => status),
        deliveryStatus,
      };
    } catch (error) {
      console.error('Failed to send notification:', error);
      return {
        success: false,
        deliveryStatus: {
          in_app: false,
          email: false,
          sms: false,
          whatsapp: false,
          push: false,
        },
      };
    }
  }

  /**
   * Send in-app notification (stored in database)
   */
  private async sendInApp(request: SendNotificationRequest): Promise<boolean> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: request.userId,
        type: request.type,
        title: request.title,
        message: request.message,
        priority: request.priority || 'medium',
        metadata: request.metadata || {},
        is_read: false,
      });

      return !error;
    } catch (error) {
      console.error('Failed to send in-app notification:', error);
      return false;
    }
  }

  /**
   * Send email notification using Resend
   */
  private async sendEmail(notification: EmailNotification): Promise<boolean> {
    if (!this.RESEND_API_KEY) {
      console.warn('Resend API key not configured');
      return false;
    }

    try {
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: this.FROM_EMAIL,
          to: notification.to,
          subject: notification.subject,
          html: notification.html,
          text: notification.text,
        },
        {
          headers: {
            Authorization: `Bearer ${this.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send SMS notification using Twilio
   */
  private async sendSMS(notification: SMSNotification): Promise<boolean> {
    if (!this.TWILIO_ACCOUNT_SID || !this.TWILIO_AUTH_TOKEN) {
      console.warn('Twilio credentials not configured');
      return false;
    }

    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.TWILIO_ACCOUNT_SID}/Messages.json`,
        new URLSearchParams({
          To: notification.to,
          From: this.TWILIO_PHONE_NUMBER,
          Body: notification.message,
        }),
        {
          auth: {
            username: this.TWILIO_ACCOUNT_SID,
            password: this.TWILIO_AUTH_TOKEN,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.status === 201;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  /**
   * Send WhatsApp notification using Twilio
   */
  private async sendWhatsApp(notification: WhatsAppNotification): Promise<boolean> {
    if (!this.TWILIO_ACCOUNT_SID || !this.TWILIO_AUTH_TOKEN) {
      console.warn('Twilio credentials not configured');
      return false;
    }

    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.TWILIO_ACCOUNT_SID}/Messages.json`,
        new URLSearchParams({
          To: `whatsapp:${notification.to}`,
          From: `whatsapp:${this.TWILIO_WHATSAPP_NUMBER}`,
          Body: notification.message,
        }),
        {
          auth: {
            username: this.TWILIO_ACCOUNT_SID,
            password: this.TWILIO_AUTH_TOKEN,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.status === 201;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      return false;
    }
  }

  /**
   * Get user notification preferences
   */
  private async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('profiles')
      .select('notification_preferences')
      .eq('id', userId)
      .single();

    if (error || !data?.notification_preferences) {
      // Return default preferences
      return {
        userId,
        in_app: true,
        email: true,
        sms: false,
        whatsapp: false,
        push: false,
        order_updates: true,
        risk_alerts: true,
        payment_updates: true,
        system_alerts: true,
        marketing: false,
      };
    }

    return data.notification_preferences as NotificationPreferences;
  }

  /**
   * Get user contact information
   */
  private async getUserContactInfo(
    userId: string
  ): Promise<{ email?: string; phone?: string }> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', userId)
      .single();

    const { data: authUser } = await supabase.auth.getUser();

    return {
      email: authUser.user?.email,
      phone: profile?.phone,
    };
  }

  /**
   * Check if channel is enabled based on preferences
   */
  private isChannelEnabled(
    channel: NotificationChannel,
    type: NotificationType,
    preferences: NotificationPreferences
  ): boolean {
    // Check if channel is globally enabled
    if (!preferences[channel]) {
      return false;
    }

    // Check type-specific preferences
    if (
      type.includes('order') &&
      preferences.order_updates !== undefined &&
      !preferences.order_updates
    ) {
      return false;
    }

    if (
      (type.includes('risk') || type.includes('drawdown') || type.includes('loss')) &&
      preferences.risk_alerts !== undefined &&
      !preferences.risk_alerts
    ) {
      return false;
    }

    if (
      (type.includes('payment') || type.includes('subscription')) &&
      preferences.payment_updates !== undefined &&
      !preferences.payment_updates
    ) {
      return false;
    }

    if (
      type.includes('system') &&
      preferences.system_alerts !== undefined &&
      !preferences.system_alerts
    ) {
      return false;
    }

    return true;
  }

  /**
   * Generate HTML email template
   */
  private generateEmailHTML(request: SendNotificationRequest): string {
    const priorityColor = {
      low: '#3b82f6',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626',
    };

    const color = priorityColor[request.priority || 'medium'];

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${request.title}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Replicon</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${color};">
      <h2 style="color: ${color}; margin-top: 0;">${request.title}</h2>
      <p style="font-size: 16px; margin: 20px 0;">${request.message}</p>

      ${
        request.metadata
          ? `
      <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 20px;">
        <h3 style="margin-top: 0; font-size: 14px; color: #6b7280;">Additional Details:</h3>
        ${Object.entries(request.metadata)
          .map(
            ([key, value]) =>
              `<p style="margin: 5px 0; font-size: 14px;"><strong>${key}:</strong> ${value}</p>`
          )
          .join('')}
      </div>
      `
          : ''
      }
    </div>

    <div style="margin-top: 30px; text-align: center;">
      <a href="${import.meta.env.VITE_APP_URL || 'https://replicon.app'}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">
        Open Replicon
      </a>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
      <p>This is an automated notification from Replicon.</p>
      <p>To manage your notification preferences, visit your account settings.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Track notification delivery status
   */
  private async trackDelivery(
    userId: string,
    type: NotificationType,
    deliveryStatus: Record<NotificationChannel, boolean>
  ): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'notification_sent',
        entity_type: 'notification',
        details: {
          notification_type: type,
          delivery_status: deliveryStatus,
        },
      });
    } catch (error) {
      console.error('Failed to track notification delivery:', error);
    }
  }

  /**
   * Update user notification preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: preferences,
        })
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await supabase.from('notifications').delete().eq('id', notificationId);
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    limit: number = 50,
    unreadOnly: boolean = false
  ): Promise<any[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Send bulk notifications
   */
  async sendBulk(requests: SendNotificationRequest[]): Promise<void> {
    const promises = requests.map((request) => this.send(request));
    await Promise.allSettled(promises);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
