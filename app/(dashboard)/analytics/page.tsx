import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AnalyticsView } from "@/components/analytics/analytics-view"
import { executeQuery } from "@/lib/db"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Analytique | InGeniusPlan",
  description: "Visualisez et analysez vos données de productivité",
}

async function getUserAnalytics(userId: string) {
  try {
    // Get task completion data
    const taskCompletionByDay = await executeQuery(
      `
      SELECT 
        DATE_TRUNC('day', "updatedAt") as day,
        COUNT(*) as count
      FROM "Task"
      WHERE "userId" = $1 AND status = 'DONE'
      GROUP BY DATE_TRUNC('day', "updatedAt")
      ORDER BY day ASC
      LIMIT 30
    `,
      [userId],
    )

    // Get task creation data
    const taskCreationByDay = await executeQuery(
      `
      SELECT 
        DATE_TRUNC('day', "createdAt") as day,
        COUNT(*) as count
      FROM "Task"
      WHERE "userId" = $1
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY day ASC
      LIMIT 30
    `,
      [userId],
    )

    // Get task distribution by status
    const tasksByStatus = await executeQuery(
      `
      SELECT 
        status,
        COUNT(*) as count
      FROM "Task"
      WHERE "userId" = $1
      GROUP BY status
    `,
      [userId],
    )

    // Get task distribution by priority
    const tasksByPriority = await executeQuery(
      `
      SELECT 
        priority,
        COUNT(*) as count
      FROM "Task"
      WHERE "userId" = $1
      GROUP BY priority
    `,
      [userId],
    )

    // Get pomodoro sessions data (if available)
    let pomodoroData = []
    try {
      pomodoroData = await executeQuery(
        `
        SELECT 
          DATE_TRUNC('day', "startTime") as day,
          SUM(EXTRACT(EPOCH FROM ("endTime" - "startTime")) / 60) as duration
        FROM "PomodoroSession"
        WHERE "taskId" IN (SELECT id FROM "Task" WHERE "userId" = $1)
        AND completed = true
        GROUP BY DATE_TRUNC('day', "startTime")
        ORDER BY day ASC
        LIMIT 30
      `,
        [userId],
      )
    } catch (error) {
      console.error("Error fetching pomodoro data:", error)
    }

    return {
      taskCompletionByDay,
      taskCreationByDay,
      tasksByStatus,
      tasksByPriority,
      pomodoroData,
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return null
  }
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const analyticsData = await getUserAnalytics(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader heading="Analytique" text="Visualisez et analysez vos données de productivité" />
      <AnalyticsView analyticsData={analyticsData} />
    </DashboardShell>
  )
}
