import type { Notification, NotificationPreferences } from "@/types/notification"

// Default notification preferences
export const defaultNotificationPreferences: NotificationPreferences = {
  enabled: true,
  upcomingTaskReminders: true,
  upcomingReminderHours: 24,
  overdueTaskAlerts: true,
  mentionAlerts: true,
  assignmentAlerts: true,
  systemNotifications: true,
  eventReminders: true,
  eventReminderTimes: [30, 1440], // Default: 30 minutes and 1 day before
}

// Sample notifications
export const notifications: Notification[] = [
  {
    id: "notification-1",
    type: "upcoming",
    title: "Upcoming Task",
    message: "Task 'Finalize project proposal' is due in 2 hours",
    taskId: "task-1",
    createdAt: "2023-06-15T10:00:00Z",
    read: false,
    actionUrl: "/tasks?id=task-1",
  },
  {
    id: "notification-2",
    type: "mention",
    title: "New Mention",
    message: "Jane Smith mentioned you in a comment on 'Design review'",
    taskId: "task-3",
    userId: "user-2",
    createdAt: "2023-06-14T15:30:00Z",
    read: true,
    actionUrl: "/tasks?id=task-3&comment=comment-1",
  },
  {
    id: "notification-3",
    type: "assignment",
    title: "Task Assigned",
    message: "You have been assigned to 'Create user documentation'",
    taskId: "task-5",
    userId: "user-3",
    createdAt: "2023-06-14T09:15:00Z",
    read: false,
    actionUrl: "/tasks?id=task-5",
  },
  {
    id: "notification-4",
    type: "system",
    title: "System Update",
    message: "The system will be undergoing maintenance on June 20th at 10:00 PM",
    createdAt: "2023-06-13T11:45:00Z",
    read: true,
  },
  {
    id: "notification-5",
    type: "overdue",
    title: "Overdue Task",
    message: "Task 'Submit expense report' is now overdue",
    taskId: "task-2",
    createdAt: "2023-06-12T16:20:00Z",
    read: false,
    actionUrl: "/tasks?id=task-2",
  },
]
