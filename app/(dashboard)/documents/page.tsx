import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DocumentsView } from "@/components/documents/documents-view"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Documents | InGeniusPlan",
  description: "Gérez et partagez vos documents",
}

export default function DocumentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Documents" text="Gérez et partagez vos documents">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau document
        </Button>
      </DashboardHeader>
      <DocumentsView />
    </DashboardShell>
  )
}
