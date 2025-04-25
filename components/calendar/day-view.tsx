"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, addHours } from "date-fns"
import { useCalendar } from "@/contexts/calendar-context"
import { EventModal } from "./event-modal"
import { EventDetails } from "./event-details"
import type { CalendarEvent } from "@/types/calendar-event"

// Generate time slots for the day
const timeSlots = Array.from({ length: 24 }, (_, i) => i)

export function DayView() {
  const { viewState, getEventsForDate, calendars } = useCalendar()
  const { date } = viewState
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([])
  const [calendarMap, setCalendarMap] = useState<Record<string, { name: string; color: string }>>({})

  // Create a map of calendar IDs to calendar objects for quick lookup
  useEffect(() => {
    const map: Record<string, { name: string; color: string }> = {}
    calendars.forEach((cal) => {
      map[cal.id] = { name: cal.name, color: cal.color }
    })
    setCalendarMap(map)
  }, [calendars])

  // Update events when date changes
  useEffect(() => {
    try {
      const events = getEventsForDate(date)
      setDayEvents(events)
    } catch (error) {
      console.error("Error fetching day events:", error)
      setDayEvents([])
    }
  }, [date, getEventsForDate])

  const handleTimeSlotClick = (hour: number) => {
    const selectedDate = new Date(date)
    selectedDate.setHours(hour, 0, 0, 0)
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
    const startHour = event.startTime.getHours() + event.startTime.getMinutes() / 60
    const endHour = event.endTime.getHours() + event.endTime.getMinutes() / 60
    const duration = endHour - startHour

    return {
      gridRowStart: Math.floor(startHour) + 1,
      gridRowEnd: Math.ceil(endHour) + 1,
      height: `${duration * 100}%`,
      top: `${(startHour - Math.floor(startHour)) * 100}%`,
    }
  }

  return (
    <div className="h-[calc(100vh-300px)] overflow-auto">
      <div className="sticky top-0 bg-white z-10 p-2 text-center border-b">
        <h2 className="text-lg font-semibold">{format(date, "EEEE, MMMM d, yyyy")}</h2>
      </div>

      <div className="grid grid-cols-[80px_1fr] relative">
        {/* Time slots */}
        {timeSlots.map((hour) => (
          <div key={hour} className="grid grid-cols-[80px_1fr] col-span-2 border-b">
            <div className="border-r p-1 text-xs text-right pr-2">
              {format(addHours(new Date().setHours(0, 0, 0, 0), hour), "h a")}
            </div>
            <div className="h-12 cursor-pointer hover:bg-gray-50" onClick={() => handleTimeSlotClick(hour)}></div>
          </div>
        ))}

        {/* Events */}
        {dayEvents
          .filter((event) => !event.allDay)
          .map((event) => {
            const eventColor = getEventColor(event)
            const position = getEventPosition(event)

            return (
              <div
                key={event.id}
                className="absolute rounded p-2 overflow-hidden cursor-pointer hover:opacity-90 z-10 border left-[80px] right-0"
                style={{
                  ...position,
                  backgroundColor: `${eventColor}20`, // 20% opacity
                  borderColor: eventColor,
                  color: eventColor,
                }}
                onClick={(e) => handleEventClick(event, e)}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs">
                  {format(event.startTime, "h:mm a")} - {format(event.endTime, "h:mm a")}
                  {event.location && ` • ${event.location}`}
                  {event.recurrence && " ↻"}
                </div>
              </div>
            )
          })}
      </div>

      {/* All-day events */}
      <div className="mt-4 border rounded-md p-2">
        <h3 className="text-sm font-medium mb-2">All-day Events</h3>
        <div className="space-y-1">
          {dayEvents
            .filter((event) => event.allDay)
            .map((event) => {
              const eventColor = getEventColor(event)
              return (
                <div
                  key={event.id}
                  className="p-2 rounded cursor-pointer"
                  style={{
                    backgroundColor: `${eventColor}20`, // 20% opacity
                    borderLeft: `3px solid ${eventColor}`,
                    color: eventColor,
                  }}
                  onClick={(e) => handleEventClick(event, e)}
                >
                  <div className="font-medium">{event.title}</div>
                  {event.location && <div className="text-sm">{event.location}</div>}
                  {event.recurrence && <div className="text-xs">Recurring event</div>}
                </div>
              )
            })}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={
          selectedTime !== null
            ? (() => {
                const selectedDate = new Date(date)
                selectedDate.setHours(selectedTime, 0, 0, 0)
                return selectedDate
              })()
            : null
        }
      />

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
