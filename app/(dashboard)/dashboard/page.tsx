import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TaskSummary } from "@/components/dashboard/task-summary"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import { ElProfessorWidget } from "@/components/dashboard/el-professor-widget"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export const metadata: Metadata = {
  title: "Tableau de bord | InGeniusPlan",
  description: "Gérez vos tâches et votre emploi du temps avec InGeniusPlan",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Bonjour, ${session?.user?.name || "Utilisateur"}`}
        text="Bienvenue sur votre tableau de bord InGeniusPlan"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TaskSummary />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <CalendarWidget className="col-span-4" />
        <ElProfessorWidget className="col-span-3" />
      </div>
      <div className="mt-4">
        <RecentActivity />
      </div>
    </DashboardShell>
  )
}
