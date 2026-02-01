"use client";

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries, ColorType } from 'lightweight-charts';
import { TrendingUp, TrendingDown, Activity, Wifi } from 'lucide-react';

interface TradingViewChartProps {
  symbol: string; // e.g., "ETHUSDT"
  days?: number; // Not strictly used for WS, but kept for interface compatibility
  height?: number;
}

interface PriceStats {
  current: number;
  change24h: number;
  changePercent: number;
  high24h: number;
  low24h: number;
}

export default function TradingViewChart({ symbol = "ETHUSDT", height = 400 }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PriceStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial Data Load & Chart Setup
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#1F1F1F',
      },
      grid: {
        vertLines: { color: 'rgba(31, 31, 31, 0.05)' },
        horzLines: { color: 'rgba(31, 31, 31, 0.05)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: 'rgba(31, 31, 31, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(31, 31, 31, 0.1)',
      },
      crosshair: {
        mode: 1, // Magnet mode
      }
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = series;

    // 2. Fetch Initial History (REST API)
    const loadHistory = async () => {
      try {
        setLoading(true);
        // Fetch 500 candles of 1m interval for history context
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1m&limit=500`);
        const data = await res.json();
        
        if (!Array.isArray(data)) throw new Error("Invalid data from Binance");

        const formattedData: CandlestickData[] = data.map((d: any) => ({
          time: (d[0] / 1000) as Time,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));

        series.setData(formattedData);
        
        // Initial stats
        const last = formattedData[formattedData.length - 1];
        const first = formattedData[0];
        setStats({
          current: last.close,
          change24h: last.close - first.close, // Approx for this view
          changePercent: ((last.close - first.close) / first.close) * 100,
          high24h: Math.max(...formattedData.map(d => d.high)),
          low24h: Math.min(...formattedData.map(d => d.low))
        });

        setLoading(false);
      } catch (err) {
        console.error("History fetch failed:", err);
        setError("Failed to load historical data");
        setLoading(false);
      }
    };

    loadHistory();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, height]);

  // WebSocket Connection (Real-time updates)
  useEffect(() => {
    // Subscribe to 1s klines for ultra-fast updates
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("Connected to Binance WS");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.e === 'kline') {
        const k = message.k;
        const candle: CandlestickData = {
          time: (k.t / 1000) as Time,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
        };

        // Update chart series
        if (candlestickSeriesRef.current) {
          candlestickSeriesRef.current.update(candle);
        }

        // Update stats live
        setStats(prev => {
          if (!prev) return null;
          const change = parseFloat(k.c) - parseFloat(k.o); // Show change of current candle or keep 24h
          // For a better UX, we'd fetch 24h ticker separately, but let's update current price
          return {
            ...prev,
            current: parseFloat(k.c),
            // We keep daily stats static-ish or update smoothly if we had the ticker stream
          };
        });
      }
    };

    ws.onerror = (e) => {
      console.error("WS Error:", e);
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return (
    <div className="space-y-4">
      {/* Stats Header */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Live Price (Binance)"
            value={`$${stats.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />}
          />
           <StatCard // Placeholder for 24h as we only stream Klines
            label="Approx 24h Change"
            value={`${stats.changePercent >= 0 ? '+' : ''}${stats.changePercent.toFixed(2)}%`}
            icon={stats.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            trend={stats.changePercent >= 0 ? 'up' : 'down'}
          />
           <StatCard
            label="High"
            value={`$${stats.high24h.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
            icon={<Activity size={16} />}
          />
           <StatCard
            label="Low"
            value={`$${stats.low24h.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
            icon={<Activity size={16} />}
          />
        </div>
      )}

      {/* Chart Container */}
      <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-[#1F1F1F]/10">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent" />
          </div>
        )}

        {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
                <p className="text-red-500 font-bold">{error}</p>
            </div>
        )}
        
        <div ref={chartContainerRef} />
        
        {/* Connection Status Indicator */}
        <div className="absolute top-6 right-6 flex items-center gap-2 px-2 py-1 bg-white/80 rounded-md shadow-sm border border-gray-100">
            <Wifi size={14} className={isConnected ? "text-green-500" : "text-gray-400"} />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {isConnected ? 'LIVE FEED' : 'CONNECTING...'}
            </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend }: { label: string; value: string; icon: React.ReactNode; trend?: 'up' | 'down' }) {
  return (
    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-[#1F1F1F]/10">
      <div className="flex items-center gap-2 mb-1 text-[#1F1F1F]/70">
        {icon}
        <span className="text-xs font-bold uppercase">{label}</span>
      </div>
      <div className={`text-lg font-black ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-[#1F1F1F]'}`}>
        {value}
      </div>
    </div>
  );
}
