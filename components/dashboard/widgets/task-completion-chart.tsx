"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaskCompletionChartProps {
  data: Array<{ date: string; completed: number; created: number }>
}

export function TaskCompletionChart({ data }: TaskCompletionChartProps) {
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line")
  const [showTrend, setShowTrend] = useState(false)
  const [showBrush, setShowBrush] = useState(false)

  // Calculate 7-day moving average for trend line
  const trendData = data.map((item, index, array) => {
    if (index < 6) return { ...item, trend: null }

    const last7Days = array.slice(index - 6, index + 1)
    const sum = last7Days.reduce((acc, curr) => acc + curr.completed, 0)
    const avg = sum / 7

    return { ...item, trend: avg }
  })

  // Calculate average completion rate
  const avgCompletion = data.reduce((sum, item) => sum + item.completed, 0) / data.length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)}>
          <TabsList className="h-8">
            <TabsTrigger value="line" className="text-xs px-2 py-1">
              Line
            </TabsTrigger>
            <TabsTrigger value="area" className="text-xs px-2 py-1">
              Area
            </TabsTrigger>
            <TabsTrigger value="bar" className="text-xs px-2 py-1">
              Bar
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant={showTrend ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowTrend(!showTrend)}
          >
            Show Trend
          </Button>
          <Button
            variant={showBrush ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowBrush(!showBrush)}
          >
            Enable Zoom
          </Button>
        </div>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ fontSize: "12px" }}
              formatter={(value, name) => {
                return [value, name === "trend" ? "7-Day Avg" : name]
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />

            {chartType === "line" && (
              <>
                <Line
                  type="monotone"
                  dataKey="created"
                  name="Tasks Created"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="completed" name="Tasks Completed" stroke="#82ca9d" strokeWidth={2} />
              </>
            )}

            {chartType === "area" &&
              (
                <>
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  name="Tasks Created" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  name="Tasks Completed" 
                  stroke="#82ca9d" 
                  fill="#82ca9d"
                  fillOpacity={0.3}
                  strokeWidth={2\
                  fill="#82ca9d"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </>
              )}

            {showTrend && (
              <Line
                type="monotone"
                dataKey="trend"
                name="7-Day Trend"
                stroke="#ff7300"
                dot={false}
                activeDot={false}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}

            <ReferenceLine y={avgCompletion} stroke="red" strokeDasharray="3 3">
              <Label value="Avg" position="right" />
            </ReferenceLine>

            {showBrush && (
              <Brush dataKey="date" height={30} stroke="#8884d8" startIndex={Math.max(0, data.length - 14)} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
