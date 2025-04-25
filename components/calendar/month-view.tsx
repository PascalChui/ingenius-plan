"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
  isWeekend,
  addDays,
  isValid,
  isBefore,
} from "date-fns"
import { useCalendar } from "@/contexts/calendar-context"
import type { CalendarEvent } from "@/types/calendar-event"
import { EventModal } from "./event-modal"
import { EventDetails } from "./event-details"
import { cn } from "@/lib/utils"

const categoryColors: Record<string, string> = {
  work: "bg-blue-100 text-blue-800",
  personal: "bg-purple-100 text-purple-800",
  meeting: "bg-red-100 text-red-800",
  appointment: "bg-green-100 text-green-800",
  holiday: "bg-yellow-100 text-yellow-800",
  reminder: "bg-pink-100 text-pink-800",
  booking: "bg-indigo-100 text-indigo-800",
  other: "bg-gray-100 text-gray-800",
}

const categoryDots: Record<string, string> = {
  work: "bg-blue-500",
  personal: "bg-purple-500",
  meeting: "bg-red-500",
  appointment: "bg-green-500",
  holiday: "bg-yellow-500",
  reminder: "bg-pink-500",
  booking: "bg-indigo-500",
  other: "bg-gray-500",
}

export function MonthView() {
  const { viewState, getEventsForDate, rescheduleEvent, events, calendars } = useCalendar()
  const { date } = viewState

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [monthStart, setMonthStart] = useState(startOfMonth(date))
  const [monthEnd, setMonthEnd] = useState(endOfMonth(date))
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([])
  const [calendarMap, setCalendarMap] = useState<Record<string, { name: string; color: string }>>({})

  // Create a map of calendar IDs to calendar objects for quick lookup
  useEffect(() => {
    const map: Record<string, { name: string; color: string }> = {}
    calendars.forEach((cal) => {
      map[cal.id] = { name: cal.name, color: cal.color }
    })
    setCalendarMap(map)
  }, [calendars])

  // Update days when month changes
  useEffect(() => {
    try {
      const start = startOfMonth(date)
      const end = endOfMonth(date)
      setMonthStart(start)
      setMonthEnd(end)

      // Get all days in the month
      const days = eachDayOfInterval({ start, end })

      // Add days from previous month to start on Sunday
      const startDay = getDay(start)
      const prevMonthDays =
        startDay > 0
          ? eachDayOfInterval({
              start: subMonths(start, 1),
              end: subMonths(start, 1),
            }).slice(-startDay)
          : []

      // Add days from next month to end on Saturday
      const endDay = getDay(end)
      const nextMonthDays =
        endDay < 6
          ? eachDayOfInterval({
              start: addMonths(end, 1),
              end: addMonths(end, 1),
            }).slice(0, 6 - endDay)
          : []

      setDaysInMonth([...prevMonthDays, ...days, ...nextMonthDays])
    } catch (error) {
      console.error("Error calculating month days:", error)
      setDaysInMonth([])
    }
  }, [date])

  // Safe date formatting function
  const safeFormat = (date: Date | null | undefined, formatStr: string, fallback = ""): string => {
    try {
      if (!date || !isValid(date)) return fallback
      return format(date, formatStr)
    } catch (error) {
      console.error("Error formatting date:", error)
      return fallback
    }
  }

  // Ensure we have a valid date
  const safeDate = isValid(date) ? date : new Date()

  // Get the start and end of the month safely
  let monthStartOld: Date
  let monthEndOld: Date
  let monthDays: Date[] = []
  let calendarDays: Date[] = []

  try {
    monthStartOld = startOfMonth(safeDate)
    monthEndOld = endOfMonth(safeDate)

    // Validate the interval
    if (!isValid(monthStartOld) || !isValid(monthEndOld) || !isBefore(monthStartOld, monthEndOld)) {
      // If invalid, use current month as fallback
      const today = new Date()
      monthStartOld = startOfMonth(today)
      monthEndOld = endOfMonth(today)
    }

    // Get all days in the month safely
    monthDays = eachDayOfInterval({ start: monthStartOld, end: monthEndOld })

    // Add days from previous and next month to fill the calendar grid
    const startDay = monthStartOld.getDay() || 7 // Convert Sunday (0) to 7
    const endDay = monthEndOld.getDay() || 7

    // Generate previous month days safely
    const prevMonthDays: Date[] = []
    for (let i = 0; i < startDay - 1; i++) {
      const prevDay = addDays(monthStartOld, -(startDay - 1) + i)
      if (isValid(prevDay)) {
        prevMonthDays.push(prevDay)
      }
    }

    // Generate next month days safely
    const nextMonthDays: Date[] = []
    for (let i = 0; i < 7 - endDay; i++) {
      const nextDay = addDays(monthEndOld, i + 1)
      if (isValid(nextDay)) {
        nextMonthDays.push(nextDay)
      }
    }

    // Combine all days
    calendarDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]
  } catch (error) {
    console.error("Error generating month days:", error)
    // Fallback to empty arrays if there's an error
    monthDays = []
    calendarDays = []
  }

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setIsDetailsOpen(true)
  }

  const handleDateClick = (day: Date) => {
    setSelectedDate(day)
    setIsModalOpen(true)
  }

  const isTodayOld = (day: Date): boolean => {
    try {
      if (!isValid(day)) return false
      return isSameDay(day, new Date())
    } catch (error) {
      console.error("Error checking if day is today:", error)
      return false
    }
  }

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData("text/plain", eventId)
    setDraggedEvent(eventId)

    // Create a custom drag image
    const dragImage = document.createElement("div")
    const event = events.find((e) => e.id === eventId)
    dragImage.textContent = event?.title || "Event"
    dragImage.style.padding = "4px 8px"
    dragImage.style.background = "#4299e1"
    dragImage.style.color = "white"
    dragImage.style.borderRadius = "4px"
    dragImage.style.position = "absolute"
    dragImage.style.top = "-1000px"
    document.body.appendChild(dragImage)

    e.dataTransfer.setDragImage(dragImage, 0, 0)

    // Clean up the drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, day: Date) => {
    e.preventDefault()

    if (!isValid(day)) {
      console.error("Invalid drop target date")
      return
    }

    const eventId = e.dataTransfer.getData("text/plain")
    if (!eventId) return

    // Find the original event
    const originalEvent = events.find((e) => e.id === eventId)
    if (!originalEvent) return

    // Create a new date with the day from the drop target and time from the original event
    try {
      const newDate = new Date(day)

      if (!isValid(originalEvent.startTime)) {
        console.error("Invalid event start time")
        return
      }

      newDate.setHours(originalEvent.startTime.getHours())
      newDate.setMinutes(originalEvent.startTime.getMinutes())

      if (!isValid(newDate)) {
        console.error("Invalid new date created")
        return
      }

      // Reschedule the event
      rescheduleEvent(eventId, newDate)
    } catch (error) {
      console.error("Error rescheduling event:", error)
    }

    setDraggedEvent(null)
  }

  const handleDragEnd = () => {
    setDraggedEvent(null)
  }

  // Function to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  // Function to get calendar color for an event
  const getEventColor = (event: CalendarEvent) => {
    return calendarMap[event.calendarId]?.color || "#3b82f6" // Default to blue if not found
  }

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-white p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 gap-px bg-gray-200 overflow-auto">
        {daysInMonth.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, date)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isTodayDate = isToday(day)
          const isWeekendDay = isWeekend(day)
          const dayEvents = getEventsForDate(day)

          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] bg-white p-1 relative flex flex-col",
                !isCurrentMonth && "bg-gray-50 text-gray-400",
                isWeekendDay && "bg-gray-50",
                isSelected && "ring-2 ring-blue-500 z-10",
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className={cn("flex justify-between items-center p-1", isTodayDate && "font-bold text-blue-600")}>
                <span className="text-sm">{format(day, "d")}</span>
                {isTodayDate && <span className="text-xs bg-blue-100 px-1 rounded">Today</span>}
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 text-xs">
                {dayEvents
                  .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                  .map((event) => {
                    const eventColor = getEventColor(event)
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "px-1 py-0.5 rounded cursor-pointer hover:opacity-80 flex items-center gap-1",
                          event.allDay ? "font-medium" : "",
                        )}
                        style={{
                          backgroundColor: `${eventColor}20`, // 20% opacity
                          borderLeft: `3px solid ${eventColor}`,
                          color: eventColor,
                        }}
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        {!event.allDay && (
                          <span className="whitespace-nowrap">{format(event.startTime, "h:mm a")}</span>
                        )}
                        <span className="truncate">{truncateText(event.title, 20)}</span>
                        {event.recurrence && <span title="Recurring event">↻</span>}
                      </div>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </div>

      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />

      <EventDetails
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedEvent(null)
        }}
      />
    </div>
  )
}
