"use client"

import { useState, useMemo } from "react"
import { Layout } from "@/components/layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { DashboardContext } from "@/contexts/dashboard-context"
import { tasks } from "@/data/tasks"
import { calculateTaskMetrics } from "@/utils/task-metrics"
import { subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { DashboardFilter, DashboardLayout } from "@/types/dashboard"

export default function DashboardPage() {
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Dashboard filters
  const [filters, setFilters] = useState<DashboardFilter>({
    project: "all",
    category: "all",
    assignee: "all",
    priority: "all",
  })

  // Dashboard layout
  const [layout, setLayout] = useState<DashboardLayout>("grid")

  // Calculate metrics based on date range and filters
  const metrics = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return null

    // Apply filters to tasks
    let filteredTasks = [...tasks]

    if (filters.project !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.project === filters.project)
    }

    if (filters.category !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.category === filters.category)
    }

    if (filters.assignee !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.assignedTo === filters.assignee)
    }

    if (filters.priority !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority)
    }

    return calculateTaskMetrics(filteredTasks, [dateRange.from, dateRange.to])
  }, [dateRange, filters])

  // Dashboard context value
  const dashboardContextValue = {
    dateRange,
    setDateRange,
    filters,
    setFilters,
    layout,
    setLayout,
    metrics,
  }

  if (!metrics) return null

  return (
    <Layout>
      <DashboardContext.Provider value={dashboardContextValue}>
        <div className="container px-4 py-6">
          <DashboardHeader />
          <DashboardGrid />
        </div>
      </DashboardContext.Provider>
    </Layout>
  )
}
