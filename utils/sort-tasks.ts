import type { Task, SortField, SortDirection } from "@/types/task"

// Priority order for sorting
const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
  null: 0,
}

export function sortTasks(tasks: Task[], field: SortField, direction: SortDirection): Task[] {
  return [...tasks].sort((a, b) => {
    let comparison = 0

    switch (field) {
      case "dueDate":
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        break
      case "priority":
        comparison = (priorityOrder[a.priority || "null"] || 0) - (priorityOrder[b.priority || "null"] || 0)
        break
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "createdAt":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case "status":
        comparison = Number(a.completed) - Number(b.completed)
        break
      default:
        comparison = 0
    }

    return direction === "asc" ? comparison : -comparison
  })
}
