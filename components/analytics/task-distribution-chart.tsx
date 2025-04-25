"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TaskDistributionChart({
  statusData,
  priorityData,
}: {
  statusData: any[]
  priorityData: any[]
}) {
  // Format status data for the chart
  const statusChartData = statusData.map((item) => ({
    name: formatStatus(item.status),
    value: Number.parseInt(item.count),
  }))

  // Format priority data for the chart
  const priorityChartData = priorityData.map((item) => ({
    name: formatPriority(item.priority),
    value: Number.parseInt(item.count),
  }))

  // Colors for status
  const statusColors = ["#4caf93", "#4a89f3", "#f7a04b", "#adb5bd"]

  // Colors for priority
  const priorityColors = ["#adb5bd", "#4a89f3", "#f7a04b", "#f25d52"]

  function formatStatus(status: string) {
    switch (status) {
      case "TODO":
        return "À faire"
      case "IN_PROGRESS":
        return "En cours"
      case "DONE":
        return "Terminé"
      case "ARCHIVED":
        return "Archivé"
      default:
        return status
    }
  }

  function formatPriority(priority: string) {
    switch (priority) {
      case "LOW":
        return "Basse"
      case "MEDIUM":
        return "Moyenne"
      case "HIGH":
        return "Haute"
      case "URGENT":
        return "Urgente"
      default:
        return priority
    }
  }

  return (
    <Tabs defaultValue="status">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="status">Par statut</TabsTrigger>
        <TabsTrigger value="priority">Par priorité</TabsTrigger>
      </TabsList>
      <TabsContent value="status" className="h-[250px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {statusChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} tâches`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="priority" className="h-[250px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={priorityChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {priorityChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={priorityColors[index % priorityColors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} tâches`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}
