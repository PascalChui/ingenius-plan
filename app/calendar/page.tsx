"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarProvider } from "@/contexts/calendar-context"
import { DayView } from "@/components/calendar/day-view"
import { WeekView } from "@/components/calendar/week-view"
import { MonthView } from "@/components/calendar/month-view"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { MiniCalendar } from "@/components/calendar/mini-calendar"
import { SharedCalendars } from "@/components/calendar/shared-calendars"
import { PrintView } from "@/components/calendar/print-view"
import { SearchEvents } from "@/components/calendar/search-events"
import { ExportCalendar } from "@/components/calendar/export-calendar"
import { A11yAnnouncer } from "@/components/calendar/a11y-announcer"
import { Button } from "@/components/ui/button"
import { Printer, Search, Keyboard, Download, Share2, Palette } from "lucide-react"
import { useCalendar } from "@/contexts/calendar-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Layout } from "@/components/layout"
import { ShareCalendarModal } from "@/components/calendar/share-calendar-modal"
import { CalendarColorSettings } from "@/components/calendar/calendar-color-settings"

function CalendarContent() {
  const { viewState, prevPeriod, nextPeriod, today, setView } = useCalendar()
  const { view } = viewState
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isColorSettingsOpen, setIsColorSettingsOpen] = useState(false)
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false)

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Only handle shortcuts if no input is focused
      if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
        return
      }

      const { key, ctrlKey, metaKey } = e

      // Navigation shortcuts
      if (key === "ArrowLeft" && (ctrlKey || metaKey)) {
        e.preventDefault()
        prevPeriod()
      } else if (key === "ArrowRight" && (ctrlKey || metaKey)) {
        e.preventDefault()
        nextPeriod()
      } else if (key === "t" && (ctrlKey || metaKey)) {
        e.preventDefault()
        today()
      }

      // View shortcuts
      if (key === "d" && (ctrlKey || metaKey)) {
        e.preventDefault()
        setView("day")
      } else if (key === "w" && (ctrlKey || metaKey)) {
        e.preventDefault()
        setView("week")
      } else if (key === "m" && (ctrlKey || metaKey)) {
        e.preventDefault()
        setView("month")
      }

      // Other shortcuts
      if (key === "p" && (ctrlKey || metaKey)) {
        e.preventDefault()
        setIsPrintViewOpen(true)
      } else if (key === "f" && (ctrlKey || metaKey)) {
        e.preventDefault()
        setIsSearchOpen(true)
      } else if (key === "e" && (ctrlKey || metaKey)) {
        e.preventDefault()
        setIsExportOpen(true)
      } else if (key === "s" && (ctrlKey || metaKey)) {
        e.preventDefault()
        setIsShareOpen(true)
      } else if (key === "c" && (ctrlKey || metaKey)) {
        e.preventDefault()
        setIsColorSettingsOpen(true)
      } else if (key === "?" && !ctrlKey && !metaKey) {
        e.preventDefault()
        setIsKeyboardShortcutsOpen(true)
      }
    },
    [prevPeriod, nextPeriod, today, setView],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="container mx-auto py-6">
      {/* Accessibility announcer */}
      <A11yAnnouncer />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 space-y-6">
          <MiniCalendar />

          <SharedCalendars />

          <div className="border rounded-md p-4 bg-white space-y-2">
            <h3 className="font-medium mb-2">Tools</h3>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsPrintViewOpen(true)}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsExportOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export (iCal)
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsShareOpen(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Calendar
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsColorSettingsOpen(true)}>
              <Palette className="mr-2 h-4 w-4" />
              Customize Colors
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsSearchOpen(true)}>
              <Search className="mr-2 h-4 w-4" />
              Search Events
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsKeyboardShortcutsOpen(true)}>
              <Keyboard className="mr-2 h-4 w-4" />
              Keyboard Shortcuts
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <CalendarHeader />

          <div className="bg-white border rounded-md p-4">
            {view === "day" && <DayView />}
            {view === "week" && <WeekView />}
            {view === "month" && <MonthView />}
          </div>
        </div>
      </div>

      {/* Print View Dialog */}
      <PrintView isOpen={isPrintViewOpen} onClose={() => setIsPrintViewOpen(false)} />

      {/* Export Dialog */}
      <ExportCalendar isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      {/* Share Dialog */}
      <ShareCalendarModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

      {/* Color Settings Dialog */}
      <CalendarColorSettings isOpen={isColorSettingsOpen} onClose={() => setIsColorSettingsOpen(false)} />

      {/* Search Dialog */}
      <SearchEvents isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={isKeyboardShortcutsOpen} onOpenChange={setIsKeyboardShortcutsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Navigation</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">Previous period</div>
                <div className="text-sm font-mono">Ctrl/⌘ + ←</div>
                <div className="text-sm">Next period</div>
                <div className="text-sm font-mono">Ctrl/⌘ + →</div>
                <div className="text-sm">Today</div>
                <div className="text-sm font-mono">Ctrl/⌘ + T</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Views</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">Day view</div>
                <div className="text-sm font-mono">Ctrl/⌘ + D</div>
                <div className="text-sm">Week view</div>
                <div className="text-sm font-mono">Ctrl/⌘ + W</div>
                <div className="text-sm">Month view</div>
                <div className="text-sm font-mono">Ctrl/⌘ + M</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">Print</div>
                <div className="text-sm font-mono">Ctrl/⌘ + P</div>
                <div className="text-sm">Export</div>
                <div className="text-sm font-mono">Ctrl/⌘ + E</div>
                <div className="text-sm">Share</div>
                <div className="text-sm font-mono">Ctrl/⌘ + S</div>
                <div className="text-sm">Colors</div>
                <div className="text-sm font-mono">Ctrl/⌘ + C</div>
                <div className="text-sm">Search</div>
                <div className="text-sm font-mono">Ctrl/⌘ + F</div>
                <div className="text-sm">Show shortcuts</div>
                <div className="text-sm font-mono">?</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CalendarPage() {
  return (
    <Layout>
      <CalendarProvider>
        <CalendarContent />
      </CalendarProvider>
    </Layout>
  )
}
