"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app, this would come from the API
const teamData = [
  { name: "John Doe", completed: 24, assigned: 30, overdue: 2 },
  { name: "Jane Smith", completed: 18, assigned: 22, overdue: 1 },
  { name: "Bob Johnson", completed: 32, assigned: 35, overdue: 0 },
  { name: "Alice Williams", completed: 15, assigned: 25, overdue: 5 },
  { name: "Charlie Brown", completed: 28, assigned: 28, overdue: 0 },
]

export function TeamPerformanceChart() {
  const [metricType, setMetricType] = useState<"absolute" | "percentage">("absolute")

  // Calculate completion rates for percentage view
  const percentageData = teamData.map((member) => ({
    name: member.name,
    completionRate: Math.round((member.completed / member.assigned) * 100),
    overdueRate: Math.round((member.overdue / member.assigned) * 100),
  }))

  // Calculate team average
  const teamAvgCompletion =
    metricType === "absolute"
      ? teamData.reduce((sum, member) => sum + member.completed, 0) / teamData.length
      : percentageData.reduce((sum, member) => sum + member.completionRate, 0) / percentageData.length

  return (
    <div className="space-y-4">
      <Tabs value={metricType} onValueChange={(value) => setMetricType(value as any)}>
        <TabsList className="h-8">
          <TabsTrigger value="absolute" className="text-xs px-2 py-1">
            Absolute
          </TabsTrigger>
          <TabsTrigger value="percentage" className="text-xs px-2 py-1">
            Percentage
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {metricType === "absolute" ? (
            <BarChart
              data={teamData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ fontSize: "12px" }}
                formatter={(value, name) => {
                  const formattedName =
                    name === "completed" ? "Completed Tasks" : name === "assigned" ? "Assigned Tasks" : "Overdue Tasks"
                  return [value, formattedName]
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="completed" name="Completed" fill="#82ca9d" />
              <Bar dataKey="assigned" name="Assigned" fill="#8884d8" />
              <Bar dataKey="overdue" name="Overdue" fill="#ff8042" />
              <ReferenceLine y={teamAvgCompletion} stroke="red" strokeDasharray="3 3" />
            </BarChart>
          ) : (
            <BarChart
              data={percentageData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ fontSize: "12px" }}
                formatter={(value, name) => {
                  const formattedName = name === "completionRate" ? "Completion Rate" : "Overdue Rate"
                  return [`${value}%`, formattedName]
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="completionRate" name="Completion Rate" fill="#82ca9d" />
              <Bar dataKey="overdueRate" name="Overdue Rate" fill="#ff8042" />
              <ReferenceLine y={teamAvgCompletion} stroke="red" strokeDasharray="3 3" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
