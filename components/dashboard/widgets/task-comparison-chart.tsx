"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app, this would come from the API
const comparisonData = [
  {
    name: "Tasks Created",
    current: 45,
    previous: 38,
    change: 18.4,
  },
  {
    name: "Tasks Completed",
    current: 32,
    previous: 25,
    change: 28.0,
  },
  {
    name: "Completion Rate",
    current: 71,
    previous: 65,
    change: 9.2,
  },
  {
    name: "Avg. Completion Time",
    current: 3.2,
    previous: 4.1,
    change: -22.0,
  },
  {
    name: "Overdue Tasks",
    current: 8,
    previous: 12,
    change: -33.3,
  },
]

export function TaskComparisonChart() {
  const [comparisonType, setComparisonType] = useState<"absolute" | "percentage">("absolute")

  return (
    <div className="space-y-4">
      <Tabs value={comparisonType} onValueChange={(value) => setComparisonType(value as any)}>
        <TabsList className="h-8">
          <TabsTrigger value="absolute" className="text-xs px-2 py-1">
            Absolute Values
          </TabsTrigger>
          <TabsTrigger value="percentage" className="text-xs px-2 py-1">
            Percentage Change
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {comparisonType === "absolute" ? (
            <BarChart
              data={comparisonData}
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
                  const formattedName = name === "current" ? "Current Period" : "Previous Period"
                  return [value, formattedName]
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="previous" name="Previous Period" fill="#8884d8" />
              <Bar dataKey="current" name="Current Period" fill="#82ca9d">
                <LabelList
                  dataKey="change"
                  position="top"
                  formatter={(value: number) => `${value > 0 ? "+" : ""}${value}%`}
                  style={{ fontSize: "10px", fill: (value) => (value >= 0 ? "#52c41a" : "#ff4d4f") }}
                />
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={comparisonData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[-50, 50]} tickFormatter={(value) => `${value}%`} />
              <Tooltip contentStyle={{ fontSize: "12px" }} formatter={(value) => [`${value}%`, "Change"]} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="change"
                name="Percentage Change"
                fill={(entry) => (entry.change >= 0 ? "#52c41a" : "#ff4d4f")}
              >
                <LabelList
                  dataKey="change"
                  position="top"
                  formatter={(value: number) => `${value > 0 ? "+" : ""}${value}%`}
                  style={{ fontSize: "10px" }}
                />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
