import type { Task } from "@/types/task"

export interface TaskTemplate {
  id: string
  name: string
  description: string
  category: "work" | "personal" | "meeting" | "other" | null
  priority: "high" | "medium" | "low" | null
  project: string | null
  estimatedTime?: number // in minutes
  tags?: string[]
  createdAt: string
  updatedAt: string
  usageCount: number
}

export type CreateTemplateInput = Omit<TaskTemplate, "id" | "createdAt" | "updatedAt" | "usageCount"> & {
  id?: string
}

export type TaskFromTemplate = Omit<Task, "id" | "completed" | "dueDate" | "createdAt" | "attachments" | "assignee">
