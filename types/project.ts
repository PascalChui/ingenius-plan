import type { Task } from "@/types/task"
import type { User } from "@/types/team"

export type ProjectStatus = "planning" | "active" | "completed" | "on-hold"

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  progress: number
  startDate: string
  endDate?: string
  teamId?: string
  ownerId: string
  members: string[]
  tasks?: string[]
  createdAt: string
  updatedAt: string
  category?: string
  budget?: number
  priority?: "low" | "medium" | "high"
  tags?: string[]
}

export interface ProjectWithDetails extends Project {
  owner: User
  memberDetails: User[]
  taskDetails: Task[]
}
