import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TaskList } from "@/components/tasks/task-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Tâches | InGeniusPlan",
  description: "Gérez vos tâches avec InGeniusPlan",
}

export default function TasksPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Tâches" text="Gérez vos tâches et suivez votre progression">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle tâche
        </Button>
      </DashboardHeader>
      <TaskList />
    </DashboardShell>
  )
}
