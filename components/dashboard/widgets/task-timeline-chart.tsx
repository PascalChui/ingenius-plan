"use client"

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
  Cell,
} from "recharts"

// Sample data - in a real app, this would come from the API
const timelineData = [
  { name: "Overdue", tasks: 8, color: "#ff4d4f" },
  { name: "Today", tasks: 5, color: "#1890ff" },
  { name: "Tomorrow", tasks: 3, color: "#52c41a" },
  { name: "This Week", tasks: 12, color: "#722ed1" },
  { name: "Next Week", tasks: 7, color: "#faad14" },
  { name: "Later", tasks: 10, color: "#d9d9d9" },
]

export function TaskTimelineChart() {
  const today = new Date()

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={timelineData}
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
          <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} contentStyle={{ fontSize: "12px" }} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <ReferenceLine x="Today" stroke="#1890ff" label={{ value: "Today", position: "top" }} />
          <Bar dataKey="tasks" name="Tasks">
            {timelineData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
