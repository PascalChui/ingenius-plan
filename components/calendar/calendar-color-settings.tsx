"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { useCalendar } from "@/contexts/calendar-context"
import { Palette } from "lucide-react"
import type { Calendar } from "@/types/calendar-event"

interface CalendarColorSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function CalendarColorSettings({ isOpen, onClose }: CalendarColorSettingsProps) {
  const { calendars, updateCalendar } = useCalendar()
  const [editedCalendars, setEditedCalendars] = useState<Calendar[]>(calendars)

  // Reset edited calendars when modal opens
  useState(() => {
    setEditedCalendars(calendars)
  })

  const handleColorChange = (calendarId: string, color: string) => {
    setEditedCalendars((prev) => prev.map((cal) => (cal.id === calendarId ? { ...cal, color } : cal)))
  }

  const handleNameChange = (calendarId: string, name: string) => {
    setEditedCalendars((prev) => prev.map((cal) => (cal.id === calendarId ? { ...cal, name } : cal)))
  }

  const handleSave = () => {
    // Update each calendar that has changed
    editedCalendars.forEach((editedCal) => {
      const originalCal = calendars.find((cal) => cal.id === editedCal.id)
      if (originalCal && (originalCal.color !== editedCal.color || originalCal.name !== editedCal.name)) {
        updateCalendar(editedCal.id, {
          color: editedCal.color,
          name: editedCal.name,
        })
      }
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Calendar Colors
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
          {editedCalendars
            .filter((cal) => !cal.isShared || cal.ownerId === "user-1") // Only show calendars the user owns
            .map((calendar) => (
              <div key={calendar.id} className="space-y-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: calendar.color }}></div>
                  <h3 className="font-medium">{calendar.name}</h3>
                  {calendar.isDefault && <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Default</span>}
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`name-${calendar.id}`}>Calendar Name</Label>
                    <Input
                      id={`name-${calendar.id}`}
                      value={calendar.name}
                      onChange={(e) => handleNameChange(calendar.id, e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Calendar Color</Label>
                    <ColorPicker value={calendar.color} onChange={(color) => handleColorChange(calendar.id, color)} />
                  </div>
                </div>
              </div>
            ))}

          {editedCalendars.filter((cal) => cal.isShared && cal.ownerId !== "user-1").length > 0 && (
            <div className="pt-2">
              <h3 className="font-medium mb-4">Shared Calendars</h3>
              <div className="space-y-4">
                {editedCalendars
                  .filter((cal) => cal.isShared && cal.ownerId !== "user-1")
                  .map((calendar) => (
                    <div key={calendar.id} className="flex items-center justify-between pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: calendar.color }}></div>
                        <span>
                          {calendar.name}{" "}
                          <span className="text-sm text-gray-500">({calendar.ownerName || "Shared"})</span>
                        </span>
                      </div>
                      <div>
                        <ColorPicker
                          value={calendar.color}
                          onChange={(color) => handleColorChange(calendar.id, color)}
                          className="justify-end"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
