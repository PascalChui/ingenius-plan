import { addDays, differenceInDays, parseISO, format, eachDayOfInterval } from "date-fns"
import type { Task } from "@/types/task"
import type { User } from "@/types/team"
import { getUserById } from "@/data/teams"

export interface ResourceAllocation {
  userId: string
  userName: string
  userAvatar?: string
  userTitle?: string
  allocations: DailyAllocation[]
  totalHours: number
  averageUtilization: number
  overallocatedDays: number
}

export interface DailyAllocation {
  date: string
  formattedDate: string
  hours: number
  utilization: number // 0-100%
  tasks: {
    id: string
    title: string
    hours: number
    color: string
  }[]
}

export interface AllocationFilters {
  startDate: Date
  endDate: Date
  teamMembers: string[] // user IDs
  showOverallocatedOnly: boolean
}

// Standard working hours per day
const WORKING_HOURS_PER_DAY = 8

// Calculate resource allocation for team members
export function calculateResourceAllocation(
  tasks: Task[],
  users: User[],
  filters: AllocationFilters,
): ResourceAllocation[] {
  const { startDate, endDate, teamMembers, showOverallocatedOnly } = filters

  // Filter users if specific team members are selected
  const filteredUsers = teamMembers.length > 0 ? users.filter((user) => teamMembers.includes(user.id)) : users

  // Initialize resource allocations
  const resourceAllocations: ResourceAllocation[] = filteredUsers.map((user) => ({
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    userTitle: user.title,
    allocations: [],
    totalHours: 0,
    averageUtilization: 0,
    overallocatedDays: 0,
  }))

  // Generate all days in the date range
  const allDays = eachDayOfInterval({ start: startDate, end: endDate })

  // Initialize daily allocations for each user
  resourceAllocations.forEach((resource) => {
    resource.allocations = allDays.map((day) => ({
      date: format(day, "yyyy-MM-dd"),
      formattedDate: format(day, "MMM d"),
      hours: 0,
      utilization: 0,
      tasks: [],
    }))
  })

  // Calculate task allocations
  tasks.forEach((task) => {
    // Skip completed tasks
    if (task.completed) return

    // Skip tasks without assignees
    if (!task.assigneeId) return

    // Skip tasks without due dates
    if (!task.dueDate) return

    // Find the resource allocation for this assignee
    const resourceAllocation = resourceAllocations.find((r) => r.userId === task.assigneeId)
    if (!resourceAllocation) return

    // Calculate task start and end dates
    // For simplicity, we'll assume tasks start 3 days before the due date if not specified
    const taskEndDate = parseISO(task.dueDate)
    const taskStartDate = task.startDate ? parseISO(task.startDate) : addDays(taskEndDate, -3)

    // Skip tasks outside the filter date range
    if (taskEndDate < startDate || taskStartDate > endDate) return

    // Calculate task duration in days
    const taskDuration = Math.max(1, differenceInDays(taskEndDate, taskStartDate) + 1)

    // Calculate hours per day for this task (assuming tasks are distributed evenly)
    // For simplicity, we'll use a default of 4 hours per day if not specified
    const hoursPerDay = task.estimatedHours ? task.estimatedHours / taskDuration : 4

    // Determine task color based on priority
    const taskColor = task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#f59e0b" : "#10b981"

    // Allocate the task to each day in its duration
    for (let day = new Date(taskStartDate); day <= taskEndDate; day = addDays(day, 1)) {
      // Skip days outside the filter range
      if (day < startDate || day > endDate) continue

      const dateString = format(day, "yyyy-MM-dd")
      const dailyAllocation = resourceAllocation.allocations.find((a) => a.date === dateString)

      if (dailyAllocation) {
        // Add task hours to this day
        dailyAllocation.hours += hoursPerDay
        dailyAllocation.utilization = (dailyAllocation.hours / WORKING_HOURS_PER_DAY) * 100

        // Add task to the list for this day
        dailyAllocation.tasks.push({
          id: task.id,
          title: task.title,
          hours: hoursPerDay,
          color: taskColor,
        })

        // Update total hours
        resourceAllocation.totalHours += hoursPerDay

        // Check for overallocation
        if (dailyAllocation.hours > WORKING_HOURS_PER_DAY) {
          resourceAllocation.overallocatedDays++
        }
      }
    }
  })

  // Calculate average utilization
  resourceAllocations.forEach((resource) => {
    if (resource.allocations.length > 0) {
      resource.averageUtilization = (resource.totalHours / (resource.allocations.length * WORKING_HOURS_PER_DAY)) * 100
    }
  })

  // Filter out resources with no allocations if showing overallocated only
  return showOverallocatedOnly
    ? resourceAllocations.filter((resource) => resource.overallocatedDays > 0)
    : resourceAllocations
}

// Get tasks assigned to a specific user
export function getTasksForUser(tasks: Task[], userId: string): Task[] {
  return tasks.filter((task) => task.assigneeId === userId && !task.completed)
}

// Get users assigned to a specific task
export function getUsersForTask(task: Task): User[] {
  if (!task.assigneeId) return []
  const user = getUserById(task.assigneeId)
  return user ? [user] : []
}

// Calculate total allocation hours for a user in a date range
export function calculateTotalAllocationHours(tasks: Task[], userId: string, startDate: Date, endDate: Date): number {
  let totalHours = 0

  tasks.forEach((task) => {
    if (task.assigneeId === userId && !task.completed && task.dueDate) {
      const taskEndDate = parseISO(task.dueDate)
      const taskStartDate = task.startDate ? parseISO(task.startDate) : addDays(taskEndDate, -3)

      // Skip tasks outside the date range
      if (taskEndDate < startDate || taskStartDate > endDate) return

      // Calculate task duration in days
      const taskDuration = Math.max(1, differenceInDays(taskEndDate, taskStartDate) + 1)

      // Calculate hours for this task
      const taskHours = task.estimatedHours || taskDuration * 4

      // Add to total
      totalHours += taskHours
    }
  })

  return totalHours
}
