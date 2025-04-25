import type { GanttTask } from "./gantt-utils"
import { addDays, subDays } from "date-fns"

export function generateSampleGanttData(tasks: any[]): GanttTask[] {
  const today = new Date()

  // Create a map to store tasks by ID
  const taskMap = new Map<string, GanttTask>()

  // First pass: create all tasks
  const ganttTasks = tasks.map((task, index) => {
    // Generate realistic start and end dates
    const startDate = task.dueDate
      ? subDays(new Date(task.dueDate), Math.floor(Math.random() * 14) + 1).toISOString()
      : subDays(today, Math.floor(Math.random() * 7) + 1).toISOString()

    const endDate = task.dueDate || addDays(today, Math.floor(Math.random() * 14) + 1).toISOString()

    // Determine if this should be a parent task (every 3rd task)
    const isParent = index % 3 === 0 && index > 0

    // Create the task
    const ganttTask: GanttTask = {
      ...task,
      startDate,
      endDate,
      progress: task.completed ? 100 : Math.floor(Math.random() * 100),
      milestone: index % 7 === 0,
      color: task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#f59e0b" : "#10b981",
      expanded: true,
      isParent: isParent,
      subtasks: [],
    }

    taskMap.set(task.id, ganttTask)
    return ganttTask
  })

  // Second pass: establish parent-child relationships
  ganttTasks.forEach((task, index) => {
    // Make every 3rd task a child of the previous parent
    if (index % 3 !== 0 && index > 0) {
      const parentIndex = index - (index % 3)
      if (parentIndex >= 0 && parentIndex < ganttTasks.length) {
        const parentTask = ganttTasks[parentIndex]
        task.parent = parentTask.id

        // Add to parent's subtasks
        if (!parentTask.subtasks) {
          parentTask.subtasks = []
        }
        parentTask.subtasks.push(task)
      }
    }
  })

  // Third pass: create some dependencies between tasks
  ganttTasks.forEach((task, index) => {
    // Add dependencies between consecutive tasks in the same group
    if (index > 0 && index % 3 !== 0) {
      const prevTaskIndex = index - 1
      if (prevTaskIndex >= 0) {
        task.dependencies = [ganttTasks[prevTaskIndex].id]
      }
    }
  })

  return ganttTasks
}
