"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { getEventsByUserId } from "@/actions/event-actions"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

export function CalendarView() {
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")
  const [events, setEvents] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    async function fetchEvents() {
      if (session?.user?.id) {
        try {
          const fetchedEvents = await getEventsByUserId(session.user.id)
          setEvents(fetchedEvents)
        } catch (error) {
          console.error("Error fetching events:", error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les événements",
            variant: "destructive",
          })
        }
      }
    }

    fetchEvents()
  }, [session, toast])

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

  const today = () => {
    setCurrentDate(new Date())
  }

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

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

  // Function to determine event color based on workspace
  const getEventColor = (event: any) => {
    // In a real app, you might have a color assigned to each workspace
    // For now, we'll use a simple hash function to generate consistent colors
    const workspaceId = event.workspaceId
    const colors = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-accent"]
    const hash = workspaceId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={today}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={view} onValueChange={setView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Jour</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="year">Année</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel événement
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => (
            <div key={i} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 rounded-md text-center text-sm p-2 bg-muted/20"></div>
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
                  "h-24 rounded-md text-sm p-2 overflow-hidden",
                  isToday ? "bg-primary/10" : "bg-muted/20",
                  "hover:bg-muted/40 cursor-pointer transition-colors",
                )}
              >
                <div className={cn("font-medium mb-1", isToday ? "text-primary" : "")}>{day}</div>
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn("text-xs truncate px-1 py-0.5 rounded", getEventColor(event), "text-white")}
                      title={`${event.title} - ${event.description || ""}`}
                    >
                      {!event.allDay &&
                        `${new Date(event.startTime).getHours()}:${new Date(event.startTime).getMinutes().toString().padStart(2, "0")} `}
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
