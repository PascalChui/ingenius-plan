"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays } from "date-fns"
import { useCalendar } from "@/contexts/calendar-context"
import type { CalendarEvent } from "@/types/calendar-event"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer } from "lucide-react"

interface PrintViewProps {
  isOpen: boolean
  onClose: () => void
}

export function PrintView({ isOpen, onClose }: PrintViewProps) {
  const { viewState, getEventsForDate, getEventsForDateRange } = useCalendar()
  const { date } = viewState
  const [printView, setPrintView] = useState<"day" | "week" | "month">("month")
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    if (isOpen) {
      // Get events based on the selected view
      const today = new Date(date)

      if (printView === "day") {
        setEvents(getEventsForDate(today))
      } else if (printView === "week") {
        // Get week start and end
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay() + 1) // Monday
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6) // Sunday

        setEvents(getEventsForDateRange(weekStart, weekEnd))
      } else {
        // Get month start and end
        const monthStart = startOfMonth(today)
        const monthEnd = endOfMonth(today)

        setEvents(getEventsForDateRange(monthStart, monthEnd))
      }
    }
  }, [isOpen, printView, date, getEventsForDate, getEventsForDateRange])

  const handlePrint = () => {
    // Open print dialog
    window.print()
  }

  // Format date safely
  const safeFormat = (dateToFormat: Date, formatString: string): string => {
    try {
      return format(dateToFormat, formatString)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  // Render day view
  const renderDayView = () => {
    const sortedEvents = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

    return (
      <div className="space-y-4 print:text-black">
        <h2 className="text-xl font-bold">{safeFormat(date, "EEEE, MMMM d, yyyy")}</h2>

        {sortedEvents.length > 0 ? (
          <div className="space-y-2">
            {sortedEvents.map((event) => (
              <div key={event.id} className="border-b pb-2">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm">
                  {safeFormat(event.startTime, "h:mm a")} - {safeFormat(event.endTime, "h:mm a")}
                </div>
                {event.location && <div className="text-sm">Location: {event.location}</div>}
                {event.description && <div className="text-sm mt-1">{event.description}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No events scheduled for this day</div>
        )}
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    // Get week start and end
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay() + 1) // Monday

    // Generate days of the week
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="space-y-4 print:text-black">
        <h2 className="text-xl font-bold">Week of {safeFormat(weekStart, "MMMM d, yyyy")}</h2>

        <div className="space-y-6">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDate(day)
            const sortedEvents = [...dayEvents].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

            return (
              <div key={day.toISOString()} className="space-y-2">
                <h3 className={`font-medium ${isSameDay(day, new Date()) ? "text-blue-600" : ""}`}>
                  {safeFormat(day, "EEEE, MMMM d")}
                </h3>

                {sortedEvents.length > 0 ? (
                  <div className="space-y-2 pl-4">
                    {sortedEvents.map((event) => (
                      <div key={event.id} className="border-b pb-2">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm">
                          {safeFormat(event.startTime, "h:mm a")} - {safeFormat(event.endTime, "h:mm a")}
                        </div>
                        {event.location && <div className="text-sm">Location: {event.location}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 pl-4">No events</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render month view
  const renderMonthView = () => {
    // Get month start and end
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)

    // Get all days in the month
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    return (
      <div className="space-y-4 print:text-black">
        <h2 className="text-xl font-bold">{safeFormat(date, "MMMM yyyy")}</h2>

        <div className="grid grid-cols-7 gap-4">
          <div className="font-medium">Mon</div>
          <div className="font-medium">Tue</div>
          <div className="font-medium">Wed</div>
          <div className="font-medium">Thu</div>
          <div className="font-medium">Fri</div>
          <div className="font-medium">Sat</div>
          <div className="font-medium">Sun</div>

          {/* Empty cells for days before the start of the month */}
          {Array.from({ length: (monthStart.getDay() || 7) - 1 }).map((_, i) => (
            <div key={`empty-start-${i}`} className="h-24"></div>
          ))}

          {/* Days of the month */}
          {monthDays.map((day) => {
            const dayEvents = getEventsForDate(day)
            const sortedEvents = [...dayEvents].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

            return (
              <div
                key={day.toISOString()}
                className={`border p-2 h-24 overflow-hidden ${isSameDay(day, new Date()) ? "bg-blue-50" : ""}`}
              >
                <div className="font-medium">{safeFormat(day, "d")}</div>

                <div className="space-y-1 mt-1">
                  {sortedEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="text-xs truncate">
                      {safeFormat(event.startTime, "h:mm a")} {event.title}
                    </div>
                  ))}
                  {sortedEvents.length > 3 && (
                    <div className="text-xs text-gray-500">+{sortedEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Empty cells for days after the end of the month */}
          {Array.from({ length: 7 - (monthEnd.getDay() || 7) }).map((_, i) => (
            <div key={`empty-end-${i}`} className="h-24"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print Calendar</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label htmlFor="print-view" className="text-sm font-medium">
                View
              </label>
              <Select value={printView} onValueChange={(value) => setPrintView(value as any)}>
                <SelectTrigger id="print-view" className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>

          <div className="border-t pt-4">
            {printView === "day" && renderDayView()}
            {printView === "week" && renderWeekView()}
            {printView === "month" && renderMonthView()}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
