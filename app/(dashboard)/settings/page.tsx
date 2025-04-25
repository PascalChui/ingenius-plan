import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SettingsForm } from "@/components/settings/settings-form"
import { executeQuery } from "@/lib/db"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Paramètres | InGeniusPlan",
  description: "Gérez vos paramètres et préférences",
}

async function getUserSettings(userId: string) {
  try {
    const settings = await executeQuery(`SELECT * FROM "Settings" WHERE "userId" = $1`, [userId])
    return settings[0] || null
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return null
  }
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const settings = await getUserSettings(session.user.id)

  if (!settings) {
    // Create default settings if they don't exist
    await executeQuery(
      `INSERT INTO "Settings" (
        id, theme, language, "notificationsEnabled", 
        "pomodoroDuration", "shortBreakDuration", "longBreakDuration", 
        "pomodorosUntilLongBreak", "userId", "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [`set_${session.user.id.substring(0, 8)}`, "light", "fr", true, 25, 5, 15, 4, session.user.id],
    )

    return redirect("/settings")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Paramètres" text="Gérez vos paramètres et préférences" />
      <div className="grid gap-10">
        <SettingsForm settings={settings} />
      </div>
    </DashboardShell>
  )
}
