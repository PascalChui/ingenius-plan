import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CollaborationView } from "@/components/collaboration/collaboration-view"

export const metadata: Metadata = {
  title: "Collaboration | InGeniusPlan",
  description: "Collaborez avec votre équipe en temps réel",
}

export default function CollaborationPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Collaboration" text="Travaillez en équipe sur des projets partagés" />
      <CollaborationView />
    </DashboardShell>
  )
}
