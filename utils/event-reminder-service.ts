import type { CalendarEvent } from "@/types/calendar-event"
import type { Notification } from "@/types/notification"

// Define reminder times in minutes
export type ReminderTime = 5 | 15 | 30 | 60 | 1440 // 5min, 15min, 30min, 1hr, 1day

// Process events and generate notifications for upcoming events
export function processEventReminders(
  events: CalendarEvent[],
  reminderTimes: ReminderTime[],
  existingNotifications: Notification[],
): Notification[] {
  const now = new Date()
  const newNotifications: Notification[] = []

  events.forEach((event) => {
    // Skip past events
    if (event.startTime < now) return

    // Calculate minutes until event starts
    const minutesUntilEvent = Math.floor((event.startTime.getTime() - now.getTime()) / (1000 * 60))

    // Check each reminder time
    reminderTimes.forEach((reminderTime) => {
      // If the event is coming up within the reminder window (with 1 minute tolerance)
      const lowerBound = reminderTime - 1
      const upperBound = reminderTime + 1

      if (minutesUntilEvent >= lowerBound && minutesUntilEvent <= upperBound) {
        // Check if we already have a notification for this event at this reminder time
        const existingNotification = existingNotifications.find(
          (n) => n.eventId === event.id && n.type === "event-reminder" && n.reminderTime === reminderTime && !n.read,
        )

        if (!existingNotification) {
          // Format the time remaining
          let timeText = ""
          if (reminderTime === 5) timeText = "5 minutes"
          else if (reminderTime === 15) timeText = "15 minutes"
          else if (reminderTime === 30) timeText = "30 minutes"
          else if (reminderTime === 60) timeText = "1 hour"
          else if (reminderTime === 1440) timeText = "1 day"

          // Create a new notification
          newNotifications.push({
            id: `event-${event.id}-${reminderTime}-${Date.now()}`,
            type: "event-reminder",
            title: "Upcoming Event",
            message: `Event '${event.title}' starts in ${timeText}`,
            eventId: event.id,
            reminderTime: reminderTime,
            createdAt: new Date().toISOString(),
            read: false,
            actionUrl: `/calendar?event=${event.id}`,
          })
        }
      }
    })
  })

  return newNotifications
}
