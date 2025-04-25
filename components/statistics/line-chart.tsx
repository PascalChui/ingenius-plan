"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface LineChartProps {
  data: Array<{ date: string; completed: number; created: number }>
}

export function LineChart({ data }: LineChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="created" name="Tasks Created" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="completed" name="Tasks Completed" stroke="#82ca9d" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
