"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { CalendarEvent } from "@/types/calendar-event"
import { useCalendar } from "@/contexts/calendar-context"
import { format } from "date-fns"
import { EventModal } from "./event-modal"
import { Trash, Edit, MapPin, Clock, CalendarIcon, Users, Repeat } from "lucide-react"

interface EventDetailsProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
}

const categoryColors: Record<string, string> = {
  work: "bg-blue-100 text-blue-800 border-blue-500",
  personal: "bg-purple-100 text-purple-800 border-purple-500",
  meeting: "bg-red-100 text-red-800 border-red-500",
  appointment: "bg-green-100 text-green-800 border-green-500",
  holiday: "bg-yellow-100 text-yellow-800 border-yellow-500",
  reminder: "bg-pink-100 text-pink-800 border-pink-500",
  booking: "bg-indigo-100 text-indigo-800 border-indigo-500",
  other: "bg-gray-100 text-gray-800 border-gray-500",
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

export function EventDetails({ event, isOpen, onClose }: EventDetailsProps) {
  const { deleteEvent, calendars } = useCalendar()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  // If there's no event, don't render anything
  if (!event) {
    return null
  }

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id)
      setIsDeleteConfirmOpen(false)
      onClose()
    }
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  // Get calendar color for the event
  const getCalendarColor = () => {
    const calendar = calendars.find((cal) => cal.id === event.calendarId)
    return calendar?.color || "#3b82f6" // Default blue
  }

  const calendarColor = getCalendarColor()

  return (
    <>
      <Dialog open={isOpen && !!event} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: calendarColor }}></div>
                <span>{event.title}</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className={`p-4 rounded-md mb-4 ${categoryColors[event.category]}`}>
              {event.description && <p className="mb-4">{event.description}</p>}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(event.startTime, "EEEE, MMMM d, yyyy")}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(event.startTime, "h:mm a")} - {format(event.endTime, "h:mm a")}
                    {event.allDay && " (All day)"}
                  </span>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.teamId && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Team Event</span>
                  </div>
                )}

                {(event.recurrence || event.recurrenceId) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Repeat className="h-4 w-4" />
                    <span>Recurring Event</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Created {format(event.createdAt, "MMM d, yyyy 'at' h:mm a")}
              {event.updatedAt && ` • Updated ${format(event.updatedAt, "MMM d, yyyy 'at' h:mm a")}`}
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              <Button variant="outline" className="text-red-500" onClick={() => setIsDeleteConfirmOpen(true)}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{event.title}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {event && <EventModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} event={event} />}
    </>
  )
}
