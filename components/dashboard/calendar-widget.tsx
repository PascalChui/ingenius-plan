"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getEventsByUserId } from "@/actions/event-actions"
import { useSession } from "next-auth/react"

interface CalendarWidgetProps {
  className?: string
}

export function CalendarWidget({ className }: CalendarWidgetProps) {
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    async function fetchEvents() {
      if (session?.user?.id) {
        try {
          const fetchedEvents = await getEventsByUserId(session.user.id)
          setEvents(fetchedEvents)
        } catch (error) {
          console.error("Error fetching events:", error)
        }
      }
    }

    fetchEvents()
  }, [session])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthName = currentDate.toLocaleString("fr-FR", { month: "long" })
  const year = currentDate.getFullYear()

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      )
    })
  }

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Calendrier</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => (
            <div key={i} className="text-center text-sm font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 rounded-md text-center text-sm p-2"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayEvents = getEventsForDay(day)
            const today = new Date()
            const isToday =
              day === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear()

            return (
              <div
                key={`day-${day}`}
                className={cn(
                  "h-10 rounded-md text-center text-sm p-2 relative",
                  isToday ? "bg-primary/10 font-bold" : "",
                )}
              >
                <span>{day}</span>
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                    {dayEvents.map((event, eventIndex) => {
                      // Determine color based on workspace or event type
                      const colors = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-accent"]
                      const colorIndex = eventIndex % colors.length

                      return (
                        <div
                          key={eventIndex}
                          className={cn("h-1 w-1 rounded-full", colors[colorIndex])}
                          title={event.title}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
