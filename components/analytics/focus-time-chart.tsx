"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function FocusTimeChart({ data }: { data: any[] }) {
  // Format data for the chart
  const chartData = data.map((item) => ({
    date: new Date(item.day).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    minutes: Math.round(Number.parseFloat(item.duration)),
  }))

  return (
    <ChartContainer
      config={{
        minutes: {
          label: "Minutes de concentration",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="minutes" fill="var(--color-minutes)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
