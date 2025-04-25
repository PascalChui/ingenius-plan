export type NotificationType = "upcoming" | "overdue" | "mention" | "assignment" | "system" | "event-reminder"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  read: boolean
  actionUrl?: string
  taskId?: string
  userId?: string
  eventId?: string
  reminderTime?: number
}

export interface NotificationPreferences {
  enabled: boolean
  upcomingTaskReminders: boolean
  upcomingReminderHours: number
  overdueTaskAlerts: boolean
  mentionAlerts: boolean
  assignmentAlerts: boolean
  systemNotifications: boolean
  eventReminders: boolean
  eventReminderTimes: number[] // in minutes: 5, 15, 30, 60, 1440 (1 day)
}
