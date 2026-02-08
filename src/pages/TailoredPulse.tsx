import { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
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

// Intent colors matching TailoredLens
const INTENT_COLORS: Record<string, string> = {
  BUY_NOW: '#ef4444',
  COMPARE: '#3b82f6',
  USE_CASE: '#a855f7',
  BUDGET: '#22c55e',
  RESEARCH: '#06b6d4',
  GIFTING: '#f59e0b',
};

// Dummy data
const intentData = [
  { name: 'BUY_NOW', value: 28, color: INTENT_COLORS.BUY_NOW },
  { name: 'COMPARE', value: 24, color: INTENT_COLORS.COMPARE },
  { name: 'USE_CASE', value: 18, color: INTENT_COLORS.USE_CASE },
  { name: 'BUDGET', value: 15, color: INTENT_COLORS.BUDGET },
  { name: 'RESEARCH', value: 10, color: INTENT_COLORS.RESEARCH },
  { name: 'GIFTING', value: 5, color: INTENT_COLORS.GIFTING },
];

const confidenceData = [
  { range: '0.0', count: 12 },
  { range: '0.1', count: 28 },
  { range: '0.2', count: 45 },
  { range: '0.3', count: 89 },
  { range: '0.4', count: 156 },
  { range: '0.5', count: 234 },
  { range: '0.6', count: 412 },
  { range: '0.7', count: 567 },
  { range: '0.8', count: 623 },
  { range: '0.9', count: 489 },
  { range: '1.0', count: 192 },
];

const variantData = [
  { name: 'HeroUrgency', ctr: 8.2 },
  { name: 'HeroValue', ctr: 7.8 },
  { name: 'HeroComparison', ctr: 6.1 },
  { name: 'HeroLifestyle', ctr: 5.4 },
  { name: 'HeroGift', ctr: 4.9 },
  { name: 'HeroGuide', ctr: 3.2 },
];

const heatmapData = [
  { intent: 'BUY_NOW', primary: 0.72, secondary: 0.18, none: 0.10 },
  { intent: 'COMPARE', primary: 0.58, secondary: 0.26, none: 0.16 },
  { intent: 'USE_CASE', primary: 0.45, secondary: 0.32, none: 0.23 },
  { intent: 'BUDGET', primary: 0.64, secondary: 0.22, none: 0.14 },
  { intent: 'RESEARCH', primary: 0.32, secondary: 0.41, none: 0.27 },
  { intent: 'GIFTING', primary: 0.51, secondary: 0.29, none: 0.20 },
];

const recentDecisions = [
  { time: '2m ago', intent: 'BUY_NOW', confidence: 0.92, template: 'HeroUrgency', cta: 'Primary', referrer: 'Google' },
  { time: '5m ago', intent: 'COMPARE', confidence: 0.87, template: 'HeroComparison', cta: 'Primary', referrer: 'Reddit' },
  { time: '8m ago', intent: 'BUDGET', confidence: 0.79, template: 'HeroValue', cta: 'Secondary', referrer: 'Email' },
  { time: '12m ago', intent: 'USE_CASE', confidence: 0.84, template: 'HeroLifestyle', cta: 'Primary', referrer: 'Instagram' },
  { time: '15m ago', intent: 'RESEARCH', confidence: 0.71, template: 'HeroGuide', cta: 'None', referrer: 'Direct' },
  { time: '18m ago', intent: 'GIFTING', confidence: 0.88, template: 'HeroGift', cta: 'Primary', referrer: 'Google' },
  { time: '22m ago', intent: 'BUY_NOW', confidence: 0.95, template: 'HeroUrgency', cta: 'Primary', referrer: 'Reddit' },
  { time: '25m ago', intent: 'COMPARE', confidence: 0.82, template: 'HeroComparison', cta: 'Secondary', referrer: 'Google' },
  { time: '30m ago', intent: 'BUDGET', confidence: 0.76, template: 'HeroValue', cta: 'Primary', referrer: 'Email' },
  { time: '35m ago', intent: 'USE_CASE', confidence: 0.69, template: 'HeroLifestyle', cta: 'None', referrer: 'Direct' },
];

const sparklineData = [
  { value: 0.78 }, { value: 0.80 }, { value: 0.79 }, { value: 0.81 }, 
  { value: 0.83 }, { value: 0.82 }, { value: 0.84 }, { value: 0.82 },
];

type TimeRange = 'today' | '7days' | '30days';

const TailoredPulse = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');

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
            value="2,847"
            trend={12}
            trendUp={true}
            icon={<Users className="w-4 h-4" />}
          />
          <StatsCard
            title="Personalized"
            value="94.2%"
            trend={3.1}
            trendUp={true}
            icon={<Percent className="w-4 h-4" />}
          />
          <StatsCard
            title="Avg Confidence"
            value="0.82"
            sparkline={sparklineData}
            icon={<Activity className="w-4 h-4" />}
          />
          <StatsCard
            title="Fallback Rate"
            value="5.8%"
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
                          data={intentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {intentData.map((entry, index) => (
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
                    {intentData.map((item) => (
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
                    <AreaChart data={confidenceData}>
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
                    <BarChart data={variantData} layout="vertical" barSize={16}>
                      <XAxis 
                        type="number" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 11 }}
                        domain={[0, 10]}
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
                          style={{ backgroundColor: INTENT_COLORS[row.intent] }}
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
                {recentDecisions.map((decision, index) => (
                  <TableRow 
                    key={index} 
                    className={`border-white/5 ${index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                  >
                    <TableCell className="text-muted-foreground">{decision.time}</TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs font-medium"
                        style={{
                          backgroundColor: `${INTENT_COLORS[decision.intent]}20`,
                          color: INTENT_COLORS[decision.intent],
                          borderColor: `${INTENT_COLORS[decision.intent]}40`,
                        }}
                      >
                        {decision.intent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${decision.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono">{decision.confidence.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{decision.template}</TableCell>
                    <TableCell>
                      <span className={`text-sm ${
                        decision.cta === 'Primary' 
                          ? 'text-green-400' 
                          : decision.cta === 'Secondary' 
                            ? 'text-blue-400' 
                            : 'text-muted-foreground'
                      }`}>
                        {decision.cta}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{decision.referrer}</TableCell>
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
  const isPositive = invertTrend ? trend < 0 : trend > 0;

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
              <span>{Math.abs(trend)}%</span>
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
  // Calculate color intensity (0 to 1)
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
