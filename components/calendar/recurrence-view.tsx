"use client"

import { useState, useEffect } from "react"
import { format, addMonths, isValid } from "date-fns"
import { useCalendar } from "@/contexts/calendar-context"
import type { CalendarEvent } from "@/types/calendar-event"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "lucide-react"

interface RecurrenceViewProps {
  isOpen: boolean
  onClose: () => void
  event?: CalendarEvent
}

export function RecurrenceView({ isOpen, onClose, event }: RecurrenceViewProps) {
  const { getRecurringEventInstances } = useCalendar()
  const [instances, setInstances] = useState<CalendarEvent[]>([])

  useEffect(() => {
    if (isOpen && event && event.recurrence) {
      // Get instances for the next 6 months
      const startDate = new Date()
      const endDate = addMonths(startDate, 6)

      if (isValid(startDate) && isValid(endDate)) {
        const eventInstances = getRecurringEventInstances(event, startDate, endDate)
        setInstances(eventInstances)
      }
    }
  }, [isOpen, event, getRecurringEventInstances])

  if (!event) return null

  // Safe format function
  const safeFormat = (date: Date, formatString: string): string => {
    try {
      if (!isValid(date)) return "Invalid date"
      return format(date, formatString)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Format error"
    }
  }

  // Get recurrence pattern description
  const getRecurrenceDescription = (): string => {
    if (!event.recurrence) return "Not recurring"

    const { frequency, interval } = event.recurrence

    let description = ""

    switch (frequency) {
      case "daily":
        description = interval === 1 ? "Daily" : `Every ${interval} days`
        break
      case "weekly":
        description = interval === 1 ? "Weekly" : `Every ${interval} weeks`
        if (event.recurrence.weekDays && event.recurrence.weekDays.length > 0) {
          const dayNames = event.recurrence.weekDays.map((day) => {
            const days: Record<string, string> = {
              MO: "Monday",
              TU: "Tuesday",
              WE: "Wednesday",
              TH: "Thursday",
              FR: "Friday",
              SA: "Saturday",
              SU: "Sunday",
            }
            return days[day]
          })
          description += ` on ${dayNames.join(", ")}`
        }
        break
      case "monthly":
        description = interval === 1 ? "Monthly" : `Every ${interval} months`
        break
      case "yearly":
        description = interval === 1 ? "Yearly" : `Every ${interval} years`
        break
    }

    if (event.recurrence.endDate) {
      description += ` until ${safeFormat(event.recurrence.endDate, "MMMM d, yyyy")}`
    } else if (event.recurrence.count) {
      description += `, ${event.recurrence.count} times`
    }

    return description
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recurring Event: {event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Recurrence Pattern</h3>
                <p className="text-sm text-gray-600">{getRecurrenceDescription()}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Upcoming Occurrences</h3>
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4 space-y-2">
                {instances.length > 0 ? (
                  instances.map((instance, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <div className="font-medium">{safeFormat(instance.startTime, "EEEE, MMMM d, yyyy")}</div>
                        <div className="text-sm text-gray-500">
                          {safeFormat(instance.startTime, "h:mm a")} - {safeFormat(instance.endTime, "h:mm a")}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onClose()}>
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No upcoming occurrences</div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
