"use client"

import { CalendarProvider } from "@/contexts/calendar-context"
import { DayView } from "@/components/calendar/day-view"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { Layout } from "@/components/layout"

export default function DayCalendarPage() {
  return (
    <Layout>
      <CalendarProvider initialView="day">
        <div className="container mx-auto py-6 space-y-6">
          <CalendarHeader />
          <DayView />
        </div>
      </CalendarProvider>
    </Layout>
  )
}
