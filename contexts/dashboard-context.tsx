"use client"

import { createContext, useContext } from "react"
import type { DateRange } from "react-day-picker"
import type { TaskMetrics } from "@/utils/task-metrics"
import type { DashboardFilter, DashboardLayout } from "@/types/dashboard"

interface DashboardContextType {
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
  filters: DashboardFilter
  setFilters: (filters: DashboardFilter) => void
  layout: DashboardLayout
  setLayout: (layout: DashboardLayout) => void
  metrics: TaskMetrics | null
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
