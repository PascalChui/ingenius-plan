"use client"

import { CalendarProvider } from "@/contexts/calendar-context"
import { WeekView } from "@/components/calendar/week-view"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { Layout } from "@/components/layout"

export default function WeekCalendarPage() {
  return (
    <Layout>
      <CalendarProvider initialView="week">
        <div className="container mx-auto py-6 space-y-6">
          <CalendarHeader />
          <WeekView />
        </div>
      </CalendarProvider>
    </Layout>
  )
}
