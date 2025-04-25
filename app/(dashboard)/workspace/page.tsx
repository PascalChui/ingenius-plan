import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WorkspaceView } from "@/components/workspace/workspace-view"

export const metadata: Metadata = {
  title: "Espace de travail | InGeniusPlan",
  description: "Brainstorming et outils de concentration",
}

export default function WorkspacePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Espace de travail" text="Brainstorming et outils de concentration" />
      <WorkspaceView />
    </DashboardShell>
  )
}
