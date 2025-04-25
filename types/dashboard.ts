export type DashboardLayout = "grid" | "columns" | "full"

export interface DashboardFilter {
  project: string
  category: string
  assignee: string
  priority: string
}

export interface DashboardWidgetProps {
  id: string
  title: string
  description?: string
  className?: string
}

export type DashboardWidgetSize = "small" | "medium" | "large" | "full"

export interface DashboardWidgetConfig {
  id: string
  type: string
  title: string
  size: DashboardWidgetSize
  position: number
  settings?: Record<string, any>
}
