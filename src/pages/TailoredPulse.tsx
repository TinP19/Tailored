import { useState, useEffect } from 'react';
import {
  Target,
  Users,
  Percent,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { getAnalytics, seedDemoData } from '@/tailored/tracker';
import { INTENT_COLORS } from '@/tailored/config';
import type { AnalyticsData } from '@/tailored/types';

type TimeRange = 'today' | '7days' | '30days';

const TailoredPulse = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    seedDemoData();
  }, []);

  useEffect(() => {
    const refresh = () => setAnalytics(getAnalytics(timeRange));
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [timeRange]);

  if (!analytics) return null;

  const {
    totalVisitors,
    personalizedPct,
    avgConfidence,
    fallbackRate,
    intentDistribution,
    confidenceDistribution,
    variantPerformance,
    heatmapData,
    recentDecisions,
    sparklineData,
  } = analytics;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Tailored Pulse</h1>
              <p className="text-xs text-muted-foreground">Analytics Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
              {(['today', '7days', '30days'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    timeRange === range
                      ? 'bg-white/10 text-white'
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>

            {/* Store Status */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">TechHaven</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-500 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Visitors"
            value={totalVisitors.toLocaleString()}
            trend={12}
            trendUp={true}
            icon={<Users className="w-4 h-4" />}
          />
          <StatsCard
            title="Personalized"
            value={`${personalizedPct}%`}
            trend={3.1}
            trendUp={true}
            icon={<Percent className="w-4 h-4" />}
          />
          <StatsCard
            title="Avg Confidence"
            value={avgConfidence.toFixed(2)}
            sparkline={sparklineData}
            icon={<Activity className="w-4 h-4" />}
          />
          <StatsCard
            title="Fallback Rate"
            value={`${fallbackRate}%`}
            trend={-1.2}
            trendUp={true}
            invertTrend
            icon={<AlertTriangle className="w-4 h-4" />}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Intent Distribution */}
            <Card className="glass-strong border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Intent Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={intentDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {intentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background/95 border border-white/10 rounded-lg px-3 py-2 text-sm">
                                  <p className="font-medium">{payload[0].name}</p>
                                  <p className="text-muted-foreground">{payload[0].value}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {intentDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confidence Distribution */}
            <Card className="glass-strong border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Confidence Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={confidenceDistribution}>
                      <defs>
                        <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="range"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 11 }}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background/95 border border-white/10 rounded-lg px-3 py-2 text-sm">
                                <p className="font-medium">Confidence: {label}</p>
                                <p className="text-muted-foreground">{payload[0].value} visitors</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="url(#confidenceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Variant Performance */}
            <Card className="glass-strong border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Variant Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={variantPerformance} layout="vertical" barSize={16}>
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 11 }}
                        domain={[0, 'auto']}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 11 }}
                        width={100}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background/95 border border-white/10 rounded-lg px-3 py-2 text-sm">
                                <p className="font-medium">{payload[0].payload.name}</p>
                                <p className="text-muted-foreground">CTR: {payload[0].value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="ctr"
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Intent x CTA Heatmap */}
            <Card className="glass-strong border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Intent × CTA Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {/* Column Headers */}
                  <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-1 text-xs text-muted-foreground mb-2">
                    <div></div>
                    <div className="text-center">Primary</div>
                    <div className="text-center">Secondary</div>
                    <div className="text-center">No Click</div>
                  </div>

                  {/* Heatmap Rows */}
                  {heatmapData.map((row) => (
                    <div key={row.intent} className="grid grid-cols-[100px_1fr_1fr_1fr] gap-1">
                      <div
                        className="text-xs py-2 px-2 flex items-center gap-2"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: INTENT_COLORS[row.intent as keyof typeof INTENT_COLORS] }}
                        />
                        <span className="text-muted-foreground truncate">{row.intent}</span>
                      </div>
                      <HeatmapCell value={row.primary} />
                      <HeatmapCell value={row.secondary} />
                      <HeatmapCell value={row.none} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Decisions Table */}
        <Card className="glass-strong border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recent Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Time</TableHead>
                  <TableHead className="text-muted-foreground">Intent</TableHead>
                  <TableHead className="text-muted-foreground">Confidence</TableHead>
                  <TableHead className="text-muted-foreground">Template</TableHead>
                  <TableHead className="text-muted-foreground">CTA Clicked</TableHead>
                  <TableHead className="text-muted-foreground">Referrer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDecisions.map((row, index) => (
                  <TableRow
                    key={index}
                    className={`border-white/5 ${index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                  >
                    <TableCell className="text-muted-foreground">{row.time}</TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs font-medium"
                        style={{
                          backgroundColor: `${INTENT_COLORS[row.intent as keyof typeof INTENT_COLORS] ?? '#888'}20`,
                          color: INTENT_COLORS[row.intent as keyof typeof INTENT_COLORS] ?? '#888',
                          borderColor: `${INTENT_COLORS[row.intent as keyof typeof INTENT_COLORS] ?? '#888'}40`,
                        }}
                      >
                        {row.intent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${row.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono">{row.confidence.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{row.template}</TableCell>
                    <TableCell>
                      <span className={`text-sm ${
                        row.cta === 'primary'
                          ? 'text-green-400'
                          : row.cta === 'secondary'
                            ? 'text-blue-400'
                            : 'text-muted-foreground'
                      }`}>
                        {row.cta}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.referrer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  trend?: number;
  trendUp?: boolean;
  invertTrend?: boolean;
  sparkline?: { value: number }[];
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, trend, trendUp, invertTrend, sparkline, icon }: StatsCardProps) => {
  const showTrend = trend !== undefined;
  const isPositive = invertTrend ? trend! < 0 : trend! > 0;

  return (
    <Card className="glass-strong border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold">{value}</span>
          {showTrend && (
            <div className={`flex items-center gap-0.5 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{Math.abs(trend!)}%</span>
            </div>
          )}
          {sparkline && (
            <div className="w-20 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkline}>
                  <defs>
                    <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={1.5}
                    fill="url(#sparklineGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Heatmap Cell Component
const HeatmapCell = ({ value }: { value: number }) => {
  const intensity = value;
  const bgColor = `rgba(34, 197, 94, ${intensity * 0.8})`;

  return (
    <div
      className="py-2 text-center text-xs font-medium rounded transition-all hover:scale-105 cursor-default"
      style={{ backgroundColor: bgColor }}
      title={`${Math.round(value * 100)}%`}
    >
      {Math.round(value * 100)}%
    </div>
  );
};

export default TailoredPulse;
