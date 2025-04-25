"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, addHours } from "date-fns"
import { useCalendar } from "@/contexts/calendar-context"
import { EventModal } from "./event-modal"
import { EventDetails } from "./event-details"
import type { CalendarEvent } from "@/types/calendar-event"
import { cn } from "@/lib/utils"

// Generate time slots for the day
const timeSlots = Array.from({ length: 24 }, (_, i) => i)

export function WeekView() {
  const { viewState, getEventsForDateRange, calendars } = useCalendar()
  const { date } = viewState
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const [weekEvents, setWeekEvents] = useState<CalendarEvent[]>([])
  const [calendarMap, setCalendarMap] = useState<Record<string, { name: string; color: string }>>({})

  // Create a map of calendar IDs to calendar objects for quick lookup
  useEffect(() => {
    const map: Record<string, { name: string; color: string }> = {}
    calendars.forEach((cal) => {
      map[cal.id] = { name: cal.name, color: cal.color }
    })
    setCalendarMap(map)
  }, [calendars])

  // Update days when week changes
  useEffect(() => {
    try {
      const start = startOfWeek(date, { weekStartsOn: 0 }) // 0 = Sunday
      const end = endOfWeek(date, { weekStartsOn: 0 })
      const days = eachDayOfInterval({ start, end })
      setWeekDays(days)

      // Get all events for the week
      const events = getEventsForDateRange(start, end)
      setWeekEvents(events)
    } catch (error) {
      console.error("Error calculating week days:", error)
      setWeekDays([])
      setWeekEvents([])
    }
  }, [date, getEventsForDateRange])

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const selectedDateTime = new Date(day)
    selectedDateTime.setHours(hour, 0, 0, 0)
    setSelectedDate(selectedDateTime)
    setSelectedTime(hour)
    setIsModalOpen(true)
  }

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setIsDetailsOpen(true)
  }

  // Function to get calendar color for an event
  const getEventColor = (event: CalendarEvent) => {
    return calendarMap[event.calendarId]?.color || "#3b82f6" // Default to blue if not found
  }

  // Function to position an event in the grid
  const getEventPosition = (event: CalendarEvent) => {
    const eventDay = event.startTime.getDay()
    const startHour = event.startTime.getHours() + event.startTime.getMinutes() / 60
    const endHour = event.endTime.getHours() + event.endTime.getMinutes() / 60
    const duration = endHour - startHour

    return {
      gridColumnStart: eventDay + 1,
      gridRowStart: Math.floor(startHour) + 1,
      gridRowEnd: Math.ceil(endHour) + 1,
      height: `${duration * 100}%`,
      top: `${(startHour - Math.floor(startHour)) * 100}%`,
    }
  }

  return (
    <div className="h-[calc(100vh-300px)] overflow-auto">
      <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
        <div className="border-r p-2 text-center text-sm font-medium">Time</div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn("p-2 text-center border-r", isToday(day) && "bg-blue-50 font-bold")}
          >
            <div className="text-sm font-medium">{format(day, "EEE")}</div>
            <div className="text-sm">{format(day, "MMM d")}</div>
          </div>
        ))}
      </div>

      <div className="relative grid grid-cols-8">
        {/* Time slots */}
        {timeSlots.map((hour) => (
          <div key={hour} className="grid grid-cols-8 col-span-8 border-b">
            <div className="border-r p-1 text-xs text-right pr-2">
              {format(addHours(new Date().setHours(0, 0, 0, 0), hour), "h a")}
            </div>
            {weekDays.map((day) => (
              <div
                key={`${day.toISOString()}-${hour}`}
                className="border-r h-12 cursor-pointer hover:bg-gray-50"
                onClick={() => handleTimeSlotClick(day, hour)}
              ></div>
            ))}
          </div>
        ))}

        {/* Events */}
        {weekEvents.map((event) => {
          if (event.allDay) return null // Skip all-day events for now
          const eventColor = getEventColor(event)
          const position = getEventPosition(event)

          return (
            <div
              key={event.id}
              className="absolute rounded p-1 overflow-hidden cursor-pointer hover:opacity-90 z-10 border"
              style={{
                ...position,
                backgroundColor: `${eventColor}20`, // 20% opacity
                borderColor: eventColor,
                color: eventColor,
                width: "calc(100% - 8px)",
                marginLeft: "4px",
              }}
              onClick={(e) => handleEventClick(event, e)}
            >
              <div className="text-xs font-medium truncate">{event.title}</div>
              <div className="text-xs truncate">
                {format(event.startTime, "h:mm a")} - {format(event.endTime, "h:mm a")}
                {event.recurrence && " ↻"}
              </div>
            </div>
          )
        })}
      </div>

      {/* All-day events */}
      <div className="mt-4 border rounded-md p-2">
        <h3 className="text-sm font-medium mb-2">All-day & Multi-day Events</h3>
        <div className="space-y-1">
          {weekEvents
            .filter((event) => event.allDay)
            .map((event) => {
              const eventColor = getEventColor(event)
              return (
                <div
                  key={event.id}
                  className="p-1 rounded cursor-pointer text-sm flex items-center gap-2"
                  style={{
                    backgroundColor: `${eventColor}20`, // 20% opacity
                    borderLeft: `3px solid ${eventColor}`,
                    color: eventColor,
                  }}
                  onClick={(e) => handleEventClick(event, e)}
                >
                  <span className="font-medium">{event.title}</span>
                  <span className="text-xs">
                    {format(event.startTime, "MMM d")}
                    {!isSameDay(event.startTime, event.endTime) && ` - ${format(event.endTime, "MMM d")}`}
                    {event.recurrence && " ↻"}
                  </span>
                </div>
              )
            })}
        </div>
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
