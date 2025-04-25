import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CalendarView } from "@/components/calendar/calendar-view"

export const metadata: Metadata = {
  title: "Calendrier | InGeniusPlan",
  description: "Gérez votre emploi du temps avec InGeniusPlan",
}

export default function CalendarPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Calendrier" text="Gérez votre emploi du temps et vos événements" />
      <CalendarView />
    </DashboardShell>
  )
}
