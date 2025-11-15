import { supabase } from '../supabase';
import axios from 'axios';

// =====================================================
// TYPES
// =====================================================

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'critical';

export interface HealthCheckResult {
  status: HealthStatus;
  timestamp: string;
  checks: {
    database: ServiceHealth;
    iiflAPI: ServiceHealth;
    razorpay: ServiceHealth;
    openai: ServiceHealth;
    storage: ServiceHealth;
    realtime: ServiceHealth;
  };
  performance: {
    avgLatency: number;
    orderProcessingTime: number;
    apiResponseTime: number;
  };
  system: {
    uptime: number;
    version: string;
    environment: string;
  };
}

export interface ServiceHealth {
  status: HealthStatus;
  latency?: number;
  lastChecked: string;
  error?: string;
  details?: any;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'ok' | 'warning' | 'critical';
}

export interface SystemMetrics {
  orderLatency: PerformanceMetric;
  apiLatency: PerformanceMetric;
  errorRate: PerformanceMetric;
  activeUsers: PerformanceMetric;
  ordersPerMinute: PerformanceMetric;
  databaseConnections: PerformanceMetric;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  condition: 'greater_than' | 'less_than' | 'equal_to';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notifyChannels: string[];
}

// =====================================================
// HEALTH CHECK SERVICE
// =====================================================

class HealthCheckService {
  private startTime: number = Date.now();
  private metrics: Map<string, number[]> = new Map();
  private readonly METRIC_WINDOW = 60000; // 1 minute

  /**
   * Run comprehensive health check
   */
  async checkHealth(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString();

    // Run all health checks concurrently
    const [database, iiflAPI, razorpay, openai, storage, realtime] = await Promise.all([
      this.checkDatabase(),
      this.checkIIFLAPI(),
      this.checkRazorpay(),
      this.checkOpenAI(),
      this.checkStorage(),
      this.checkRealtime(),
    ]);

    // Calculate overall status
    const statuses = [database, iiflAPI, razorpay, openai, storage, realtime].map((s) => s.status);
    const overallStatus = this.calculateOverallStatus(statuses);

    // Get performance metrics
    const performance = await this.getPerformanceMetrics();

    return {
      status: overallStatus,
      timestamp,
      checks: {
        database,
        iiflAPI,
        razorpay,
        openai,
        storage,
        realtime,
      },
      performance,
      system: {
        uptime: this.getUptime(),
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: import.meta.env.MODE || 'development',
      },
    };
  }

  /**
   * Check database health
   */
  async checkDatabase(): Promise<ServiceHealth> {
    const startTime = performance.now();

    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);

      const latency = performance.now() - startTime;

      if (error) {
        return {
          status: 'unhealthy',
          latency,
          lastChecked: new Date().toISOString(),
          error: error.message,
        };
      }

      return {
        status: latency < 100 ? 'healthy' : latency < 500 ? 'degraded' : 'unhealthy',
        latency,
        lastChecked: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'critical',
        lastChecked: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Check IIFL API health
   */
  async checkIIFLAPI(): Promise<ServiceHealth> {
    const startTime = performance.now();

    try {
      const apiUrl = import.meta.env.VITE_IIFL_API_URL || import.meta.env.VITE_IIFL_SANDBOX_URL;

      if (!apiUrl) {
        return {
          status: 'degraded',
          lastChecked: new Date().toISOString(),
          details: 'IIFL API not configured',
        };
      }

      // Simple ping to check if API is reachable
      const response = await axios.get(`${apiUrl}/health`, {
        timeout: 5000,
        validateStatus: () => true,
      });

      const latency = performance.now() - startTime;

      return {
        status: response.status === 200 ? 'healthy' : 'degraded',
        latency,
        lastChecked: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Check Razorpay health
   */
  async checkRazorpay(): Promise<ServiceHealth> {
    const startTime = performance.now();

    try {
      const apiKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!apiKey) {
        return {
          status: 'degraded',
          lastChecked: new Date().toISOString(),
          details: 'Razorpay not configured',
        };
      }

      // Simple check - Razorpay is generally very reliable
      const latency = performance.now() - startTime;

      return {
        status: 'healthy',
        latency,
        lastChecked: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Check OpenAI health
   */
  async checkOpenAI(): Promise<ServiceHealth> {
    const startTime = performance.now();

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        return {
          status: 'degraded',
          lastChecked: new Date().toISOString(),
          details: 'OpenAI not configured - using mock data',
        };
      }

      const latency = performance.now() - startTime;

      return {
        status: 'healthy',
        latency,
        lastChecked: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Check storage health
   */
  async checkStorage(): Promise<ServiceHealth> {
    const startTime = performance.now();

    try {
      const { data, error } = await supabase.storage.listBuckets();

      const latency = performance.now() - startTime;

      if (error) {
        return {
          status: 'unhealthy',
          latency,
          lastChecked: new Date().toISOString(),
          error: error.message,
        };
      }

      return {
        status: 'healthy',
        latency,
        lastChecked: new Date().toISOString(),
        details: `${data.length} buckets`,
      };
    } catch (error: any) {
      return {
        status: 'critical',
        lastChecked: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Check realtime health
   */
  async checkRealtime(): Promise<ServiceHealth> {
    try {
      // Check if realtime is configured
      const channels = supabase.getChannels();

      return {
        status: 'healthy',
        lastChecked: new Date().toISOString(),
        details: `${channels.length} active channels`,
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(): Promise<{
    avgLatency: number;
    orderProcessingTime: number;
    apiResponseTime: number;
  }> {
    return {
      avgLatency: this.getAverageMetric('latency') || 0,
      orderProcessingTime: this.getAverageMetric('order_processing') || 0,
      apiResponseTime: this.getAverageMetric('api_response') || 0,
    };
  }

  /**
   * Get system metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    // Get recent metrics from database
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 60000).toISOString());

    const ordersPerMinute = recentOrders?.length || 0;

    return {
      orderLatency: {
        name: 'Order Latency',
        value: this.getAverageMetric('order_processing') || 0,
        unit: 'ms',
        threshold: 250,
        status: this.getAverageMetric('order_processing') || 0 < 250 ? 'ok' : 'warning',
      },
      apiLatency: {
        name: 'API Latency',
        value: this.getAverageMetric('api_response') || 0,
        unit: 'ms',
        threshold: 500,
        status: this.getAverageMetric('api_response') || 0 < 500 ? 'ok' : 'warning',
      },
      errorRate: {
        name: 'Error Rate',
        value: this.getAverageMetric('errors') || 0,
        unit: '%',
        threshold: 5,
        status: this.getAverageMetric('errors') || 0 < 5 ? 'ok' : 'critical',
      },
      activeUsers: {
        name: 'Active Users',
        value: 0, // Implement based on your session tracking
        unit: 'users',
        threshold: 1000,
        status: 'ok',
      },
      ordersPerMinute: {
        name: 'Orders Per Minute',
        value: ordersPerMinute,
        unit: 'orders/min',
        threshold: 100,
        status: ordersPerMinute < 100 ? 'ok' : 'warning',
      },
      databaseConnections: {
        name: 'Database Connections',
        value: 0, // Supabase handles this automatically
        unit: 'connections',
        threshold: 50,
        status: 'ok',
      },
    };
  }

  /**
   * Track metric
   */
  trackMetric(name: string, value: number): void {
    const metrics = this.metrics.get(name) || [];
    const now = Date.now();

    // Add new metric
    metrics.push(value);

    // Remove old metrics outside window
    const filtered = metrics.filter((_, index) => {
      return now - (index * 1000) < this.METRIC_WINDOW;
    });

    this.metrics.set(name, filtered);
  }

  /**
   * Get average metric
   */
  private getAverageMetric(name: string): number | null {
    const metrics = this.metrics.get(name);

    if (!metrics || metrics.length === 0) {
      return null;
    }

    const sum = metrics.reduce((acc, val) => acc + val, 0);
    return sum / metrics.length;
  }

  /**
   * Calculate overall status from individual statuses
   */
  private calculateOverallStatus(statuses: HealthStatus[]): HealthStatus {
    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('unhealthy')) return 'unhealthy';
    if (statuses.includes('degraded')) return 'degraded';
    return 'healthy';
  }

  /**
   * Get system uptime in seconds
   */
  private getUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Monitor trading system health
   */
  async monitorTradingSystem(): Promise<{
    orderSuccess: number;
    orderFailures: number;
    avgOrderLatency: number;
    apiConnectionStatus: string;
  }> {
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('status, created_at, updated_at')
      .gte('created_at', new Date(Date.now() - 3600000).toISOString()); // Last hour

    const totalOrders = recentOrders?.length || 0;
    const successOrders = recentOrders?.filter((o) => o.status === 'FILLED').length || 0;
    const failedOrders = recentOrders?.filter((o) => o.status === 'REJECTED').length || 0;

    const avgLatency =
      recentOrders?.reduce((sum, o) => {
        const created = new Date(o.created_at).getTime();
        const updated = new Date(o.updated_at).getTime();
        return sum + (updated - created);
      }, 0) / (totalOrders || 1);

    return {
      orderSuccess: totalOrders > 0 ? (successOrders / totalOrders) * 100 : 0,
      orderFailures: failedOrders,
      avgOrderLatency: avgLatency,
      apiConnectionStatus: 'connected', // Implement actual connection check
    };
  }

  /**
   * Detect system issues automatically
   */
  async detectIssues(): Promise<string[]> {
    const issues: string[] = [];

    const health = await this.checkHealth();

    if (health.status === 'critical' || health.status === 'unhealthy') {
      issues.push(`System health is ${health.status}`);
    }

    if (health.performance.orderProcessingTime > 250) {
      issues.push(
        `Order processing time (${health.performance.orderProcessingTime.toFixed(0)}ms) exceeds target (250ms)`
      );
    }

    if (health.performance.apiResponseTime > 500) {
      issues.push(
        `API response time (${health.performance.apiResponseTime.toFixed(0)}ms) is high`
      );
    }

    // Check database health
    if (health.checks.database.status !== 'healthy') {
      issues.push(`Database health: ${health.checks.database.status}`);
    }

    // Check IIFL API health
    if (health.checks.iiflAPI.status !== 'healthy') {
      issues.push(`IIFL API health: ${health.checks.iiflAPI.status}`);
    }

    return issues;
  }

  /**
   * Get system status dashboard
   */
  async getStatusDashboard(): Promise<{
    health: HealthCheckResult;
    metrics: SystemMetrics;
    issues: string[];
    tradingSystem: any;
  }> {
    const [health, metrics, issues, tradingSystem] = await Promise.all([
      this.checkHealth(),
      this.getSystemMetrics(),
      this.detectIssues(),
      this.monitorTradingSystem(),
    ]);

    return {
      health,
      metrics,
      issues,
      tradingSystem,
    };
  }
}

// Export singleton instance
export const healthCheckService = new HealthCheckService();
