"use client"

import { useCalendar } from "@/contexts/calendar-context"
import type { EventCategory } from "@/types/calendar-event"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"

const categoryColors: Record<string, string> = {
  work: "bg-blue-500",
  personal: "bg-purple-500",
  meeting: "bg-red-500",
  appointment: "bg-green-500",
  holiday: "bg-yellow-500",
  reminder: "bg-pink-500",
  booking: "bg-indigo-500",
  other: "bg-gray-500",
}

const categoryLabels: Record<string, string> = {
  work: "Work",
  personal: "Personal",
  meeting: "Meeting",
  appointment: "Appointment",
  holiday: "Holiday",
  reminder: "Reminder",
  booking: "Booking",
  other: "Other",
}

export function CategoryFilter() {
  const { viewState, toggleCategoryFilter } = useCalendar()
  const { selectedCategories } = viewState

  const allCategories: EventCategory[] = [
    "work",
    "personal",
    "meeting",
    "appointment",
    "holiday",
    "reminder",
    "booking",
    "other",
  ]

  const handleToggleAll = (checked: boolean) => {
    allCategories.forEach((category) => {
      const isCurrentlySelected = selectedCategories.includes(category)
      if (checked && !isCurrentlySelected) {
        toggleCategoryFilter(category)
      } else if (!checked && isCurrentlySelected) {
        toggleCategoryFilter(category)
      }
    })
  }

  const allSelected = allCategories.every((category) => selectedCategories.includes(category))
  const someSelected = allCategories.some((category) => selectedCategories.includes(category)) && !allSelected

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {selectedCategories.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-categories"
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={handleToggleAll}
            />
            <Label htmlFor="all-categories" className="font-medium">
              All Categories
            </Label>
          </div>
          <div className="space-y-2">
            {allCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategoryFilter(category)}
                />
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${categoryColors[category]}`} />
                  <Label htmlFor={`category-${category}`}>{categoryLabels[category]}</Label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
