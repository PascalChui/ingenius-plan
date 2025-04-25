"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useCalendar } from "@/contexts/calendar-context"
import type { CalendarEvent } from "@/types/calendar-event"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, CalendarIcon } from "lucide-react"

interface SearchEventsProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchEvents({ isOpen, onClose }: SearchEventsProps) {
  const { events, setViewState } = useCalendar()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CalendarEvent[]>([])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = events.filter((event) => {
      return (
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query))
      )
    })

    // Sort results by date
    results.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

    setSearchResults(results)
  }, [searchQuery, events])

  const handleEventClick = (event: CalendarEvent) => {
    // Navigate to the event date
    setViewState((prev) => ({ ...prev, date: event.startTime }))
    onClose()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The search is already handled by the useEffect
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Events</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {searchResults.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {searchResults.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="mr-3 mt-1">
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">{format(event.startTime, "EEEE, MMMM d, yyyy")}</div>
                      <div className="text-sm">
                        {format(event.startTime, "h:mm a")} - {format(event.endTime, "h:mm a")}
                      </div>
                      {event.location && <div className="text-sm mt-1">Location: {event.location}</div>}
                      {event.description && (
                        <div className="text-sm mt-1 text-gray-600 line-clamp-2">{event.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : searchQuery.trim() !== "" ? (
            <div className="text-center py-8 text-gray-500">No events found</div>
          ) : null}
        </form>
      </DialogContent>
    </Dialog>
  )
}
