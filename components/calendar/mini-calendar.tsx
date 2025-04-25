"use client"

import { useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns"
import { useCalendar } from "@/contexts/calendar-context"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function MiniCalendar() {
  const { viewState, setViewState } = useCalendar()
  const [calendarDate, setCalendarDate] = useState(new Date())

  // Get the current month's days
  const monthStart = startOfMonth(calendarDate)
  const monthEnd = endOfMonth(calendarDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = monthStart.getDay()

  // Calculate days from previous month to fill the first row
  const prevMonthDays = Array.from({ length: (startDay || 7) - 1 }, (_, i) => {
    const day = new Date(monthStart)
    day.setDate(day.getDate() - ((startDay || 7) - 1) + i)
    return day
  })

  // Calculate days from next month to fill the last row
  const endDay = monthEnd.getDay()
  const nextMonthDays = Array.from({ length: 7 - (endDay || 7) }, (_, i) => {
    const day = new Date(monthEnd)
    day.setDate(day.getDate() + i + 1)
    return day
  })

  // Combine all days
  const calendarDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]

  // Navigate to previous month
  const prevMonth = () => {
    setCalendarDate(subMonths(calendarDate, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCalendarDate(addMonths(calendarDate, 1))
  }

  // Handle day click
  const handleDayClick = (day: Date) => {
    setViewState((prev) => ({ ...prev, date: day }))
  }

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-medium">{format(calendarDate, "MMMM yyyy")}</h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        <div className="text-xs text-gray-500">M</div>
        <div className="text-xs text-gray-500">T</div>
        <div className="text-xs text-gray-500">W</div>
        <div className="text-xs text-gray-500">T</div>
        <div className="text-xs text-gray-500">F</div>
        <div className="text-xs text-gray-500">S</div>
        <div className="text-xs text-gray-500">S</div>

        {calendarDays.map((day, i) => (
          <Button
            key={i}
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 w-7 p-0 text-xs rounded-full",
              !isSameMonth(day, calendarDate) && "text-gray-400",
              isSameDay(day, viewState.date) && "bg-blue-500 text-white hover:bg-blue-600",
              isSameDay(day, new Date()) && !isSameDay(day, viewState.date) && "border border-blue-500",
            )}
            onClick={() => handleDayClick(day)}
          >
            {format(day, "d")}
          </Button>
        ))}
      </div>
    </div>
  )
}
