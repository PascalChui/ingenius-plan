"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaskPriorityChartProps {
  data: Array<{ name: string; value: number }>
}

const COLORS = {
  high: "#ff4d4f",
  medium: "#faad14",
  low: "#52c41a",
  none: "#d9d9d9",
}

export function TaskPriorityChart({ data }: TaskPriorityChartProps) {
  const [chartType, setChartType] = useState<"pie" | "radial">("radial")

  // Format the data to capitalize first letter and handle null/undefined
  const formattedData = data.map((item) => ({
    name:
      item.name === "null" || item.name === "none" ? "None" : item.name.charAt(0).toUpperCase() + item.name.slice(1),
    value: item.value,
    color: COLORS[item.name as keyof typeof COLORS] || "#8884d8",
  }))

  return (
    <div className="space-y-4">
      <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)}>
        <TabsList className="h-8">
          <TabsTrigger value="pie" className="text-xs px-2 py-1">
            Pie
          </TabsTrigger>
          <TabsTrigger value="radial" className="text-xs px-2 py-1">
            Radial
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={chartType === "radial" ? 60 : 0}
              outerRadius={chartType === "radial" ? 80 : 100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={true}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} contentStyle={{ fontSize: "12px" }} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
