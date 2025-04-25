"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTeam } from "@/contexts/team-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { BarChart, CheckCircle, Clock, Users } from "lucide-react"
import { TeamActivityFeed } from "@/components/team/team-activity-feed"

export function TeamDashboard() {
  const { currentTeam, teamMembers, teamTasks, teamActivities } = useTeam()

  if (!currentTeam) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 mb-2">No team selected</h3>
        <p className="text-gray-400 mb-4">Please select a team to view the dashboard</p>
      </div>
    )
  }

  // Calculate team metrics
  const totalTasks = teamTasks.length
  const completedTasks = teamTasks.filter((task) => task.completed).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const overdueTasks = teamTasks.filter((task) => !task.completed && new Date(task.dueDate) < new Date()).length

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentTeam.avatar || "/placeholder.svg"} alt={currentTeam.name} />
              <AvatarFallback className="text-lg">{currentTeam.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{currentTeam.name}</h2>
              <p className="text-gray-500 mt-1">{currentTeam.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {teamMembers.length} members
                </div>
                <div>Created {formatDistanceToNow(new Date(currentTeam.createdAt), { addSuffix: true })}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <h3 className="text-2xl font-bold">{totalTasks}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <h3 className="text-2xl font-bold">{completionRate}%</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue Tasks</p>
                <h3 className="text-2xl font-bold">{overdueTasks}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Team Members</p>
                <h3 className="text-2xl font-bold">{teamMembers.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamActivityFeed activities={teamActivities} />
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-sm text-gray-500 truncate">{member.title || member.email}</p>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-gray-100">
                    {member.teamRole.charAt(0).toUpperCase() + member.teamRole.slice(1)}
                  </div>
                </div>
              ))}
              {teamMembers.length > 5 && (
                <div className="text-sm text-center text-gray-500">+{teamMembers.length - 5} more members</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
