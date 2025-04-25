"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { format, isValid } from "date-fns"
import { useCalendar } from "@/contexts/calendar-context"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Search, Download } from "lucide-react"
import { CategoryFilter } from "./category-filter"
import { EventModal } from "./event-modal"
import { ExportCalendar } from "./export-calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CalendarHeader() {
  const { viewState, setView, nextPeriod, prevPeriod, today, setViewState } = useCalendar()
  const { date, view } = viewState
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Ensure we have a valid date
  const safeDate = isValid(date) ? date : new Date()

  // Format the header date based on the current view
  const getFormattedDate = () => {
    try {
      switch (view) {
        case "day":
          return format(safeDate, "EEEE, MMMM d, yyyy")
        case "week":
          return format(safeDate, "MMMM yyyy")
        case "month":
          return format(safeDate, "MMMM yyyy")
        default:
          return format(safeDate, "MMMM d, yyyy")
      }
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const handleViewChange = (newView: string) => {
    setView(newView as "day" | "week" | "month")
  }

  const handleDateSelect = useCallback(
    (newDate: Date | undefined) => {
      if (newDate && isValid(newDate)) {
        setViewState((prev) => ({ ...prev, date: newDate }))
        setIsDatePickerOpen(false)
      }
    },
    [setViewState],
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // We'll implement search functionality later
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevPeriod} aria-label="Previous period">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextPeriod} aria-label="Next period">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={today} className="ml-2">
            Today
          </Button>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-2 font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {getFormattedDate()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={safeDate} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 w-full sm:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Button variant="outline" onClick={() => setIsExportOpen(true)}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={view} onValueChange={handleViewChange} className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>

        <CategoryFilter />
      </div>

      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ExportCalendar isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  )
}
