import { format } from "date-fns"
import type { CalendarEvent, RecurrencePattern, WeekDay } from "@/types/calendar-event"

// Format date to iCal format (YYYYMMDDTHHmmssZ)
function formatDateToIcal(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss'Z'")
}

// Convert weekday to iCal format
function weekDayToIcal(weekDay: WeekDay): string {
  const map: Record<WeekDay, string> = {
    SU: "SU",
    MO: "MO",
    TU: "TU",
    WE: "WE",
    TH: "TH",
    FR: "FR",
    SA: "SA",
  }
  return map[weekDay]
}

// Generate RRULE for recurring events
function generateRecurrenceRule(recurrence: RecurrencePattern): string {
  if (!recurrence) return ""

  let rrule = `RRULE:FREQ=${recurrence.frequency.toUpperCase()};INTERVAL=${recurrence.interval}`

  // Add weekdays for weekly recurrence
  if (recurrence.frequency === "weekly" && recurrence.weekDays && recurrence.weekDays.length > 0) {
    const days = recurrence.weekDays.map(weekDayToIcal).join(",")
    rrule += `;BYDAY=${days}`
  }

  // Add monthday for monthly recurrence
  if (recurrence.frequency === "monthly" && recurrence.monthDay) {
    rrule += `;BYMONTHDAY=${recurrence.monthDay}`
  }

  // Add month week and weekday for monthly recurrence
  if (recurrence.frequency === "monthly" && recurrence.monthWeek && recurrence.monthWeekDay) {
    rrule += `;BYDAY=${recurrence.monthWeek}${weekDayToIcal(recurrence.monthWeekDay)}`
  }

  // Add end date or count if specified
  if (recurrence.endDate) {
    rrule += `;UNTIL=${formatDateToIcal(recurrence.endDate)}`
  } else if (recurrence.count) {
    rrule += `;COUNT=${recurrence.count}`
  }

  // Add exceptions if specified
  if (recurrence.exceptions && recurrence.exceptions.length > 0) {
    const exdates = recurrence.exceptions.map(formatDateToIcal).join(",")
    rrule += `\r\nEXDATE:${exdates}`
  }

  return rrule
}

// Generate a unique ID for each event
function generateUid(event: CalendarEvent): string {
  return `${event.id}@ingenius-plan.app`
}

// Convert a single event to iCal format
function eventToIcal(event: CalendarEvent): string {
  let icalEvent = "BEGIN:VEVENT\r\n"
  icalEvent += `UID:${generateUid(event)}\r\n`
  icalEvent += `DTSTAMP:${formatDateToIcal(new Date())}\r\n`
  icalEvent += `DTSTART:${formatDateToIcal(event.startTime)}\r\n`
  icalEvent += `DTEND:${formatDateToIcal(event.endTime)}\r\n`
  icalEvent += `SUMMARY:${event.title}\r\n`

  if (event.description) {
    icalEvent += `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}\r\n`
  }

  if (event.location) {
    icalEvent += `LOCATION:${event.location}\r\n`
  }

  icalEvent += `CATEGORIES:${event.category}\r\n`

  if (event.recurrence) {
    icalEvent += `${generateRecurrenceRule(event.recurrence)}\r\n`
  }

  icalEvent += "END:VEVENT\r\n"
  return icalEvent
}

// Generate iCal file content for multiple events
export function generateIcalFile(events: CalendarEvent[]): string {
  let icalContent = "BEGIN:VCALENDAR\r\n"
  icalContent += "VERSION:2.0\r\n"
  icalContent += "PRODID:-//IngeniusPlan//Calendar//EN\r\n"
  icalContent += "CALSCALE:GREGORIAN\r\n"
  icalContent += "METHOD:PUBLISH\r\n"

  // Add each event
  events.forEach((event) => {
    // Skip recurring event instances (we'll handle them through the parent event's RRULE)
    if (!event.recurrenceId) {
      icalContent += eventToIcal(event)
    }
  })

  icalContent += "END:VCALENDAR"
  return icalContent
}

// Download iCal file
export function downloadIcalFile(events: CalendarEvent[], filename = "calendar.ics"): void {
  const icalContent = generateIcalFile(events)
  const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export calendar for a specific date range
export function exportCalendarRange(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date,
  filename = "calendar.ics",
): void {
  // Filter events within the date range
  const filteredEvents = events.filter((event) => {
    // Include events that start or end within the range
    const eventStart = event.startTime
    const eventEnd = event.endTime

    return (
      (eventStart >= startDate && eventStart <= endDate) ||
      (eventEnd >= startDate && eventEnd <= endDate) ||
      (eventStart <= startDate && eventEnd >= endDate)
    )
  })

  downloadIcalFile(filteredEvents, filename)
}

// Export calendar for a specific view (day, week, month)
export function exportCalendarView(
  events: CalendarEvent[],
  view: "day" | "week" | "month",
  date: Date,
  filename = "calendar.ics",
): void {
  let startDate: Date
  let endDate: Date

  // Determine date range based on view
  switch (view) {
    case "day":
      startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      break
    case "week":
      startDate = new Date(date)
      const dayOfWeek = startDate.getDay()
      startDate.setDate(startDate.getDate() - dayOfWeek)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)
      break
    case "month":
      startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
      break
    default:
      startDate = new Date(date)
      endDate = new Date(date)
      break
  }

  exportCalendarRange(events, startDate, endDate, filename)
}
