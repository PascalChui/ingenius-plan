"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, ChevronDown, CalendarIcon, Users, AlertCircle } from "lucide-react"
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import type { User } from "@/types/team"
import type { AllocationFilters } from "@/utils/resource-allocation"

interface ResourceAllocationFiltersProps {
  users: User[]
  filters: AllocationFilters
  onFiltersChange: (filters: AllocationFilters) => void
}

export function ResourceAllocationFilters({ users, filters, onFiltersChange }: ResourceAllocationFiltersProps) {
  const [startDate, setStartDate] = useState<Date>(filters.startDate)
  const [endDate, setEndDate] = useState<Date>(filters.endDate)
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>(filters.teamMembers)
  const [showOverallocatedOnly, setShowOverallocatedOnly] = useState<boolean>(filters.showOverallocatedOnly)

  // Apply date range and update filters
  const applyDateRange = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
    onFiltersChange({
      ...filters,
      startDate: start,
      endDate: end,
    })
  }

  // Apply team member selection and update filters
  const applyTeamMemberSelection = (teamMembers: string[]) => {
    setSelectedTeamMembers(teamMembers)
    onFiltersChange({
      ...filters,
      teamMembers,
    })
  }

  // Toggle overallocated only filter
  const toggleOverallocatedOnly = (checked: boolean) => {
    setShowOverallocatedOnly(checked)
    onFiltersChange({
      ...filters,
      showOverallocatedOnly: checked,
    })
  }

  // Predefined date ranges
  const setThisWeek = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    const end = endOfWeek(new Date(), { weekStartsOn: 1 })
    applyDateRange(start, end)
  }

  const setNextWeek = () => {
    const start = startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 })
    const end = endOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 })
    applyDateRange(start, end)
  }

  const setThisMonth = () => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())
    applyDateRange(start, end)
  }

  const setNextMonth = () => {
    const start = startOfMonth(addDays(endOfMonth(new Date()), 1))
    const end = endOfMonth(addDays(endOfMonth(new Date()), 1))
    applyDateRange(start, end)
  }

  const setCustomRange = (days: number) => {
    const start = new Date()
    const end = addDays(new Date(), days)
    applyDateRange(start, end)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Date range selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-1">
            <CalendarIcon className="h-4 w-4" />
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="text-sm font-medium mb-2">Date Range</div>
            <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" onClick={setThisWeek}>
                This Week
              </Button>
              <Button variant="outline" size="sm" onClick={setNextWeek}>
                Next Week
              </Button>
              <Button variant="outline" size="sm" onClick={setThisMonth}>
                This Month
              </Button>
              <Button variant="outline" size="sm" onClick={setNextMonth}>
                Next Month
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCustomRange(14)}>
                Next 14 Days
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCustomRange(30)}>
                Next 30 Days
              </Button>
            </div>
          </div>
          <div className="p-3 flex gap-2">
            <div>
              <div className="text-sm font-medium mb-1">Start Date</div>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && applyDateRange(date, endDate)}
                initialFocus
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">End Date</div>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && applyDateRange(startDate, date)}
                initialFocus
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Team member selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Users className="h-4 w-4" />
            {selectedTeamMembers.length === 0
              ? "All Team Members"
              : selectedTeamMembers.length === 1
                ? "1 Team Member"
                : `${selectedTeamMembers.length} Team Members`}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="p-2">
            <div className="text-sm font-medium mb-2">Team Members</div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              <div
                className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => applyTeamMemberSelection([])}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {selectedTeamMembers.length === 0 && <Check className="h-3 w-3" />}
                </div>
                <span>All Team Members</span>
              </div>

              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    const isSelected = selectedTeamMembers.includes(user.id)
                    if (isSelected) {
                      applyTeamMemberSelection(selectedTeamMembers.filter((id) => id !== user.id))
                    } else {
                      applyTeamMemberSelection([...selectedTeamMembers, user.id])
                    }
                  }}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    {selectedTeamMembers.includes(user.id) && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Overallocated only toggle */}
      <div className="flex items-center gap-2">
        <Switch id="overallocated-only" checked={showOverallocatedOnly} onCheckedChange={toggleOverallocatedOnly} />
        <Label htmlFor="overallocated-only" className="flex items-center gap-1 cursor-pointer">
          <AlertCircle className="h-4 w-4 text-red-500" />
          Show overallocated only
        </Label>
      </div>
    </div>
  )
}
