"use client"

import { CalendarProvider } from "@/contexts/calendar-context"
import { MonthView } from "@/components/calendar/month-view"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { Layout } from "@/components/layout"

export default function MonthCalendarPage() {
  return (
    <Layout>
      <CalendarProvider initialView="month">
        <div className="container mx-auto py-6 space-y-6">
          <CalendarHeader />
          <MonthView />
        </div>
      </CalendarProvider>
    </Layout>
  )
}
