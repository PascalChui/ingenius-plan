"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ProductivityTrendsChart({
  creationData,
  completionData,
}: {
  creationData: any[]
  completionData: any[]
}) {
  // Create a map of dates to easily merge the data
  const dateMap = new Map()

  // Add creation data to the map
  creationData.forEach((item) => {
    const date = new Date(item.day).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    dateMap.set(date, { date, created: Number.parseInt(item.count), completed: 0 })
  })

  // Add completion data to the map
  completionData.forEach((item) => {
    const date = new Date(item.day).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    if (dateMap.has(date)) {
      const existing = dateMap.get(date)
      dateMap.set(date, { ...existing, completed: Number.parseInt(item.count) })
    } else {
      dateMap.set(date, { date, created: 0, completed: Number.parseInt(item.count) })
    }
  })

  // Convert the map to an array for the chart
  const chartData = Array.from(dateMap.values())
    .sort((a, b) => {
      const [dayA, monthA] = a.date.split("/").map(Number)
      const [dayB, monthB] = b.date.split("/").map(Number)
      return monthA === monthB ? dayA - dayB : monthA - monthB
    })
    .slice(-30) // Show only the last 30 days

  return (
    <ChartContainer
      config={{
        created: {
          label: "Tâches créées",
          color: "hsl(var(--chart-1))",
        },
        completed: {
          label: "Tâches complétées",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="created"
            stroke="var(--color-created)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="var(--color-completed)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
