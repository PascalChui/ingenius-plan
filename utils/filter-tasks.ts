import type { Task, TaskFilter } from "@/types/task"

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return tasks.filter((task) => {
    // Filter by category
    if (filter.category && filter.category !== "all" && task.category !== filter.category) {
      return false
    }

    // Filter by status
    if (filter.status === "completed" && !task.completed) {
      return false
    }
    if (filter.status === "incomplete" && task.completed) {
      return false
    }

    // Filter by priority
    if (filter.priority && filter.priority !== "all" && task.priority !== filter.priority) {
      return false
    }

    // Filter by project
    if (filter.project && filter.project !== "all" && task.project !== filter.project) {
      return false
    }

    // Filter by timeframe
    if (filter.timeframe) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      const taskDate = new Date(task.dueDate)
      taskDate.setHours(0, 0, 0, 0)

      if (filter.timeframe === "today" && taskDate.getTime() !== today.getTime()) {
        return false
      }
      if (filter.timeframe === "tomorrow" && taskDate.getTime() !== tomorrow.getTime()) {
        return false
      }
      if (filter.timeframe === "this-week" && (taskDate < today || taskDate > nextWeek)) {
        return false
      }
      if (filter.timeframe === "overdue" && taskDate >= today) {
        return false
      }
    }

    // Filter by search term
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase()
      return (
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        (task.project && task.project.toLowerCase().includes(searchTerm))
      )
    }

    return true
  })
}

export function groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const grouped: Record<string, Task[]> = {
    overdue: [],
    today: [],
    tomorrow: [],
    upcoming: [],
    completed: [],
  }

  tasks.forEach((task) => {
    if (task.completed) {
      grouped.completed.push(task)
      return
    }

    const taskDate = new Date(task.dueDate)
    taskDate.setHours(0, 0, 0, 0)

    if (taskDate.getTime() < today.getTime()) {
      grouped.overdue.push(task)
    } else if (taskDate.getTime() === today.getTime()) {
      grouped.today.push(task)
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      grouped.tomorrow.push(task)
    } else {
      grouped.upcoming.push(task)
    }
  })

  return grouped
}
