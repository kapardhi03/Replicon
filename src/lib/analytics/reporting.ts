import { supabase } from '../supabase';
import { performanceAnalytics } from './performance';

// =====================================================
// TYPES
// =====================================================

export type ReportType = 'performance' | 'risk' | 'compliance' | 'tax' | 'custom';
export type ReportFormat = 'pdf' | 'csv' | 'excel' | 'json';
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

export interface PerformanceReport {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    totalPnL: number;
    realizedPnL: number;
    unrealizedPnL: number;
    returnPercent: number;
  };
  metrics: {
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    maxDrawdownPercent: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    averageHoldingPeriod: number;
  };
  tradingActivity: {
    avgTradesPerDay: number;
    mostActiveDays: Array<{ date: string; trades: number }>;
    tradingByTime: Record<string, number>;
  };
  symbolPerformance: Array<{
    symbol: string;
    trades: number;
    pnl: number;
    winRate: number;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    trades: number;
    pnl: number;
    winRate: number;
  }>;
}

export interface RiskReport {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  currentRisk: {
    exposure: number;
    marginUsed: number;
    marginAvailable: number;
    utilizationPercent: number;
    openPositions: number;
    portfolioValue: number;
  };
  riskMetrics: {
    valueAtRisk95: number;
    valueAtRisk99: number;
    expectedShortfall: number;
    beta: number;
    correlation: number;
    volatility: number;
  };
  riskEvents: Array<{
    date: string;
    event: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impact: string;
  }>;
  limitBreaches: Array<{
    date: string;
    limit: string;
    actual: number;
    threshold: number;
  }>;
  recommendations: string[];
}

export interface ComplianceReport {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  kycStatus: {
    verified: boolean;
    documents: string[];
    lastVerified: string;
  };
  tradingActivity: {
    totalOrders: number;
    totalVolume: number;
    largestOrder: number;
    frequentSymbols: string[];
  };
  ruleViolations: Array<{
    date: string;
    rule: string;
    description: string;
    action: string;
  }>;
  auditTrail: Array<{
    timestamp: string;
    action: string;
    entity: string;
    details: string;
  }>;
}

export interface TaxReport {
  userId: string;
  financialYear: string;
  shortTermGains: {
    totalGains: number;
    totalLosses: number;
    netGains: number;
    taxableAmount: number;
  };
  longTermGains: {
    totalGains: number;
    totalLosses: number;
    netGains: number;
    taxableAmount: number;
  };
  dividendIncome: number;
  interestIncome: number;
  transactionCharges: number;
  totalTax: number;
  tradeDetails: Array<{
    symbol: string;
    buyDate: string;
    sellDate: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    gainLoss: number;
    type: 'short_term' | 'long_term';
  }>;
}

// =====================================================
// REPORTING SERVICE
// =====================================================

class ReportingService {
  /**
   * Generate comprehensive performance report
   */
  async generatePerformanceReport(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceReport> {
    try {
      // Get trades for the period
      const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .gte('executed_at', startDate.toISOString())
        .lte('executed_at', endDate.toISOString())
        .order('executed_at', { ascending: true });

      if (!trades || trades.length === 0) {
        return this.getEmptyPerformanceReport(userId, startDate, endDate);
      }

      // Calculate summary metrics
      const summary = await this.calculateSummary(userId, trades);

      // Calculate performance metrics
      const metrics = await performanceAnalytics.calculatePerformanceMetrics(
        userId,
        startDate,
        endDate
      );

      // Calculate trading activity
      const tradingActivity = this.calculateTradingActivity(trades);

      // Calculate symbol performance
      const symbolPerformance = this.calculateSymbolPerformance(trades);

      // Calculate monthly breakdown
      const monthlyBreakdown = this.calculateMonthlyBreakdown(trades);

      return {
        userId,
        period: { start: startDate, end: endDate },
        summary,
        metrics,
        tradingActivity,
        symbolPerformance,
        monthlyBreakdown,
      };
    } catch (error) {
      console.error('Failed to generate performance report:', error);
      throw error;
    }
  }

  /**
   * Generate risk report
   */
  async generateRiskReport(userId: string, startDate: Date, endDate: Date): Promise<RiskReport> {
    try {
      // Get current portfolio
      const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId);

      // Get account balance
      const { data: balance } = await supabase
        .from('account_balances')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Calculate current risk
      const currentRisk = this.calculateCurrentRisk(portfolio || [], balance);

      // Calculate risk metrics
      const riskMetrics = await this.calculateRiskMetrics(userId, portfolio || []);

      // Get risk events
      const riskEvents = await this.getRiskEvents(userId, startDate, endDate);

      // Get limit breaches
      const limitBreaches = await this.getLimitBreaches(userId, startDate, endDate);

      // Generate recommendations
      const recommendations = this.generateRiskRecommendations(currentRisk, riskMetrics);

      return {
        userId,
        period: { start: startDate, end: endDate },
        currentRisk,
        riskMetrics,
        riskEvents,
        limitBreaches,
        recommendations,
      };
    } catch (error) {
      console.error('Failed to generate risk report:', error);
      throw error;
    }
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ComplianceReport> {
    try {
      // Get KYC status
      const { data: kyc } = await supabase
        .from('user_kyc')
        .select('*')
        .eq('user_id', userId)
        .single();

      const kycStatus = {
        verified: kyc?.verification_status === 'approved',
        documents: kyc ? [kyc.document_type] : [],
        lastVerified: kyc?.verified_at || 'Not verified',
      };

      // Get trading activity
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      const tradingActivity = this.calculateTradingActivity(orders || []);

      // Get rule violations (from audit logs)
      const ruleViolations: any[] = []; // Implement based on your compliance rules

      // Get audit trail
      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      const auditTrail =
        auditLogs?.map((log) => ({
          timestamp: log.created_at,
          action: log.action,
          entity: log.entity_type,
          details: JSON.stringify(log.details),
        })) || [];

      return {
        userId,
        period: { start: startDate, end: endDate },
        kycStatus,
        tradingActivity: {
          totalOrders: orders?.length || 0,
          totalVolume: orders?.reduce((sum, o) => sum + o.quantity, 0) || 0,
          largestOrder: Math.max(...(orders?.map((o) => o.quantity) || [0])),
          frequentSymbols: this.getFrequentSymbols(orders || []),
        },
        ruleViolations,
        auditTrail,
      };
    } catch (error) {
      console.error('Failed to generate compliance report:', error);
      throw error;
    }
  }

  /**
   * Generate tax report
   */
  async generateTaxReport(userId: string, financialYear: string): Promise<TaxReport> {
    try {
      // Financial year: April 1 to March 31
      const [year] = financialYear.split('-');
      const startDate = new Date(`${year}-04-01`);
      const endDate = new Date(`${parseInt(year) + 1}-03-31`);

      // Get all closed positions
      const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .gte('executed_at', startDate.toISOString())
        .lte('executed_at', endDate.toISOString());

      if (!trades || trades.length === 0) {
        return this.getEmptyTaxReport(userId, financialYear);
      }

      // Calculate capital gains
      const { shortTerm, longTerm, tradeDetails } = this.calculateCapitalGains(trades);

      // Tax rates for India (as of 2024)
      const SHORT_TERM_TAX_RATE = 0.15; // 15% for equity
      const LONG_TERM_TAX_RATE = 0.1; // 10% above ₹1 lakh

      const shortTermTax = Math.max(0, shortTerm.netGains * SHORT_TERM_TAX_RATE);
      const longTermTax = Math.max(
        0,
        (longTerm.netGains - 100000) * LONG_TERM_TAX_RATE
      ); // ₹1 lakh exemption

      return {
        userId,
        financialYear,
        shortTermGains: {
          ...shortTerm,
          taxableAmount: shortTermTax,
        },
        longTermGains: {
          ...longTerm,
          taxableAmount: longTermTax,
        },
        dividendIncome: 0, // Implement if tracking dividends
        interestIncome: 0, // Implement if tracking interest
        transactionCharges: this.calculateTransactionCharges(trades),
        totalTax: shortTermTax + longTermTax,
        tradeDetails,
      };
    } catch (error) {
      console.error('Failed to generate tax report:', error);
      throw error;
    }
  }

  /**
   * Export report to different formats
   */
  async exportReport(
    report: any,
    format: ReportFormat
  ): Promise<{ data: string | Blob; filename: string }> {
    const timestamp = new Date().toISOString().split('T')[0];

    switch (format) {
      case 'json':
        return {
          data: JSON.stringify(report, null, 2),
          filename: `report-${timestamp}.json`,
        };

      case 'csv':
        return {
          data: this.convertToCSV(report),
          filename: `report-${timestamp}.csv`,
        };

      case 'pdf':
        // Implement PDF generation (could use jsPDF or similar)
        throw new Error('PDF export not yet implemented');

      case 'excel':
        // Implement Excel generation (could use exceljs or similar)
        throw new Error('Excel export not yet implemented');

      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  // =====================================================
  // PRIVATE HELPER METHODS
  // =====================================================

  private async calculateSummary(userId: string, trades: any[]) {
    const pnl = await performanceAnalytics.calculateUserPnL(userId);

    const winningTrades = trades.filter((t) => t.pnl > 0).length;
    const losingTrades = trades.filter((t) => t.pnl < 0).length;
    const totalTrades = trades.length;

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
      totalPnL: pnl.total,
      realizedPnL: pnl.realized,
      unrealizedPnL: pnl.unrealized,
      returnPercent: pnl.returnPercent || 0,
    };
  }

  private calculateTradingActivity(trades: any[]) {
    const dateMap = new Map<string, number>();

    trades.forEach((trade) => {
      const date = new Date(trade.executed_at || trade.created_at).toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    const totalDays = dateMap.size || 1;
    const avgTradesPerDay = trades.length / totalDays;

    const mostActiveDays = Array.from(dateMap.entries())
      .map(([date, trades]) => ({ date, trades }))
      .sort((a, b) => b.trades - a.trades)
      .slice(0, 5);

    // Trading by time of day
    const tradingByTime: Record<string, number> = {
      '09:00-11:00': 0,
      '11:00-13:00': 0,
      '13:00-15:00': 0,
      '15:00-15:30': 0,
    };

    trades.forEach((trade) => {
      const hour = new Date(trade.executed_at || trade.created_at).getHours();
      if (hour >= 9 && hour < 11) tradingByTime['09:00-11:00']++;
      else if (hour >= 11 && hour < 13) tradingByTime['11:00-13:00']++;
      else if (hour >= 13 && hour < 15) tradingByTime['13:00-15:00']++;
      else if (hour >= 15) tradingByTime['15:00-15:30']++;
    });

    return {
      avgTradesPerDay,
      mostActiveDays,
      tradingByTime,
    };
  }

  private calculateSymbolPerformance(trades: any[]) {
    const symbolMap = new Map<string, { trades: number; pnl: number; wins: number }>();

    trades.forEach((trade) => {
      const symbol = trade.symbol;
      const current = symbolMap.get(symbol) || { trades: 0, pnl: 0, wins: 0 };

      symbolMap.set(symbol, {
        trades: current.trades + 1,
        pnl: current.pnl + (trade.pnl || 0),
        wins: current.wins + (trade.pnl > 0 ? 1 : 0),
      });
    });

    return Array.from(symbolMap.entries())
      .map(([symbol, data]) => ({
        symbol,
        trades: data.trades,
        pnl: data.pnl,
        winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0,
      }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 10);
  }

  private calculateMonthlyBreakdown(trades: any[]) {
    const monthMap = new Map<string, { trades: number; pnl: number; wins: number }>();

    trades.forEach((trade) => {
      const month = new Date(trade.executed_at || trade.created_at)
        .toISOString()
        .substring(0, 7);
      const current = monthMap.get(month) || { trades: 0, pnl: 0, wins: 0 };

      monthMap.set(month, {
        trades: current.trades + 1,
        pnl: current.pnl + (trade.pnl || 0),
        wins: current.wins + (trade.pnl > 0 ? 1 : 0),
      });
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        trades: data.trades,
        pnl: data.pnl,
        winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private calculateCurrentRisk(portfolio: any[], balance: any) {
    const exposure = portfolio.reduce(
      (sum, p) => sum + p.quantity * (p.current_price || p.average_price),
      0
    );

    const marginUsed = balance?.used_margin || 0;
    const totalBalance = balance?.total_balance || 0;
    const marginAvailable = totalBalance - marginUsed;

    return {
      exposure,
      marginUsed,
      marginAvailable,
      utilizationPercent: totalBalance > 0 ? (marginUsed / totalBalance) * 100 : 0,
      openPositions: portfolio.length,
      portfolioValue: totalBalance,
    };
  }

  private async calculateRiskMetrics(userId: string, portfolio: any[]) {
    // Simplified risk metrics - implement full calculations as needed
    return {
      valueAtRisk95: 0,
      valueAtRisk99: 0,
      expectedShortfall: 0,
      beta: 1.0,
      correlation: 0.7,
      volatility: 0.25,
    };
  }

  private async getRiskEvents(userId: string, startDate: Date, endDate: Date) {
    // Implement based on your risk tracking logic
    return [];
  }

  private async getLimitBreaches(userId: string, startDate: Date, endDate: Date) {
    // Implement based on your limit tracking logic
    return [];
  }

  private generateRiskRecommendations(currentRisk: any, riskMetrics: any): string[] {
    const recommendations: string[] = [];

    if (currentRisk.utilizationPercent > 70) {
      recommendations.push('Reduce margin utilization below 70%');
    }

    if (currentRisk.openPositions > 10) {
      recommendations.push('Consider reducing number of open positions for better risk management');
    }

    if (riskMetrics.volatility > 0.3) {
      recommendations.push('Portfolio volatility is high - consider adding defensive positions');
    }

    return recommendations;
  }

  private getFrequentSymbols(orders: any[]): string[] {
    const symbolCount = new Map<string, number>();

    orders.forEach((order) => {
      symbolCount.set(order.symbol, (symbolCount.get(order.symbol) || 0) + 1);
    });

    return Array.from(symbolCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symbol]) => symbol);
  }

  private calculateCapitalGains(trades: any[]) {
    const shortTerm = { totalGains: 0, totalLosses: 0, netGains: 0 };
    const longTerm = { totalGains: 0, totalLosses: 0, netGains: 0 };
    const tradeDetails: any[] = [];

    // Group trades by symbol to match buy/sell pairs
    // Simplified implementation - use FIFO method for tax calculation

    trades.forEach((trade) => {
      const isLongTerm = false; // Implement logic to check if held > 1 year

      const gainLoss = trade.pnl || 0;

      if (isLongTerm) {
        if (gainLoss > 0) longTerm.totalGains += gainLoss;
        else longTerm.totalLosses += Math.abs(gainLoss);
      } else {
        if (gainLoss > 0) shortTerm.totalGains += gainLoss;
        else shortTerm.totalLosses += Math.abs(gainLoss);
      }

      tradeDetails.push({
        symbol: trade.symbol,
        buyDate: trade.buy_date || trade.executed_at,
        sellDate: trade.sell_date || trade.executed_at,
        quantity: trade.quantity,
        buyPrice: trade.buy_price || trade.price,
        sellPrice: trade.sell_price || trade.price,
        gainLoss,
        type: isLongTerm ? 'long_term' : 'short_term',
      });
    });

    shortTerm.netGains = shortTerm.totalGains - shortTerm.totalLosses;
    longTerm.netGains = longTerm.totalGains - longTerm.totalLosses;

    return { shortTerm, longTerm, tradeDetails };
  }

  private calculateTransactionCharges(trades: any[]): number {
    // Typical charges: Brokerage + STT + Exchange fees + GST
    // Simplified calculation - implement based on broker charges
    const avgChargePercent = 0.0005; // 0.05%
    return trades.reduce((sum, t) => sum + t.quantity * t.price * avgChargePercent, 0);
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion - implement full conversion as needed
    return JSON.stringify(data);
  }

  private getEmptyPerformanceReport(userId: string, startDate: Date, endDate: Date): any {
    return {
      userId,
      period: { start: startDate, end: endDate },
      summary: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalPnL: 0,
        realizedPnL: 0,
        unrealizedPnL: 0,
        returnPercent: 0,
      },
      metrics: {},
      tradingActivity: {},
      symbolPerformance: [],
      monthlyBreakdown: [],
    };
  }

  private getEmptyTaxReport(userId: string, financialYear: string): TaxReport {
    return {
      userId,
      financialYear,
      shortTermGains: {
        totalGains: 0,
        totalLosses: 0,
        netGains: 0,
        taxableAmount: 0,
      },
      longTermGains: {
        totalGains: 0,
        totalLosses: 0,
        netGains: 0,
        taxableAmount: 0,
      },
      dividendIncome: 0,
      interestIncome: 0,
      transactionCharges: 0,
      totalTax: 0,
      tradeDetails: [],
    };
  }
}

// Export singleton instance
export const reportingService = new ReportingService();
