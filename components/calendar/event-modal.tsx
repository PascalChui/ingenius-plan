"use client"

import { useState, useEffect } from "react"
import { format, addHours, isValid } from "date-fns"
import { useCalendar } from "@/contexts/calendar-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, MapPin, Repeat } from "lucide-react"
import { RecurrenceView } from "./recurrence-view"
import type { CalendarEvent, EventCategory, RecurrencePattern } from "@/types/calendar-event"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date | null
  event?: CalendarEvent | null
}

export function EventModal({ isOpen, onClose, selectedDate, event }: EventModalProps) {
  const { addEvent, updateEvent, calendars, activeCalendars } = useCalendar()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState<EventCategory>("meeting")
  const [allDay, setAllDay] = useState(false)
  const [calendarId, setCalendarId] = useState("")
  const [recurrence, setRecurrence] = useState<RecurrencePattern | undefined>(undefined)
  const [showRecurrenceView, setShowRecurrenceView] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Edit mode
        setTitle(event.title)
        setDescription(event.description || "")
        setStartDate(event.startTime)
        setEndDate(event.endTime)
        setStartTime(format(event.startTime, "HH:mm"))
        setEndTime(format(event.endTime, "HH:mm"))
        setLocation(event.location || "")
        setCategory(event.category)
        setAllDay(event.allDay || false)
        setCalendarId(event.calendarId)
        setRecurrence(event.recurrence)
      } else {
        // Create mode
        setTitle("")
        setDescription("")

        // If a date is selected, use it
        if (selectedDate && isValid(selectedDate)) {
          setStartDate(selectedDate)
          setEndDate(addHours(selectedDate, 1))
          setStartTime(format(selectedDate, "HH:mm"))
          setEndTime(format(addHours(selectedDate, 1), "HH:mm"))
        } else {
          // Otherwise use current time rounded to nearest hour
          const now = new Date()
          now.setMinutes(0, 0, 0)
          setStartDate(now)
          setEndDate(addHours(now, 1))
          setStartTime(format(now, "HH:mm"))
          setEndTime(format(addHours(now, 1), "HH:mm"))
        }

        setLocation("")
        setCategory("meeting")
        setAllDay(false)
        setCalendarId(activeCalendars[0] || calendars[0]?.id || "")
        setRecurrence(undefined)
      }
      setShowRecurrenceView(false)
    }
  }, [isOpen, event, selectedDate, activeCalendars, calendars])

  const handleSubmit = () => {
    if (!title.trim() || !startDate || !endDate) return

    // Combine date and time
    const startDateTime = new Date(startDate)
    const endDateTime = new Date(endDate)

    if (!allDay) {
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      const [endHours, endMinutes] = endTime.split(":").map(Number)

      startDateTime.setHours(startHours, startMinutes, 0, 0)
      endDateTime.setHours(endHours, endMinutes, 0, 0)
    } else {
      // For all-day events, set times to start and end of day
      startDateTime.setHours(0, 0, 0, 0)
      endDateTime.setHours(23, 59, 59, 999)
    }

    const eventData = {
      title,
      description: description || undefined,
      startTime: startDateTime,
      endTime: endDateTime,
      location: location || undefined,
      category,
      allDay: allDay || undefined,
      calendarId,
      recurrence,
    }

    if (event) {
      // Update existing event
      updateEvent(event.id, eventData)
    } else {
      // Create new event
      addEvent(eventData)
    }

    onClose()
  }

  const handleRecurrenceChange = (newRecurrence: RecurrencePattern | undefined) => {
    setRecurrence(newRecurrence)
    setShowRecurrenceView(false)
  }

  // Get calendar color for the selected calendar
  const getCalendarColor = (id: string) => {
    const calendar = calendars.find((cal) => cal.id === id)
    return calendar?.color || "#3b82f6" // Default blue
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="calendar">Calendar</Label>
            <Select value={calendarId} onValueChange={setCalendarId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a calendar" />
              </SelectTrigger>
              <SelectContent>
                {calendars.map((calendar) => (
                  <SelectItem key={calendar.id} value={calendar.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: calendar.color }}></div>
                      <span>{calendar.name}</span>
                      {calendar.isShared && (
                        <span className="text-xs text-gray-500">({calendar.ownerName || "Shared"})</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="all-day" checked={allDay} onCheckedChange={setAllDay} />
            <Label htmlFor="all-day">All day</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {!allDay && (
              <div className="grid gap-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {!allDay && (
              <div className="grid gap-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as EventCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Description</Label>
              <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => setShowRecurrenceView(true)}>
                <Repeat className="h-4 w-4" />
                {recurrence ? "Edit Recurrence" : "Add Recurrence"}
              </Button>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            style={{
              backgroundColor: getCalendarColor(calendarId),
              borderColor: getCalendarColor(calendarId),
            }}
          >
            {event ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Recurrence View */}
      {showRecurrenceView && (
        <RecurrenceView
          isOpen={showRecurrenceView}
          onClose={() => setShowRecurrenceView(false)}
          currentRecurrence={recurrence}
          onChange={handleRecurrenceChange}
          startDate={startDate}
        />
      )}
    </Dialog>
  )
}
