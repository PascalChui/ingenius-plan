"use client"

import { useState } from "react"
import { useCalendar } from "@/contexts/calendar-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { Download } from "lucide-react"
import { exportCalendarView, exportCalendarRange, downloadIcalFile } from "@/utils/ical-generator"

interface ExportCalendarProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportCalendar({ isOpen, onClose }: ExportCalendarProps) {
  const { events, viewState } = useCalendar()
  const [exportType, setExportType] = useState<"current" | "custom" | "all">("current")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [filename, setFilename] = useState("calendar.ics")

  const handleExport = () => {
    switch (exportType) {
      case "current":
        exportCalendarView(events, viewState.view, viewState.date, filename)
        break
      case "custom":
        if (startDate && endDate) {
          exportCalendarRange(events, startDate, endDate, filename)
        }
        break
      case "all":
        downloadIcalFile(events, filename)
        break
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Calendar</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup
            value={exportType}
            onValueChange={(value) => setExportType(value as "current" | "custom" | "all")}
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="current" id="current" />
              <div className="grid gap-1.5">
                <Label htmlFor="current">Current View</Label>
                <p className="text-sm text-muted-foreground">
                  Export events from the {viewState.view} view ({format(viewState.date, "MMMM yyyy")})
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2 mt-4">
              <RadioGroupItem value="custom" id="custom" />
              <div className="grid gap-1.5 w-full">
                <Label htmlFor="custom">Custom Date Range</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <DatePicker
                      id="start-date"
                      date={startDate}
                      setDate={setStartDate}
                      disabled={exportType !== "custom"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <DatePicker id="end-date" date={endDate} setDate={setEndDate} disabled={exportType !== "custom"} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2 mt-4">
              <RadioGroupItem value="all" id="all" />
              <div className="grid gap-1.5">
                <Label htmlFor="all">All Events</Label>
                <p className="text-sm text-muted-foreground">Export all events from your calendar</p>
              </div>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <div className="flex items-center space-x-2">
              <input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-sm text-muted-foreground">.ics</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
