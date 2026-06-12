"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Download,
  Filter,
  Globe,
  MoreHorizontal,
  Music,
  PlayCircle,
  Share2,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- Mock Data ---

const streamData = [
  { date: "2024-04-01", streams: 4500, revenue: 210 },
  { date: "2024-04-02", streams: 5200, revenue: 240 },
  { date: "2024-04-03", streams: 4900, revenue: 225 },
  { date: "2024-04-04", streams: 6100, revenue: 290 },
  { date: "2024-04-05", streams: 8500, revenue: 410 },
  { date: "2024-04-06", streams: 9200, revenue: 450 },
  { date: "2024-04-07", streams: 8800, revenue: 430 },
  { date: "2024-04-08", streams: 6500, revenue: 310 },
  { date: "2024-04-09", streams: 5900, revenue: 280 },
  { date: "2024-04-10", streams: 6300, revenue: 300 },
  { date: "2024-04-11", streams: 7500, revenue: 360 },
  { date: "2024-04-12", streams: 9800, revenue: 490 },
  { date: "2024-04-13", streams: 11200, revenue: 580 },
  { date: "2024-04-14", streams: 10500, revenue: 520 },
  { date: "2024-04-15", streams: 8100, revenue: 390 },
]

const countryData = [
  { country: "USA", listeners: 45000, fill: "var(--color-usa)" },
  { country: "UK", listeners: 12000, fill: "var(--color-uk)" },
  { country: "Germany", listeners: 8500, fill: "var(--color-germany)" },
  { country: "Brazil", listeners: 6200, fill: "var(--color-brazil)" },
  { country: "Japan", listeners: 4100, fill: "var(--color-japan)" },
]

// --- Chart Configurations ---

const streamChartConfig = {
  streams: {
    label: "Streams",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue ($)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const countryChartConfig = {
  listeners: {
    label: "Listeners",
  },
  usa: {
    label: "USA",
    color: "hsl(var(--chart-1))",
  },
  uk: {
    label: "UK",
    color: "hsl(var(--chart-2))",
  },
  germany: {
    label: "Germany",
    color: "hsl(var(--chart-3))",
  },
  brazil: {
    label: "Brazil",
    color: "hsl(var(--chart-4))",
  },
  japan: {
    label: "Japan",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Performance metrics for the last 30 days.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Apr 1 - Apr 15, 2024
            </span>
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <Button size="icon" className="h-9 w-9">
            <Download className="h-4 w-4" />
            <span className="sr-only">Export</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-8">
        
        {/* KPI Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128.4K</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUp className="h-3 w-3" /> 12%
                </span>
                vs last period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
              <span className="font-bold text-muted-foreground">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,231.50</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUp className="h-3 w-3" /> 8.1%
                </span>
                vs last period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saves & Adds</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,234</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span className="text-rose-500 flex items-center mr-1">
                  <ArrowDown className="h-3 w-3" /> 2%
                </span>
                vs last period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Share Rate</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.3%</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowUp className="h-3 w-3" /> 0.5%
                </span>
                vs last period
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Area Chart */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Comparing streams vs. revenue over time.
                  </CardDescription>
                </div>
                <Select defaultValue="15d">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="15d">Last 15 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={streamChartConfig} className="h-[350px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={streamData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <defs>
                    <linearGradient id="fillStreams" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-streams)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-streams)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="revenue"
                    type="natural"
                    fill="url(#fillRevenue)"
                    fillOpacity={0.4}
                    stroke="var(--color-revenue)"
                    stackId="a"
                  />
                  <Area
                    dataKey="streams"
                    type="natural"
                    fill="url(#fillStreams)"
                    fillOpacity={0.4}
                    stroke="var(--color-streams)"
                    stackId="b"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Secondary Chart: Top Territories */}
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Top Territories</CardTitle>
              <CardDescription>Listeners by Country</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={countryChartConfig}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={countryData}
                    dataKey="listeners"
                    nameKey="country"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                75.8K
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground text-xs"
                              >
                                Listeners
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% in USA <Globe className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total listeners for the selected period
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Detailed Table Section */}
        <Card>
            <CardHeader>
                <CardTitle>Stream Source Breakdown</CardTitle>
                <CardDescription>Detailed analysis of where your listeners are coming from.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Mock list items for a clean breakdown */}
                    {[
                        { name: "Spotify Playlist (Editorial)", type: "Playlist", amount: "45,231", change: "+12%" },
                        { name: "User Library", type: "Collection", amount: "32,100", change: "+5%" },
                        { name: "Direct Search", type: "Search", amount: "12,400", change: "-2%" },
                        { name: "Algorithmic Radio", type: "Radio", amount: "8,900", change: "+24%" },
                        { name: "External Web", type: "Referral", amount: "2,300", change: "+1%" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                    <Music className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.type}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">{item.amount}</p>
                                <p className={`text-sm ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {item.change}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}