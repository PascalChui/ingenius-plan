import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserById } from "@/data/teams"
import { getTasks } from "@/data/tasks"
import { format, parseISO, subDays } from "date-fns"
import { CheckCircle2, Clock, Edit, Plus, Calendar } from "lucide-react"

interface ProfileActivityProps {
  userId: string
}

export function ProfileActivity({ userId }: ProfileActivityProps) {
  const user = getUserById(userId)
  const allTasks = getTasks()

  // Filter tasks related to this user
  const userTasks = allTasks.filter((task) => task.assigneeId === userId || task.createdBy === userId)

  // Sort by most recent
  const sortedTasks = [...userTasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  // Take only the 10 most recent
  const recentTasks = sortedTasks.slice(0, 10)

  // Generate some fake activity entries
  const activities = [
    {
      id: "act-1",
      type: "task_completed",
      taskId: recentTasks[0]?.id || "task-1",
      taskName: recentTasks[0]?.title || "Create wireframes",
      date: new Date().toISOString(),
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    },
    {
      id: "act-2",
      type: "task_updated",
      taskId: recentTasks[1]?.id || "task-2",
      taskName: recentTasks[1]?.title || "Review design mockups",
      date: subDays(new Date(), 1).toISOString(),
      icon: <Edit className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "act-3",
      type: "task_created",
      taskId: recentTasks[2]?.id || "task-3",
      taskName: recentTasks[2]?.title || "Implement login page",
      date: subDays(new Date(), 2).toISOString(),
      icon: <Plus className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "act-4",
      type: "event_created",
      eventName: "Team Meeting",
      date: subDays(new Date(), 3).toISOString(),
      icon: <Calendar className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: "act-5",
      type: "task_deadline_approaching",
      taskId: recentTasks[3]?.id || "task-4",
      taskName: recentTasks[3]?.title || "Finalize API documentation",
      date: subDays(new Date(), 4).toISOString(),
      icon: <Clock className="h-5 w-5 text-amber-500" />,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full border">{activity.icon}</div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.type === "task_completed" && "Completed task:"}
                  {activity.type === "task_updated" && "Updated task:"}
                  {activity.type === "task_created" && "Created task:"}
                  {activity.type === "event_created" && "Created calendar event:"}
                  {activity.type === "task_deadline_approaching" && "Task deadline approaching:"}{" "}
                  <span className="font-semibold">{activity.taskName || activity.eventName}</span>
                </p>
                <p className="text-sm text-muted-foreground">{format(parseISO(activity.date), "PPp")}</p>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent activity found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
