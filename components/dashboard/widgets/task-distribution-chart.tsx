"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaskDistributionChartProps {
  data: Array<{ name: string; value: number }>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658", "#8dd1e1"]

export function TaskDistributionChart({ data }: TaskDistributionChartProps) {
  const [chartLayout, setChartLayout] = useState<"vertical" | "horizontal">("vertical")

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  if (chartLayout === "horizontal") {
    return (
      <div className="space-y-4">
        <Tabs value={chartLayout} onValueChange={(value) => setChartLayout(value as any)}>
          <TabsList className="h-8">
            <TabsTrigger value="vertical" className="text-xs px-2 py-1">
              Vertical
            </TabsTrigger>
            <TabsTrigger value="horizontal" className="text-xs px-2 py-1">
              Horizontal
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 80,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} contentStyle={{ fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="value" name="Tasks">
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={chartLayout} onValueChange={(value) => setChartLayout(value as any)}>
        <TabsList className="h-8">
          <TabsTrigger value="vertical" className="text-xs px-2 py-1">
            Vertical
          </TabsTrigger>
          <TabsTrigger value="horizontal" className="text-xs px-2 py-1">
            Horizontal
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} contentStyle={{ fontSize: "12px" }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="value" name="Tasks">
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
