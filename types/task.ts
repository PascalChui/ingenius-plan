export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  priority: "high" | "medium" | "low" | null
  category: "work" | "personal" | "meeting" | "other" | null
  project: string | null
  assignee: string | null
  assigneeName?: string
  assigneeAvatar?: string
  creator: string | null
  teamId?: string
  watchers?: string[]
  collaborators?: string[]
  attachments: string[]
  createdAt: string
  updatedAt?: string
  completedAt?: string
  comments?: TaskComment[]
  status?: "not_started" | "in_progress" | "in_review" | "blocked" | "completed"
  tags?: string[]
}

export interface TaskComment {
  id: string
  taskId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  updatedAt?: string
  mentions?: string[]
  attachments?: string[]
}

export interface TaskFilter {
  category: "work" | "personal" | "meeting" | "other" | null
  timeframe: "today" | "tomorrow" | "this-week" | "overdue" | null
  priority: "high" | "medium" | "low" | null
  status: "completed" | "incomplete" | null
  project: string | null
  search: string
}

export type SortField = "dueDate" | "priority" | "title" | "createdAt" | "status"
export type SortDirection = "asc" | "desc"

export interface TaskSort {
  field: SortField
  direction: SortDirection
}
