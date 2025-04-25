"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Notification, NotificationPreferences } from "@/types/notification"
import { notifications as initialNotifications, defaultNotificationPreferences } from "@/data/notifications"
import { tasks } from "@/data/tasks"
import { processEventReminders } from "@/utils/event-reminder-service"
import { useCalendar } from "@/contexts/calendar-context"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void
  calendarAvailable: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences)
  const [calendarAvailable, setCalendarAvailable] = useState(false)

  // Make calendar context optional by using try/catch
  let calendarContext = null
  try {
    calendarContext = useCalendar()
    useEffect(() => {
      setCalendarAvailable(true)
    }, [])
  } catch (error) {
    // Calendar context is not available, which is fine for non-calendar pages
    console.log("Calendar context not available on this page")
    useEffect(() => {
      setCalendarAvailable(false)
    }, [])
  }

  // Calculate unread count
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Clear a notification
  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Update notification preferences
  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }))
  }

  // Check for upcoming and overdue tasks
  useEffect(() => {
    if (!preferences.enabled) return

    // This would typically be a server-side function that runs periodically
    // For demo purposes, we're doing it on the client side
    const checkTasks = () => {
      const now = new Date()
      const upcomingNotifications: Notification[] = []
      const overdueNotifications: Notification[] = []

      tasks.forEach((task) => {
        if (task.completed) return

        const dueDate = new Date(task.dueDate)
        const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)

        // Check for upcoming tasks
        if (
          preferences.upcomingTaskReminders &&
          hoursUntilDue > 0 &&
          hoursUntilDue <= preferences.upcomingReminderHours
        ) {
          // Check if we already have a notification for this task
          const existingNotification = notifications.find(
            (n) => n.taskId === task.id && n.type === "upcoming" && !n.read,
          )

          if (!existingNotification) {
            const hours = Math.floor(hoursUntilDue)
            const hoursText = hours === 1 ? "1 hour" : `${hours} hours`

            upcomingNotifications.push({
              id: `upcoming-${task.id}-${Date.now()}`,
              type: "upcoming",
              title: "Upcoming Task",
              message: `Task '${task.title}' is due in ${hoursText}`,
              taskId: task.id,
              createdAt: new Date().toISOString(),
              read: false,
              actionUrl: `/tasks?id=${task.id}`,
            })
          }
        }

        // Check for overdue tasks
        if (preferences.overdueTaskAlerts && dueDate < now) {
          // Check if we already have a notification for this task
          const existingNotification = notifications.find(
            (n) => n.taskId === task.id && n.type === "overdue" && !n.read,
          )

          if (!existingNotification) {
            overdueNotifications.push({
              id: `overdue-${task.id}-${Date.now()}`,
              type: "overdue",
              title: "Overdue Task",
              message: `Task '${task.title}' is now overdue`,
              taskId: task.id,
              createdAt: new Date().toISOString(),
              read: false,
              actionUrl: `/tasks?id=${task.id}`,
            })
          }
        }
      })

      // Add new notifications
      if (upcomingNotifications.length > 0 || overdueNotifications.length > 0) {
        setNotifications((prev) => [...upcomingNotifications, ...overdueNotifications, ...prev])
      }
    }

    // Check tasks immediately and then every minute
    checkTasks()
    const interval = setInterval(checkTasks, 60000)

    return () => clearInterval(interval)
  }, [preferences, tasks])

  // Check for upcoming events - only if calendar context is available
  useEffect(() => {
    if (!preferences.enabled || !preferences.eventReminders || !calendarAvailable || !calendarContext) return

    const checkEvents = () => {
      // Get events for the next 7 days
      const now = new Date()
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)

      const upcomingEvents = calendarContext.getEventsForDateRange(now, nextWeek)

      // Process events and generate notifications
      const eventNotifications = processEventReminders(upcomingEvents, preferences.eventReminderTimes, notifications)

      // Add new notifications
      if (eventNotifications.length > 0) {
        setNotifications((prev) => [...eventNotifications, ...prev])
      }
    }

    // Check events immediately and then every minute
    checkEvents()
    const interval = setInterval(checkEvents, 60000)

    return () => clearInterval(interval)
  }, [preferences, calendarContext, notifications, calendarAvailable])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
        updatePreferences,
        calendarAvailable,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
