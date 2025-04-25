"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  addDays,
  startOfDay,
  endOfDay,
  isWithinInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  differenceInMinutes,
  isValid,
  isBefore,
  getDay,
  getDate,
  getMonth,
  getYear,
  eachDayOfInterval,
  isAfter,
  isSameMonth,
} from "date-fns"
import { v4 as uuidv4 } from "uuid"

import { sampleCalendarEvents } from "@/data/calendar-events"
import type {
  CalendarEvent,
  EventCategory,
  RecurrencePattern,
  WeekDay,
  Calendar,
  CalendarShare,
} from "@/types/calendar-event"
import { getUserById } from "@/data/teams"

type CalendarViewType = "day" | "week" | "month"

interface CalendarViewState {
  date: Date
  view: CalendarViewType
  selectedCategories: EventCategory[]
}

interface CalendarContextType {
  events: CalendarEvent[]
  calendars: Calendar[]
  activeCalendars: string[]
  viewState: CalendarViewState
  setViewState: React.Dispatch<React.SetStateAction<CalendarViewState>>
  getEventsForDate: (date: Date) => CalendarEvent[]
  getEventsForDateRange: (start: Date, end: Date) => CalendarEvent[]
  addEvent: (event: Omit<CalendarEvent, "id" | "createdAt" | "createdBy">) => void
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  deleteRecurringEvent: (id: string) => void
  rescheduleEvent: (id: string, newStartTime: Date) => void
  setView: (view: CalendarViewType) => void
  nextPeriod: () => void
  prevPeriod: () => void
  today: () => void
  toggleCategoryFilter: (category: EventCategory) => void
  getRecurringEventInstances: (event: CalendarEvent, startDate: Date, endDate: Date) => CalendarEvent[]
  shareCalendar: (shareData: Partial<CalendarShare> & { shareType: "user" | "team"; sharedWith: string }) => void
  removeCalendarShare: (shareId: string) => void
  getCalendarShares: () => CalendarShare[]
  toggleCalendarVisibility: (calendarId: string) => void
  updateCalendar: (calendarId: string, updates: Partial<Calendar>) => void
  addCalendar: (calendar: Omit<Calendar, "id" | "createdAt">) => void
  deleteCalendar: (calendarId: string) => void
  userHasEditPermission: (calendarId: string) => boolean
}

// Default categories
const defaultCategories: EventCategory[] = [
  "work",
  "personal",
  "meeting",
  "appointment",
  "holiday",
  "reminder",
  "booking",
  "other",
]

// Default view state
const defaultViewState: CalendarViewState = {
  date: new Date(),
  view: "month",
  selectedCategories: defaultCategories,
}

// Sample calendars
const sampleCalendars: Calendar[] = [
  {
    id: "calendar-1",
    name: "My Calendar",
    ownerId: "user-1", // Current user
    color: "#3b82f6", // blue
    isDefault: true,
    isShared: false,
    visibility: "private",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "calendar-2",
    name: "Work",
    ownerId: "user-1", // Current user
    color: "#22c55e", // green
    isDefault: false,
    isShared: false,
    visibility: "private",
    createdAt: new Date("2024-01-01"),
  },
]

// Sample shared calendars
const sampleSharedCalendars: Calendar[] = [
  {
    id: "calendar-3",
    name: "Team Calendar",
    ownerId: "user-2", // Jane Smith
    color: "#a855f7", // purple
    isDefault: false,
    isShared: true,
    visibility: "shared",
    createdAt: new Date("2024-02-15"),
  },
]

// Sample calendar shares
const sampleCalendarShares: CalendarShare[] = [
  {
    id: "share-1",
    calendarId: "calendar-1",
    sharedWith: "user-2", // Jane Smith
    shareType: "user",
    permission: "view",
    sharedBy: "user-1", // Current user
    sharedAt: new Date("2024-03-10"),
  },
  {
    id: "share-2",
    calendarId: "calendar-1",
    sharedWith: "team-1", // Product Development team
    shareType: "team",
    permission: "edit",
    sharedBy: "user-1", // Current user
    sharedAt: new Date("2024-03-15"),
  },
]

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

// Update the CalendarProviderProps interface to include initialView
interface CalendarProviderProps {
  children: React.ReactNode
  initialView?: "day" | "week" | "month"
}

// Update the CalendarProvider component to use the initialView prop
export function CalendarProvider({ children, initialView = "week" }: CalendarProviderProps) {
  // Ensure we start with a valid date
  const initialDate = new Date()

  const [events, setEvents] = useState<CalendarEvent[]>(sampleCalendarEvents)
  const [calendars, setCalendars] = useState<Calendar[]>([...sampleCalendars, ...sampleSharedCalendars])
  const [calendarShares, setCalendarShares] = useState<CalendarShare[]>(sampleCalendarShares)
  const [activeCalendars, setActiveCalendars] = useState<string[]>(
    [...sampleCalendars, ...sampleSharedCalendars].map((cal) => cal.id),
  )

  // In the useState for viewState, use initialView instead of hardcoded "week"
  const [viewState, setViewState] = useState<CalendarViewState>({
    ...defaultViewState,
    date: initialDate,
    view: initialView,
  })

  // Helper function to ensure we have a valid date
  const ensureValidDate = (date: Date): Date => {
    return isValid(date) ? date : new Date()
  }

  // Helper function to convert WeekDay to number (0-6, Sunday is 0)
  const weekDayToNumber = (weekDay: WeekDay): number => {
    const map: Record<WeekDay, number> = {
      SU: 0,
      MO: 1,
      TU: 2,
      WE: 3,
      TH: 4,
      FR: 5,
      SA: 6,
    }
    return map[weekDay]
  }

  // Helper function to check if a date matches a recurrence pattern
  const dateMatchesRecurrence = (date: Date, startDate: Date, recurrence: RecurrencePattern): boolean => {
    if (!isValid(date) || !isValid(startDate) || !recurrence) return false

    // Check if date is before the start date
    if (isBefore(date, startDate)) return false

    // Check if date is after the end date (if specified)
    if (recurrence.endDate && isAfter(date, recurrence.endDate)) return false

    // Check frequency-specific conditions
    switch (recurrence.frequency) {
      case "daily":
        // For daily recurrence, check if the number of days since start is divisible by interval
        const daysSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceStart % recurrence.interval === 0

      case "weekly":
        // For weekly recurrence, check if the day of week matches and the week number is correct
        const weeksSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))

        // If weeks don't match the interval, return false
        if (weeksSinceStart % recurrence.interval !== 0) return false

        // If weekDays is specified, check if the day of week is included
        if (recurrence.weekDays && recurrence.weekDays.length > 0) {
          const dayOfWeek = getDay(date)
          const weekDayNumbers = recurrence.weekDays.map(weekDayToNumber)
          return weekDayNumbers.includes(dayOfWeek)
        }

        // If no weekDays specified, check if it's the same day of week as the start date
        return getDay(date) === getDay(startDate)

      case "monthly":
        // For monthly recurrence, check if the month number is correct
        const monthsSinceStart = (getYear(date) - getYear(startDate)) * 12 + (getMonth(date) - getMonth(startDate))

        // If months don't match the interval, return false
        if (monthsSinceStart % recurrence.interval !== 0) return false

        // If monthDay is specified, check if the day of month matches
        if (recurrence.monthDay) {
          return getDate(date) === recurrence.monthDay
        }

        // If monthWeek and monthWeekDay are specified, check if it's the nth occurrence of that day in the month
        if (recurrence.monthWeek && recurrence.monthWeekDay) {
          const dayOfWeek = getDay(date)
          const targetDayOfWeek = weekDayToNumber(recurrence.monthWeekDay)

          // If day of week doesn't match, return false
          if (dayOfWeek !== targetDayOfWeek) return false

          // Calculate which occurrence of this day it is in the month
          const firstDayOfMonth = new Date(date)
          firstDayOfMonth.setDate(1)

          let dayCount = 0
          let currentDay = firstDayOfMonth

          while (isSameMonth(currentDay, date) && isBefore(currentDay, date)) {
            if (getDay(currentDay) === targetDayOfWeek) {
              dayCount++
            }
            currentDay = addDays(currentDay, 1)
          }

          // Special case for "last" occurrence (monthWeek = 5)
          if (recurrence.monthWeek === 5) {
            // Check if there are no more occurrences of this day in the month
            const nextOccurrence = addDays(date, 7)
            return !isSameMonth(nextOccurrence, date)
          }

          return dayCount === recurrence.monthWeek
        }

        // If neither monthDay nor monthWeek+monthWeekDay specified, check if it's the same day of month as the start date
        return getDate(date) === getDate(startDate)

      case "yearly":
        // For yearly recurrence, check if the year number is correct and it's the same day of year
        const yearsSinceStart = getYear(date) - getYear(startDate)

        // If years don't match the interval, return false
        if (yearsSinceStart % recurrence.interval !== 0) return false

        // Check if it's the same month and day
        return getMonth(date) === getMonth(startDate) && getDate(date) === getDate(startDate)

      default:
        return false
    }
  }

  // Generate recurring event instances for a date range
  const getRecurringEventInstances = (event: CalendarEvent, startDate: Date, endDate: Date): CalendarEvent[] => {
    if (!event.recurrence) return [event]

    const instances: CalendarEvent[] = []
    const safeStartDate = ensureValidDate(startDate)
    const safeEndDate = ensureValidDate(endDate)

    // If the event is outside the date range, return empty array
    if (
      isAfter(event.startTime, safeEndDate) ||
      (event.recurrence.endDate && isBefore(event.recurrence.endDate, safeStartDate))
    ) {
      return []
    }

    // Generate all dates in the range
    const dateRange = eachDayOfInterval({ start: safeStartDate, end: safeEndDate })

    // Check each date if it matches the recurrence pattern
    for (const date of dateRange) {
      if (dateMatchesRecurrence(date, event.startTime, event.recurrence)) {
        // Create a new instance for this date
        const instanceStartTime = new Date(date)
        instanceStartTime.setHours(
          event.startTime.getHours(),
          event.startTime.getMinutes(),
          event.startTime.getSeconds(),
        )

        const duration = differenceInMinutes(event.endTime, event.startTime)
        const instanceEndTime = new Date(instanceStartTime)
        instanceEndTime.setMinutes(instanceEndTime.getMinutes() + duration)

        instances.push({
          ...event,
          id: `${event.id}-${date.toISOString()}`,
          startTime: instanceStartTime,
          endTime: instanceEndTime,
          recurrenceId: event.id,
          isException: false,
        })
      }
    }

    return instances
  }

  const getEventsForDate = (date: Date) => {
    const safeDate = ensureValidDate(date)
    const dayStart = startOfDay(safeDate)
    const dayEnd = endOfDay(safeDate)

    // Get all events that might occur on this date
    const allEvents = events.filter((event) => {
      // Filter by selected categories
      if (!viewState.selectedCategories?.includes(event.category)) {
        return false
      }

      // Filter by active calendars
      if (!activeCalendars.includes(event.calendarId)) {
        return false
      }

      return true
    })

    // Process regular events
    const regularEvents = allEvents
      .filter((event) => !event.recurrence)
      .filter((event) => {
        return (
          isWithinInterval(event.startTime, { start: dayStart, end: dayEnd }) ||
          (event.endTime && isWithinInterval(event.endTime, { start: dayStart, end: dayEnd })) ||
          (event.startTime <= dayStart && event.endTime && event.endTime >= dayEnd)
        )
      })

    // Process recurring events
    const recurringEvents = allEvents
      .filter((event) => event.recurrence)
      .flatMap((event) => getRecurringEventInstances(event, dayStart, dayEnd))
      .filter((event) => {
        return (
          isWithinInterval(event.startTime, { start: dayStart, end: dayEnd }) ||
          (event.endTime && isWithinInterval(event.endTime, { start: dayStart, end: dayEnd })) ||
          (event.startTime <= dayStart && event.endTime && event.endTime >= dayEnd)
        )
      })

    return [...regularEvents, ...recurringEvents]
  }

  const getEventsForDateRange = (start: Date, end: Date) => {
    const safeStart = ensureValidDate(start)
    const safeEnd = ensureValidDate(end)

    // Get all events that might occur in this date range
    const allEvents = events.filter((event) => {
      // Filter by selected categories
      if (!viewState.selectedCategories?.includes(event.category)) {
        return false
      }

      // Filter by active calendars
      if (!activeCalendars.includes(event.calendarId)) {
        return false
      }

      return true
    })

    // Process regular events
    const regularEvents = allEvents
      .filter((event) => !event.recurrence)
      .filter((event) => {
        return (
          isWithinInterval(event.startTime, { start: safeStart, end: safeEnd }) ||
          (event.endTime && isWithinInterval(event.endTime, { start: safeStart, end: safeEnd })) ||
          (event.startTime <= safeStart && event.endTime && event.endTime >= safeEnd)
        )
      })

    // Process recurring events
    const recurringEvents = allEvents
      .filter((event) => event.recurrence)
      .flatMap((event) => getRecurringEventInstances(event, safeStart, safeEnd))
      .filter((event) => {
        return (
          isWithinInterval(event.startTime, { start: safeStart, end: safeEnd }) ||
          (event.endTime && isWithinInterval(event.endTime, { start: safeStart, end: safeEnd })) ||
          (event.startTime <= safeStart && event.endTime && event.endTime >= safeEnd)
        )
      })

    return [...regularEvents, ...recurringEvents]
  }

  const addEvent = (event: Omit<CalendarEvent, "id" | "createdAt" | "createdBy">) => {
    // Default to the first active calendar if not specified
    const calendarId = event.calendarId || activeCalendars[0] || calendars[0].id

    const newEvent: CalendarEvent = {
      id: uuidv4(),
      createdAt: new Date(),
      createdBy: "user-1", // Current user ID
      calendarId,
      ...event,
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (id: string, updatedFields: Partial<CalendarEvent>) => {
    setEvents((prev) => {
      return prev.map((event) => {
        // If this is the event to update
        if (event.id === id) {
          // If this is a recurring event instance (has recurrenceId)
          if (event.recurrenceId) {
            // Create an exception for this instance
            const updatedEvent: CalendarEvent = {
              ...event,
              ...updatedFields,
              isException: true,
              updatedAt: new Date(),
            }
            return updatedEvent
          }

          // Regular event update
          return {
            ...event,
            ...updatedFields,
            updatedAt: new Date(),
          }
        }
        return event
      })
    })
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => {
      // Find the event to delete
      const eventToDelete = prev.find((e) => e.id === id)

      // If not found, just filter out the ID
      if (!eventToDelete) {
        return prev.filter((event) => event.id !== id)
      }

      // If this is a recurring event instance (has recurrenceId)
      if (eventToDelete.recurrenceId) {
        // Create an exception for this instance in the parent event
        const parentEvent = prev.find((e) => e.id === eventToDelete.recurrenceId)

        if (parentEvent && parentEvent.recurrence) {
          // Add this date to exceptions
          const exceptions = parentEvent.recurrence.exceptions || []
          const newExceptions = [...exceptions, eventToDelete.startTime]

          // Update the parent event
          return prev
            .map((event) => {
              if (event.id === parentEvent.id) {
                return {
                  ...event,
                  recurrence: {
                    ...event.recurrence,
                    exceptions: newExceptions,
                  },
                }
              }
              return event
            })
            .filter((event) => event.id !== id)
        }
      }

      // Regular event deletion
      return prev.filter((event) => event.id !== id)
    })
  }

  const deleteRecurringEvent = (id: string) => {
    setEvents((prev) => {
      // Delete the main recurring event and all exceptions
      return prev.filter((event) => event.id !== id && event.recurrenceId !== id)
    })
  }

  const rescheduleEvent = (id: string, newStartTime: Date) => {
    const safeNewStartTime = ensureValidDate(newStartTime)

    setEvents((prev) => {
      return prev.map((event) => {
        if (event.id === id) {
          // Calculate the duration of the event
          const duration = event.endTime ? differenceInMinutes(event.endTime, event.startTime) : 60 // Default 1 hour if no end time

          // Create a new end time based on the same duration
          const newEndTime = new Date(safeNewStartTime)
          newEndTime.setMinutes(newEndTime.getMinutes() + duration)

          // If this is a recurring event instance
          if (event.recurrenceId) {
            // Create an exception for this instance
            return {
              ...event,
              startTime: safeNewStartTime,
              endTime: newEndTime,
              isException: true,
              updatedAt: new Date(),
            }
          }

          // Regular event rescheduling
          return {
            ...event,
            startTime: safeNewStartTime,
            endTime: newEndTime,
            updatedAt: new Date(),
          }
        }
        return event
      })
    })
  }

  const setView = (view: CalendarViewType) => {
    setViewState((prev) => ({ ...prev, view }))
  }

  const nextPeriod = () => {
    setViewState((prev) => {
      const { date, view } = prev
      const safeDate = ensureValidDate(date)
      let newDate

      switch (view) {
        case "day":
          newDate = addDays(safeDate, 1)
          break
        case "week":
          newDate = addWeeks(safeDate, 1)
          break
        case "month":
          newDate = addMonths(safeDate, 1)
          break
        default:
          newDate = safeDate
      }

      return { ...prev, date: newDate }
    })
  }

  const prevPeriod = () => {
    setViewState((prev) => {
      const { date, view } = prev
      const safeDate = ensureValidDate(date)
      let newDate

      switch (view) {
        case "day":
          newDate = addDays(safeDate, -1)
          break
        case "week":
          newDate = subWeeks(safeDate, 1)
          break
        case "month":
          newDate = subMonths(safeDate, 1)
          break
        default:
          newDate = safeDate
      }

      return { ...prev, date: newDate }
    })
  }

  const today = () => {
    setViewState((prev) => ({ ...prev, date: new Date() }))
  }

  const toggleCategoryFilter = (category: EventCategory) => {
    setViewState((prev) => {
      // Ensure we have a valid selectedCategories array
      const selectedCategories = [...(prev.selectedCategories || defaultCategories)]
      const index = selectedCategories.indexOf(category)

      if (index === -1) {
        selectedCategories.push(category)
      } else {
        selectedCategories.splice(index, 1)
      }

      return { ...prev, selectedCategories }
    })
  }

  const toggleCalendarVisibility = (calendarId: string) => {
    setActiveCalendars((prev) => {
      const isActive = prev.includes(calendarId)
      if (isActive) {
        return prev.filter((id) => id !== calendarId)
      } else {
        return [...prev, calendarId]
      }
    })
  }

  const shareCalendar = (shareData: Partial<CalendarShare> & { shareType: "user" | "team"; sharedWith: string }) => {
    // Default to the first calendar if not specified
    const calendarId = shareData.calendarId || calendars[0].id

    // If updating an existing share
    if (shareData.id) {
      setCalendarShares((prev) =>
        prev.map((share) => (share.id === shareData.id ? { ...share, ...shareData, updatedAt: new Date() } : share)),
      )
      return
    }

    // Creating a new share
    const newShare: CalendarShare = {
      id: uuidv4(),
      calendarId,
      sharedWith: shareData.sharedWith,
      shareType: shareData.shareType,
      permission: shareData.permission || "view",
      sharedBy: "user-1", // Current user ID
      sharedAt: new Date(),
    }

    setCalendarShares((prev) => [...prev, newShare])

    // Update calendar visibility if needed
    if (shareData.shareType === "user") {
      // In a real app, we would notify the user about the shared calendar
      console.log(`Calendar shared with user ${shareData.sharedWith}`)
    } else {
      // In a real app, we would notify all team members
      console.log(`Calendar shared with team ${shareData.sharedWith}`)
    }
  }

  const removeCalendarShare = (shareId: string) => {
    setCalendarShares((prev) => prev.filter((share) => share.id !== shareId))
  }

  const getCalendarShares = () => {
    // In a real app, we would filter by the current user's calendars
    return calendarShares
  }

  // Add owner name to shared calendars
  useEffect(() => {
    setCalendars((prev) =>
      prev.map((calendar) => {
        if (calendar.isShared) {
          const owner = getUserById(calendar.ownerId)
          return {
            ...calendar,
            ownerName: owner?.name || "Unknown",
          }
        }
        return calendar
      }),
    )
  }, [])

  // New function to update calendar properties
  const updateCalendar = (calendarId: string, updates: Partial<Calendar>) => {
    setCalendars((prev) =>
      prev.map((calendar) => {
        if (calendar.id === calendarId) {
          return {
            ...calendar,
            ...updates,
            updatedAt: new Date(),
          }
        }
        return calendar
      }),
    )
  }

  // New function to add a new calendar
  const addCalendar = (calendar: Omit<Calendar, "id" | "createdAt">) => {
    const newCalendar: Calendar = {
      id: uuidv4(),
      createdAt: new Date(),
      ...calendar,
    }
    setCalendars((prev) => [...prev, newCalendar])

    // Automatically make the new calendar active
    setActiveCalendars((prev) => [...prev, newCalendar.id])
  }

  // New function to delete a calendar
  const deleteCalendar = (calendarId: string) => {
    // Don't allow deleting the default calendar
    const calendarToDelete = calendars.find((cal) => cal.id === calendarId)
    if (calendarToDelete?.isDefault) {
      console.error("Cannot delete the default calendar")
      return
    }

    // Remove the calendar
    setCalendars((prev) => prev.filter((cal) => cal.id !== calendarId))

    // Remove from active calendars
    setActiveCalendars((prev) => prev.filter((id) => id !== calendarId))

    // Remove all events in this calendar
    setEvents((prev) => prev.filter((event) => event.calendarId !== calendarId))

    // Remove all shares for this calendar
    setCalendarShares((prev) => prev.filter((share) => share.calendarId !== calendarId))
  }

  // Check if user has edit permission for a calendar
  const userHasEditPermission = (calendarId: string): boolean => {
    const calendar = calendars.find((cal) => cal.id === calendarId)

    // User owns the calendar
    if (calendar && calendar.ownerId === "user-1") {
      return true
    }

    // Check shares
    const share = calendarShares.find(
      (share) =>
        share.calendarId === calendarId &&
        (share.sharedWith === "user-1" || (share.shareType === "team" && userIsInTeam(share.sharedWith, "user-1"))),
    )

    return share?.permission === "edit" || share?.permission === "admin"
  }

  // Helper function to check if user is in team (simplified)
  const userIsInTeam = (teamId: string, userId: string): boolean => {
    // In a real app, this would check the team membership
    return true
  }

  return (
    <CalendarContext.Provider
      value={{
        events,
        calendars,
        activeCalendars,
        viewState,
        setViewState,
        getEventsForDate,
        getEventsForDateRange,
        addEvent,
        updateEvent,
        deleteEvent,
        deleteRecurringEvent,
        rescheduleEvent,
        setView,
        nextPeriod,
        prevPeriod,
        today,
        toggleCategoryFilter,
        getRecurringEventInstances,
        shareCalendar,
        removeCalendarShare,
        getCalendarShares,
        toggleCalendarVisibility,
        updateCalendar,
        addCalendar,
        deleteCalendar,
        userHasEditPermission,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider")
  }
  return context
}
