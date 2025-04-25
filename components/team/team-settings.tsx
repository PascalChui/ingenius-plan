"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useTeam } from "@/contexts/team-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Save, Trash, Upload } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TeamSettings() {
  const { currentTeam, isTeamAdmin, isTeamOwner } = useTeam()
  const [activeTab, setActiveTab] = useState("general")
  const [teamName, setTeamName] = useState(currentTeam?.name || "")
  const [teamDescription, setTeamDescription] = useState(currentTeam?.description || "")
  const [isSaved, setIsSaved] = useState(false)

  if (!currentTeam) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 mb-2">No team selected</h3>
        <p className="text-gray-400 mb-4">Please select a team to view settings</p>
      </div>
    )
  }

  if (!isTeamAdmin) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 mb-2">Access Restricted</h3>
        <p className="text-gray-400 mb-4">Only team admins can access team settings</p>
      </div>
    )
  }

  const handleSave = () => {
    // In a real app, you would save the changes to the backend
    console.log("Saving team settings:", { teamName, teamDescription })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          {isTeamOwner && <TabsTrigger value="danger">Danger Zone</TabsTrigger>}
        </TabsList>
      </Tabs>

      {activeTab === "general" && (
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
            <CardDescription>Update your team's basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentTeam.avatar || "/placeholder.svg"} alt={currentTeam.name} />
                <AvatarFallback className="text-xl">{currentTeam.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Upload className="h-4 w-4" />
                  Change Avatar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Enter team description"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className={isSaved ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-gray-800"}
              >
                {isSaved ? (
                  "Saved!"
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "permissions" && (
        <Card>
          <CardHeader>
            <CardTitle>Team Permissions</CardTitle>
            <CardDescription>Manage who can do what in your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Configure permissions for different roles in your team. These settings control what actions team members
                can perform.
              </p>

              {/* Permission settings would go here */}
              <div className="text-center py-8 text-gray-500">Permission settings coming soon</div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "integrations" && (
        <Card>
          <CardHeader>
            <CardTitle>Team Integrations</CardTitle>
            <CardDescription>Connect your team with other services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Connect your team with other services to enhance productivity and streamline workflows.
              </p>

              {/* Integrations would go here */}
              <div className="text-center py-8 text-gray-500">Integration options coming soon</div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "danger" && isTeamOwner && (
        <Card className="border-red-200">
          <CardHeader className="text-red-500">
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 border border-red-200 rounded-md">
                <h3 className="font-medium mb-2">Delete Team</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Once you delete a team, there is no going back. This action cannot be undone.
                </p>
                <Button variant="destructive" className="gap-1">
                  <Trash className="h-4 w-4" />
                  Delete Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
