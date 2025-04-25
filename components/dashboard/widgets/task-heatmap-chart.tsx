"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app, this would come from the API
const generateHeatmapData = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const data = []

  for (const day of days) {
    for (const hour of hours) {
      const value = Math.floor(Math.random() * 10)
      data.push({
        day,
        hour,
        value,
      })
    }
  }

  return data
}

const heatmapData = generateHeatmapData()

export function TaskHeatmapChart() {
  const [dataType, setDataType] = useState<"created" | "completed">("created")

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const dayLabels = days.map((day) => day.substring(0, 3))

  // Get color based on value
  const getColor = (value: number) => {
    if (value === 0) return "#f0f0f0"
    if (value <= 2) return "#e6f7ff"
    if (value <= 4) return "#bae7ff"
    if (value <= 6) return "#91d5ff"
    if (value <= 8) return "#69c0ff"
    return "#1890ff"
  }

  // Format hour for display
  const formatHour = (hour: number) => {
    if (hour === 0) return "12am"
    if (hour === 12) return "12pm"
    if (hour < 12) return `${hour}am`
    return `${hour - 12}pm`
  }

  return (
    <div className="space-y-4">
      <Tabs value={dataType} onValueChange={(value) => setDataType(value as any)}>
        <TabsList className="h-8">
          <TabsTrigger value="created" className="text-xs px-2 py-1">
            Tasks Created
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs px-2 py-1">
            Tasks Completed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full h-[300px] overflow-x-auto">
        <div className="min-w-[800px] h-full">
          <div className="flex h-full">
            {/* Y-axis labels (days) */}
            <div className="flex flex-col justify-around pr-2 text-xs text-gray-500">
              {dayLabels.map((day) => (
                <div key={day} className="h-10">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex-1 flex flex-col">
              {/* X-axis labels (hours) */}
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                  <div key={hour} style={{ width: `${100 / 8}%` }}>
                    {formatHour(hour)}
                  </div>
                ))}
              </div>

              {/* Heatmap cells */}
              <div className="flex-1 grid grid-rows-7 gap-1">
                {days.map((day, dayIndex) => (
                  <div key={day} className="flex gap-1">
                    {Array.from({ length: 24 }, (_, hourIndex) => {
                      const dataPoint = heatmapData.find((d) => d.day === day && d.hour === hourIndex)
                      const value = dataPoint ? dataPoint.value : 0

                      return (
                        <div
                          key={hourIndex}
                          className="flex-1 h-full rounded cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: getColor(value) }}
                          title={`${day} ${formatHour(hourIndex)}: ${value} tasks`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1" style={{ backgroundColor: "#f0f0f0" }}></div>
          <span>0</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1" style={{ backgroundColor: "#e6f7ff" }}></div>
          <span>1-2</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1" style={{ backgroundColor: "#bae7ff" }}></div>
          <span>3-4</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1" style={{ backgroundColor: "#91d5ff" }}></div>
          <span>5-6</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1" style={{ backgroundColor: "#69c0ff" }}></div>
          <span>7-8</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-1" style={{ backgroundColor: "#1890ff" }}></div>
          <span>9+</span>
        </div>
      </div>
    </div>
  )
}
