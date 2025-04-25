import type { Task } from "@/types/task"

export interface TaskMetrics {
  completionRate: number
  completedTasks: number
  totalTasks: number
  avgCompletionTime: number
  overdueTasks: number
  onTimeCompletionRate: number
  dailyStats: Array<{ date: string; completed: number; created: number }>
  tasksByCategory: Record<string, number>
  tasksByPriority: Record<string, number>
  tasksByStatus: Record<string, number>
  tasksByWeekday: Record<string, number>
  tasksByProject: Record<string, number>
  completionTrend?: any[]
}

export function calculateTaskMetrics(tasks: Task[], startDate: Date, endDate: Date): TaskMetrics {
  return {
    completionRate: 0,
    completedTasks: 0,
    totalTasks: 0,
    avgCompletionTime: 0,
    overdueTasks: 0,
    onTimeCompletionRate: 0,
    dailyStats: [],
    tasksByCategory: {},
    tasksByPriority: {},
    tasksByStatus: {},
    tasksByWeekday: {},
    tasksByProject: {},
    completionTrend: [],
  }
}
