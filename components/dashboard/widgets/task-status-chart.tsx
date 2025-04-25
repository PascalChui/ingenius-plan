"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app, this would come from the API
const statusData = [
  { name: "Not Started", value: 18, color: "#8884d8" },
  { name: "In Progress", value: 12, color: "#83a6ed" },
  { name: "In Review", value: 6, color: "#8dd1e1" },
  { name: "Blocked", value: 3, color: "#ff8042" },
  { name: "Completed", value: 24, color: "#82ca9d" },
]

export function TaskStatusChart() {
  const [chartType, setChartType] = useState<"pie" | "donut">("donut")
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#888" fontSize={12}>
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" fontSize={20} fontWeight="bold">
          {value}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#999" fontSize={12}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)}>
        <TabsList className="h-8">
          <TabsTrigger value="pie" className="text-xs px-2 py-1">
            Pie
          </TabsTrigger>
          <TabsTrigger value="donut" className="text-xs px-2 py-1">
            Donut
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={chartType === "donut" ? 70 : 0}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} contentStyle={{ fontSize: "12px" }} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
