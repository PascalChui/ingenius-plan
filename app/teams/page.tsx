"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, Settings } from "lucide-react"
import { TeamProvider } from "@/contexts/team-context"
import { TeamSelector } from "@/components/team/team-selector"
import { TeamDashboard } from "@/components/team/team-dashboard"
import { TeamMembers } from "@/components/team/team-members"
import { TeamTasks } from "@/components/team/team-tasks"
import { TeamSettings } from "@/components/team/team-settings"
import { CreateTeamModal } from "@/components/team/create-team-modal"

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false)

  return (
    <TeamProvider>
      <Layout>
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Teams</h1>
              <TeamSelector />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1" onClick={() => setIsCreateTeamModalOpen(true)}>
                <Plus className="h-4 w-4" />
                New Team
              </Button>
            </div>
          </div>

          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="members">
                <Users className="h-4 w-4 mr-1" />
                Members
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "dashboard" && <TeamDashboard />}
          {activeTab === "tasks" && <TeamTasks />}
          {activeTab === "members" && <TeamMembers />}
          {activeTab === "settings" && <TeamSettings />}
        </div>

        <CreateTeamModal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)} />
      </Layout>
    </TeamProvider>
  )
}
