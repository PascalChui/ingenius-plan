"use client"

import { useState } from "react"
import { useCalendar } from "@/contexts/calendar-context"
import { Button } from "@/components/ui/button"
import { Palette, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CalendarColorSettings } from "./calendar-color-settings"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ColorPicker } from "@/components/ui/color-picker"

export function SharedCalendars() {
  const { calendars, activeCalendars, toggleCalendarVisibility, addCalendar } = useCalendar()
  const [isColorSettingsOpen, setIsColorSettingsOpen] = useState(false)
  const [isNewCalendarOpen, setIsNewCalendarOpen] = useState(false)
  const [newCalendarName, setNewCalendarName] = useState("")
  const [newCalendarColor, setNewCalendarColor] = useState("#3b82f6") // Default blue

  const handleCreateCalendar = () => {
    if (newCalendarName.trim()) {
      addCalendar({
        name: newCalendarName.trim(),
        ownerId: "user-1", // Current user
        color: newCalendarColor,
        isDefault: false,
        isShared: false,
        visibility: "private",
      })
      setNewCalendarName("")
      setNewCalendarColor("#3b82f6")
      setIsNewCalendarOpen(false)
    }
  }

  return (
    <>
      <div className="border rounded-md p-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Calendars</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsColorSettingsOpen(true)} title="Customize colors">
              <Palette className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsNewCalendarOpen(true)} title="Add calendar">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {/* My Calendars */}
          <div className="space-y-2">
            <h4 className="text-sm text-gray-500">My Calendars</h4>
            {calendars
              .filter((cal) => !cal.isShared)
              .map((calendar) => (
                <div key={calendar.id} className="flex items-center space-x-2">
                  <Switch
                    id={`calendar-${calendar.id}`}
                    checked={activeCalendars.includes(calendar.id)}
                    onCheckedChange={() => toggleCalendarVisibility(calendar.id)}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: calendar.color }}
                    aria-hidden="true"
                  ></div>
                  <Label
                    htmlFor={`calendar-${calendar.id}`}
                    className="flex-1 text-sm cursor-pointer truncate"
                    title={calendar.name}
                  >
                    {calendar.name}
                    {calendar.isDefault && <span className="ml-1 text-xs text-gray-400">(Default)</span>}
                  </Label>
                </div>
              ))}
          </div>

          {/* Shared Calendars */}
          {calendars.some((cal) => cal.isShared) && (
            <div className="space-y-2">
              <h4 className="text-sm text-gray-500">Shared With Me</h4>
              {calendars
                .filter((cal) => cal.isShared)
                .map((calendar) => (
                  <div key={calendar.id} className="flex items-center space-x-2">
                    <Switch
                      id={`calendar-${calendar.id}`}
                      checked={activeCalendars.includes(calendar.id)}
                      onCheckedChange={() => toggleCalendarVisibility(calendar.id)}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: calendar.color }}
                      aria-hidden="true"
                    ></div>
                    <Label
                      htmlFor={`calendar-${calendar.id}`}
                      className="flex-1 text-sm cursor-pointer truncate"
                      title={`${calendar.name} (${calendar.ownerName || "Shared"})`}
                    >
                      {calendar.name}
                      <span className="ml-1 text-xs text-gray-400">({calendar.ownerName || "Shared"})</span>
                    </Label>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Color Settings Modal */}
      <CalendarColorSettings isOpen={isColorSettingsOpen} onClose={() => setIsColorSettingsOpen(false)} />

      {/* New Calendar Modal */}
      <Dialog open={isNewCalendarOpen} onOpenChange={setIsNewCalendarOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Calendar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="calendar-name">Calendar Name</Label>
              <Input
                id="calendar-name"
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                placeholder="Work, Personal, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label>Calendar Color</Label>
              <ColorPicker value={newCalendarColor} onChange={setNewCalendarColor} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCalendarOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCalendar} disabled={!newCalendarName.trim()}>
              Create Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
