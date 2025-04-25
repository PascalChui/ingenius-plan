import type { Task } from "@/types/task"
import { addDays, differenceInDays, format, isAfter, isBefore, parseISO } from "date-fns"

export interface GanttTask extends Task {
  startDate: string
  endDate: string
  dependencies?: string[]
  progress: number
  milestone?: boolean
  color?: string
  expanded?: boolean
  subtasks?: GanttTask[]
  level?: number
  parent?: string
  duration?: number
  left?: number
  width?: number
  visible?: boolean
  isParent?: boolean
}

export interface TimelineConfig {
  startDate: Date
  endDate: Date
  viewMode: "day" | "week" | "month"
  columnWidth: number
  rowHeight: number
}

export function calculateGanttDimensions(tasks: GanttTask[], timelineConfig: TimelineConfig): GanttTask[] {
  const { startDate, columnWidth } = timelineConfig

  // First pass: calculate dimensions for all tasks
  const tasksWithDimensions = tasks.map((task) => {
    const taskStartDate = parseISO(task.startDate)
    const taskEndDate = parseISO(task.endDate)

    // Calculate position and width
    const left = differenceInDays(taskStartDate, startDate) * columnWidth
    const width = Math.max(
      columnWidth, // Minimum width of 1 day
      (differenceInDays(taskEndDate, taskStartDate) + 1) * columnWidth,
    )

    return {
      ...task,
      left,
      width,
      duration: differenceInDays(taskEndDate, taskStartDate) + 1,
      visible: task.visible !== false, // Default to visible if not specified
    }
  })

  return tasksWithDimensions
}

export function flattenTaskHierarchy(tasks: GanttTask[], parentExpanded = true, level = 0): GanttTask[] {
  let result: GanttTask[] = []

  for (const task of tasks) {
    // Set visibility based on parent's expanded state
    const isVisible = parentExpanded
    const hasSubtasks = task.subtasks && task.subtasks.length > 0

    // Add the current task with updated level and visibility
    result.push({
      ...task,
      level,
      visible: isVisible,
      isParent: hasSubtasks,
      expanded: task.expanded !== false, // Default to expanded if not specified
    })

    // Recursively add subtasks if they exist
    if (hasSubtasks && task.expanded !== false) {
      result = result.concat(flattenTaskHierarchy(task.subtasks, isVisible, level + 1))
    }
  }

  return result
}

export function buildTaskHierarchy(tasks: GanttTask[]): GanttTask[] {
  const taskMap = new Map<string, GanttTask>()
  const rootTasks: GanttTask[] = []

  // First pass: create a map of all tasks
  tasks.forEach((task) => {
    taskMap.set(task.id, { ...task, subtasks: [] })
  })

  // Second pass: build the hierarchy
  tasks.forEach((task) => {
    const taskWithSubtasks = taskMap.get(task.id)!

    if (task.parent) {
      const parentTask = taskMap.get(task.parent)
      if (parentTask) {
        if (!parentTask.subtasks) {
          parentTask.subtasks = []
        }
        parentTask.subtasks.push(taskWithSubtasks)
      } else {
        // If parent doesn't exist, treat as root task
        rootTasks.push(taskWithSubtasks)
      }
    } else {
      // No parent, so it's a root task
      rootTasks.push(taskWithSubtasks)
    }
  })

  return rootTasks
}

export function updateParentTaskDates(tasks: GanttTask[]): GanttTask[] {
  // Create a deep copy to avoid mutating the original
  const updatedTasks = JSON.parse(JSON.stringify(tasks)) as GanttTask[]

  // Process tasks bottom-up to update parent dates based on children
  const processLevel = (tasks: GanttTask[]) => {
    tasks.forEach((task) => {
      if (task.subtasks && task.subtasks.length > 0) {
        // Process children first
        processLevel(task.subtasks)

        // Find earliest start date and latest end date among children
        let earliestStart = parseISO(task.subtasks[0].startDate)
        let latestEnd = parseISO(task.subtasks[0].endDate)

        task.subtasks.forEach((subtask) => {
          const subtaskStart = parseISO(subtask.startDate)
          const subtaskEnd = parseISO(subtask.endDate)

          if (isBefore(subtaskStart, earliestStart)) {
            earliestStart = subtaskStart
          }

          if (isAfter(subtaskEnd, latestEnd)) {
            latestEnd = subtaskEnd
          }
        })

        // Update parent task dates
        task.startDate = earliestStart.toISOString()
        task.endDate = latestEnd.toISOString()

        // Calculate progress based on children's progress
        const totalProgress = task.subtasks.reduce((sum, subtask) => sum + subtask.progress, 0)
        task.progress = Math.round(totalProgress / task.subtasks.length)
      }
    })
  }

  processLevel(updatedTasks)
  return updatedTasks
}

export function getTimelineDates(startDate: Date, endDate: Date, viewMode: "day" | "week" | "month"): Date[] {
  const dates: Date[] = []
  let currentDate = new Date(startDate)

  while (isBefore(currentDate, endDate) || format(currentDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd")) {
    dates.push(new Date(currentDate))

    if (viewMode === "day") {
      currentDate = addDays(currentDate, 1)
    } else if (viewMode === "week") {
      currentDate = addDays(currentDate, 7)
    } else {
      // Move to the first day of the next month
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    }
  }

  return dates
}

export function getProjectDateRange(tasks: GanttTask[]): { startDate: Date; endDate: Date } {
  if (!tasks.length) {
    const today = new Date()
    return {
      startDate: today,
      endDate: addDays(today, 30),
    }
  }

  let minDate = parseISO(tasks[0].startDate)
  let maxDate = parseISO(tasks[0].endDate)

  tasks.forEach((task) => {
    const taskStartDate = parseISO(task.startDate)
    const taskEndDate = parseISO(task.endDate)

    if (isBefore(taskStartDate, minDate)) {
      minDate = taskStartDate
    }

    if (isAfter(taskEndDate, maxDate)) {
      maxDate = taskEndDate
    }
  })

  // Add some padding
  minDate = addDays(minDate, -2)
  maxDate = addDays(maxDate, 2)

  return { startDate: minDate, endDate: maxDate }
}

export function formatTimelineHeader(date: Date, viewMode: "day" | "week" | "month"): string {
  if (viewMode === "day") {
    return format(date, "MMM d")
  } else if (viewMode === "week") {
    return `Week of ${format(date, "MMM d")}`
  } else {
    return format(date, "MMMM yyyy")
  }
}

export function getDependencyPath(fromTask: GanttTask, toTask: GanttTask, rowHeight: number): string {
  // Calculate start and end points
  const startX = fromTask.left + fromTask.width
  const startY = (fromTask.level || 0) * rowHeight + rowHeight / 2

  const endX = toTask.left
  const endY = (toTask.level || 0) * rowHeight + rowHeight / 2

  // Create a path with a curve
  const controlPointX = (startX + endX) / 2

  return `M ${startX} ${startY} 
          C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`
}

export function findCriticalPath(tasks: GanttTask[]): string[] {
  // This is a simplified critical path calculation
  // In a real app, you would use a more sophisticated algorithm

  // Sort tasks by end date (latest first)
  const sortedTasks = [...tasks].sort((a, b) => parseISO(b.endDate).getTime() - parseISO(a.endDate).getTime())

  // Find tasks with no successors (end tasks)
  const endTasks = sortedTasks.filter((task) => !tasks.some((t) => t.dependencies?.includes(task.id)))

  if (!endTasks.length) return []

  // Start with the latest end task
  const criticalPath: string[] = [endTasks[0].id]
  let currentTask = endTasks[0]

  // Work backwards through dependencies
  while (currentTask.dependencies?.length) {
    // Find the predecessor with the latest end date
    const predecessors = tasks.filter((task) => currentTask.dependencies?.includes(task.id))

    if (!predecessors.length) break

    const latestPredecessor = predecessors.reduce(
      (latest, task) => (parseISO(task.endDate).getTime() > parseISO(latest.endDate).getTime() ? task : latest),
      predecessors[0],
    )

    criticalPath.unshift(latestPredecessor.id)
    currentTask = latestPredecessor
  }

  return criticalPath
}

export function validateTaskUpdate(
  task: GanttTask,
  updates: Partial<GanttTask>,
  allTasks: GanttTask[],
): { valid: boolean; message?: string } {
  const startDate = updates.startDate ? parseISO(updates.startDate) : parseISO(task.startDate)
  const endDate = updates.endDate ? parseISO(updates.endDate) : parseISO(task.endDate)

  // Check if end date is after start date
  if (isBefore(endDate, startDate)) {
    return { valid: false, message: "End date cannot be before start date" }
  }

  // Check dependencies
  if (task.dependencies?.length) {
    for (const depId of task.dependencies) {
      const depTask = allTasks.find((t) => t.id === depId)
      if (depTask) {
        const depEndDate = parseISO(depTask.endDate)
        if (isBefore(startDate, depEndDate)) {
          return {
            valid: false,
            message: `Task cannot start before its dependency "${depTask.title}" ends`,
          }
        }
      }
    }
  }

  // Check for dependent tasks
  const dependentTasks = allTasks.filter((t) => t.dependencies?.includes(task.id))
  for (const depTask of dependentTasks) {
    const depStartDate = parseISO(depTask.startDate)
    if (isAfter(endDate, depStartDate)) {
      return {
        valid: false,
        message: `Task cannot end after dependent task "${depTask.title}" starts`,
      }
    }
  }

  return { valid: true }
}
