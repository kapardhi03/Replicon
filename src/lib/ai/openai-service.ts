import axios from 'axios';
import { supabase } from '../supabase';

// =====================================================
// TYPES
// =====================================================

export interface MarketSentiment {
  symbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  reasoning: string;
  factors: {
    technical: number;
    fundamental: number;
    news: number;
    social: number;
  };
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  timestamp: string;
}

export interface StrategyRecommendation {
  strategyId: string;
  recommendations: {
    type: 'optimization' | 'risk_adjustment' | 'parameter_change' | 'general';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    expectedImpact: string;
    implementation: string;
  }[];
  overallAssessment: string;
  riskLevel: 'low' | 'medium' | 'high';
  performanceOutlook: string;
}

export interface MarketSummary {
  date: string;
  marketCondition: 'bullish' | 'bearish' | 'volatile' | 'stable';
  keyHighlights: string[];
  topGainers: Array<{ symbol: string; change: number }>;
  topLosers: Array<{ symbol: string; change: number }>;
  sectorPerformance: Record<string, number>;
  aiInsights: string;
  tradingOpportunities: string[];
}

export interface TradingSignal {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  strength: number; // 0 to 1
  reasoning: string;
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  timeframe: string;
}

// =====================================================
// OPENAI SERVICE
// =====================================================

class OpenAIService {
  private readonly API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private readonly MODEL = 'gpt-4o';

  /**
   * Analyze market sentiment for a symbol
   */
  async analyzeMarketSentiment(
    symbol: string,
    newsData?: string[],
    priceData?: any
  ): Promise<MarketSentiment> {
    if (!this.API_KEY) {
      return this.getMockSentiment(symbol);
    }

    try {
      const prompt = this.buildSentimentPrompt(symbol, newsData, priceData);

      const response = await this.callOpenAI([
        {
          role: 'system',
          content:
            'You are a professional market analyst specializing in Indian stock markets. Analyze the provided data and return a detailed sentiment analysis in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      const analysis = JSON.parse(response);

      return {
        symbol,
        sentiment: analysis.sentiment,
        score: analysis.score,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        factors: analysis.factors,
        recommendation: analysis.recommendation,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to analyze market sentiment:', error);
      return this.getMockSentiment(symbol);
    }
  }

  /**
   * Get AI-powered strategy recommendations
   */
  async getStrategyRecommendations(
    strategyId: string,
    performanceData: any,
    riskMetrics: any
  ): Promise<StrategyRecommendation> {
    if (!this.API_KEY) {
      return this.getMockRecommendations(strategyId);
    }

    try {
      const prompt = this.buildStrategyPrompt(strategyId, performanceData, riskMetrics);

      const response = await this.callOpenAI([
        {
          role: 'system',
          content:
            'You are an expert trading strategy advisor. Analyze the strategy performance and risk metrics, then provide actionable recommendations to improve performance and manage risk. Return your analysis in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      const recommendations = JSON.parse(response);

      return {
        strategyId,
        recommendations: recommendations.recommendations,
        overallAssessment: recommendations.overallAssessment,
        riskLevel: recommendations.riskLevel,
        performanceOutlook: recommendations.performanceOutlook,
      };
    } catch (error) {
      console.error('Failed to get strategy recommendations:', error);
      return this.getMockRecommendations(strategyId);
    }
  }

  /**
   * Generate daily market summary
   */
  async generateMarketSummary(marketData: any): Promise<MarketSummary> {
    if (!this.API_KEY) {
      return this.getMockMarketSummary();
    }

    try {
      const prompt = this.buildMarketSummaryPrompt(marketData);

      const response = await this.callOpenAI([
        {
          role: 'system',
          content:
            'You are a market analyst providing daily market summaries for Indian stock markets. Analyze the market data and create a comprehensive summary in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      const summary = JSON.parse(response);

      return {
        date: new Date().toISOString().split('T')[0],
        marketCondition: summary.marketCondition,
        keyHighlights: summary.keyHighlights,
        topGainers: summary.topGainers,
        topLosers: summary.topLosers,
        sectorPerformance: summary.sectorPerformance,
        aiInsights: summary.aiInsights,
        tradingOpportunities: summary.tradingOpportunities,
      };
    } catch (error) {
      console.error('Failed to generate market summary:', error);
      return this.getMockMarketSummary();
    }
  }

  /**
   * Generate trading signals
   */
  async generateTradingSignals(
    symbols: string[],
    marketCondition: string
  ): Promise<TradingSignal[]> {
    if (!this.API_KEY) {
      return this.getMockTradingSignals(symbols);
    }

    try {
      const prompt = this.buildTradingSignalsPrompt(symbols, marketCondition);

      const response = await this.callOpenAI([
        {
          role: 'system',
          content:
            'You are a professional technical analyst. Generate trading signals for the given symbols based on current market conditions. Return signals in JSON array format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      const signals = JSON.parse(response);
      return signals;
    } catch (error) {
      console.error('Failed to generate trading signals:', error);
      return this.getMockTradingSignals(symbols);
    }
  }

  /**
   * Analyze trade performance and suggest improvements
   */
  async analyzeTradePerformance(
    userId: string,
    trades: any[]
  ): Promise<{
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    overallScore: number;
  }> {
    if (!this.API_KEY) {
      return this.getMockTradeAnalysis();
    }

    try {
      const prompt = this.buildTradeAnalysisPrompt(trades);

      const response = await this.callOpenAI([
        {
          role: 'system',
          content:
            'You are a trading coach analyzing trade performance. Identify strengths, weaknesses, and provide actionable suggestions. Return analysis in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to analyze trade performance:', error);
      return this.getMockTradeAnalysis();
    }
  }

  /**
   * Generate risk assessment report
   */
  async generateRiskAssessment(
    portfolio: any,
    riskMetrics: any
  ): Promise<{
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    concerns: string[];
    recommendations: string[];
    hedgingSuggestions: string[];
  }> {
    if (!this.API_KEY) {
      return this.getMockRiskAssessment();
    }

    try {
      const prompt = this.buildRiskAssessmentPrompt(portfolio, riskMetrics);

      const response = await this.callOpenAI([
        {
          role: 'system',
          content:
            'You are a risk management specialist. Analyze the portfolio and risk metrics, then provide a detailed risk assessment. Return analysis in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate risk assessment:', error);
      return this.getMockRiskAssessment();
    }
  }

  // =====================================================
  // PRIVATE HELPER METHODS
  // =====================================================

  /**
   * Call OpenAI API
   */
  private async callOpenAI(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const response = await axios.post(
        this.API_URL,
        {
          model: this.MODEL,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Build sentiment analysis prompt
   */
  private buildSentimentPrompt(symbol: string, newsData?: string[], priceData?: any): string {
    return `
Analyze the market sentiment for ${symbol} based on the following data:

${newsData ? `Recent News:\n${newsData.join('\n')}\n` : ''}
${priceData ? `Price Data:\n${JSON.stringify(priceData, null, 2)}\n` : ''}

Provide a JSON response with the following structure:
{
  "sentiment": "bullish" | "bearish" | "neutral",
  "score": <number between -1 and 1>,
  "confidence": <number between 0 and 1>,
  "reasoning": "<detailed explanation>",
  "factors": {
    "technical": <score -1 to 1>,
    "fundamental": <score -1 to 1>,
    "news": <score -1 to 1>,
    "social": <score -1 to 1>
  },
  "recommendation": "strong_buy" | "buy" | "hold" | "sell" | "strong_sell"
}
`;
  }

  /**
   * Build strategy recommendations prompt
   */
  private buildStrategyPrompt(strategyId: string, performanceData: any, riskMetrics: any): string {
    return `
Analyze the following trading strategy and provide recommendations:

Strategy ID: ${strategyId}

Performance Data:
${JSON.stringify(performanceData, null, 2)}

Risk Metrics:
${JSON.stringify(riskMetrics, null, 2)}

Provide a JSON response with the following structure:
{
  "recommendations": [
    {
      "type": "optimization" | "risk_adjustment" | "parameter_change" | "general",
      "title": "<recommendation title>",
      "description": "<detailed description>",
      "priority": "low" | "medium" | "high",
      "expectedImpact": "<expected impact>",
      "implementation": "<how to implement>"
    }
  ],
  "overallAssessment": "<overall strategy assessment>",
  "riskLevel": "low" | "medium" | "high",
  "performanceOutlook": "<performance outlook>"
}
`;
  }

  /**
   * Build market summary prompt
   */
  private buildMarketSummaryPrompt(marketData: any): string {
    return `
Generate a comprehensive daily market summary for Indian stock markets:

Market Data:
${JSON.stringify(marketData, null, 2)}

Provide a JSON response with the following structure:
{
  "marketCondition": "bullish" | "bearish" | "volatile" | "stable",
  "keyHighlights": ["<highlight 1>", "<highlight 2>", ...],
  "topGainers": [{"symbol": "RELIANCE", "change": 5.2}, ...],
  "topLosers": [{"symbol": "TCS", "change": -3.1}, ...],
  "sectorPerformance": {"IT": 2.3, "Banking": -1.2, ...},
  "aiInsights": "<AI-generated market insights>",
  "tradingOpportunities": ["<opportunity 1>", "<opportunity 2>", ...]
}
`;
  }

  /**
   * Build trading signals prompt
   */
  private buildTradingSignalsPrompt(symbols: string[], marketCondition: string): string {
    return `
Generate trading signals for the following symbols:
${symbols.join(', ')}

Current Market Condition: ${marketCondition}

Provide a JSON array with the following structure:
[
  {
    "symbol": "RELIANCE",
    "action": "buy" | "sell" | "hold",
    "strength": <number between 0 and 1>,
    "reasoning": "<detailed reasoning>",
    "entryPrice": <optional number>,
    "targetPrice": <optional number>,
    "stopLoss": <optional number>,
    "timeframe": "<timeframe>"
  }
]
`;
  }

  /**
   * Build trade analysis prompt
   */
  private buildTradeAnalysisPrompt(trades: any[]): string {
    return `
Analyze the following trading history:

${JSON.stringify(trades, null, 2)}

Provide a JSON response with the following structure:
{
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", ...],
  "overallScore": <number between 0 and 100>
}
`;
  }

  /**
   * Build risk assessment prompt
   */
  private buildRiskAssessmentPrompt(portfolio: any, riskMetrics: any): string {
    return `
Perform a risk assessment on the following portfolio:

Portfolio:
${JSON.stringify(portfolio, null, 2)}

Risk Metrics:
${JSON.stringify(riskMetrics, null, 2)}

Provide a JSON response with the following structure:
{
  "riskLevel": "low" | "medium" | "high" | "critical",
  "concerns": ["<concern 1>", "<concern 2>", ...],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", ...],
  "hedgingSuggestions": ["<hedge 1>", "<hedge 2>", ...]
}
`;
  }

  // =====================================================
  // MOCK DATA FOR DEVELOPMENT
  // =====================================================

  private getMockSentiment(symbol: string): MarketSentiment {
    return {
      symbol,
      sentiment: 'bullish',
      score: 0.65,
      confidence: 0.8,
      reasoning:
        'Strong technical indicators with positive news sentiment. Price action showing upward momentum.',
      factors: {
        technical: 0.7,
        fundamental: 0.6,
        news: 0.65,
        social: 0.6,
      },
      recommendation: 'buy',
      timestamp: new Date().toISOString(),
    };
  }

  private getMockRecommendations(strategyId: string): StrategyRecommendation {
    return {
      strategyId,
      recommendations: [
        {
          type: 'risk_adjustment',
          title: 'Reduce Position Size',
          description:
            'Current position sizes are too large relative to account size, increasing risk exposure.',
          priority: 'high',
          expectedImpact: 'Reduced drawdown by 20-30%',
          implementation: 'Reduce position size from 10% to 5% of portfolio per trade.',
        },
        {
          type: 'optimization',
          title: 'Tighten Stop Losses',
          description: 'Stop losses are set too wide, leading to larger losses on losing trades.',
          priority: 'medium',
          expectedImpact: 'Improved risk-reward ratio',
          implementation: 'Use ATR-based stop losses at 1.5x ATR instead of 2x ATR.',
        },
      ],
      overallAssessment:
        'Strategy shows promising returns but with elevated risk. Focus on risk management improvements.',
      riskLevel: 'medium',
      performanceOutlook: 'Positive with recommended adjustments',
    };
  }

  private getMockMarketSummary(): MarketSummary {
    return {
      date: new Date().toISOString().split('T')[0],
      marketCondition: 'stable',
      keyHighlights: [
        'Nifty 50 closed up 0.5% at 19,850',
        'Banking sector outperformed with 1.2% gain',
        'IT stocks under pressure due to global tech selloff',
      ],
      topGainers: [
        { symbol: 'RELIANCE', change: 3.2 },
        { symbol: 'HDFC', change: 2.8 },
        { symbol: 'ICICIBANK', change: 2.1 },
      ],
      topLosers: [
        { symbol: 'TCS', change: -2.5 },
        { symbol: 'INFY', change: -1.8 },
        { symbol: 'WIPRO', change: -1.5 },
      ],
      sectorPerformance: {
        Banking: 1.2,
        IT: -1.5,
        Auto: 0.8,
        Pharma: 0.3,
        FMCG: -0.2,
      },
      aiInsights:
        'Market showing resilience despite global headwinds. Banking sector strength indicates positive domestic sentiment.',
      tradingOpportunities: [
        'Look for dips in quality banking stocks',
        'IT stocks may offer value at current levels',
        'Auto sector showing momentum',
      ],
    };
  }

  private getMockTradingSignals(symbols: string[]): TradingSignal[] {
    return symbols.map((symbol) => ({
      symbol,
      action: 'buy' as const,
      strength: 0.7,
      reasoning: 'Technical breakout with strong volume confirmation',
      entryPrice: 2500,
      targetPrice: 2650,
      stopLoss: 2450,
      timeframe: 'Short-term (1-2 weeks)',
    }));
  }

  private getMockTradeAnalysis() {
    return {
      strengths: [
        'Good win rate of 65%',
        'Consistent profit-taking discipline',
        'Strong trend-following ability',
      ],
      weaknesses: [
        'Tendency to cut winners too early',
        'Inconsistent position sizing',
        'Over-trading in choppy markets',
      ],
      suggestions: [
        'Let winning trades run longer using trailing stops',
        'Implement fixed position sizing rules',
        'Filter trades during low-volatility periods',
        'Keep a trading journal to identify patterns',
      ],
      overallScore: 72,
    };
  }

  private getMockRiskAssessment() {
    return {
      riskLevel: 'medium' as const,
      concerns: [
        'Portfolio concentration in single sector',
        'Drawdown approaching warning threshold',
        'Margin utilization at 70%',
      ],
      recommendations: [
        'Diversify across at least 3-4 sectors',
        'Reduce position sizes to lower drawdown risk',
        'Keep margin utilization below 60%',
        'Set up stop-loss alerts for all positions',
      ],
      hedgingSuggestions: [
        'Consider buying Nifty put options for downside protection',
        'Add defensive stocks from FMCG or Pharma sectors',
        'Use index futures for short-term hedging',
      ],
    };
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
