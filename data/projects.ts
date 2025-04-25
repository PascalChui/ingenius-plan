import type { Project } from "@/types/project"
import { tasks } from "@/data/tasks"
import { users } from "@/data/teams"

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    status: "active",
    progress: 65,
    startDate: "2023-04-15",
    endDate: "2023-07-30",
    teamId: "team-1",
    ownerId: "user-1",
    members: ["user-1", "user-2", "user-3"],
    tasks: ["task-1", "task-3", "task-5", "task-9"],
    createdAt: "2023-04-10",
    updatedAt: "2025-04-20",
    category: "Development",
    priority: "high",
    tags: ["web", "design", "frontend"],
  },
  {
    id: "project-2",
    title: "Mobile App Development",
    description: "Create a native mobile app for iOS and Android platforms",
    status: "active",
    progress: 20,
    startDate: "2023-06-01",
    endDate: "2023-12-30",
    teamId: "team-1",
    ownerId: "user-2",
    members: ["user-2", "user-3"],
    tasks: ["task-8"],
    createdAt: "2023-05-25",
    updatedAt: "2025-04-18",
    category: "Development",
    priority: "medium",
    tags: ["mobile", "ios", "android"],
  },
  {
    id: "project-3",
    title: "Marketing Campaign",
    description: "Q2 marketing campaign for product launch",
    status: "completed",
    progress: 100,
    startDate: "2023-04-01",
    endDate: "2023-06-30",
    teamId: "team-2",
    ownerId: "user-4",
    members: ["user-4", "user-5", "user-1"],
    tasks: ["task-6"],
    createdAt: "2023-03-20",
    updatedAt: "2023-07-01",
    category: "Marketing",
    priority: "high",
    tags: ["marketing", "campaign", "launch"],
  },
  {
    id: "project-4",
    title: "Database Migration",
    description: "Migrate from legacy database to new cloud-based solution",
    status: "planning",
    progress: 35,
    startDate: "2023-02-10",
    teamId: "team-1",
    ownerId: "user-2",
    members: ["user-2"],
    createdAt: "2023-02-05",
    updatedAt: "2025-04-15",
    category: "Infrastructure",
    priority: "medium",
    tags: ["database", "migration", "cloud"],
  },
  {
    id: "project-5",
    title: "Annual Report Preparation",
    description: "Prepare and compile the annual financial and performance report",
    status: "on-hold",
    progress: 45,
    startDate: "2023-10-01",
    endDate: "2023-12-15",
    ownerId: "user-1",
    members: ["user-1", "user-4"],
    createdAt: "2023-09-15",
    updatedAt: "2023-11-10",
    category: "Finance",
    priority: "low",
    tags: ["report", "finance", "annual"],
  },
]

// Helper functions
export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id)
}

export function getProjectsByStatus(status: string): Project[] {
  if (status === "all") return projects
  return projects.filter((project) => project.status === status)
}

export function getProjectsByTeam(teamId: string): Project[] {
  return projects.filter((project) => project.teamId === teamId)
}

export function getProjectsByUser(userId: string): Project[] {
  return projects.filter((project) => project.ownerId === userId || project.members.includes(userId))
}

export function getProjectWithDetails(id: string): any {
  const project = getProjectById(id)
  if (!project) return null

  const owner = users.find((user) => user.id === project.ownerId)
  const memberDetails = users.filter((user) => project.members.includes(user.id))
  const taskDetails = tasks.filter((task) => project?.tasks?.includes(task.id))

  return {
    ...project,
    owner,
    memberDetails,
    taskDetails,
  }
}

export function getProjectTasks(projectId: string): any[] {
  const project = getProjectById(projectId)
  if (!project || !project.tasks) return []

  return tasks.filter((task) => project.tasks?.includes(task.id))
}
