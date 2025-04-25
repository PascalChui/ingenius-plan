import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTasks } from "@/data/tasks"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertTriangle, BarChart } from "lucide-react"

interface ProfileStatisticsProps {
  userId: string
}

export function ProfileStatistics({ userId }: ProfileStatisticsProps) {
  const allTasks = getTasks()

  // Filter tasks assigned to this user
  const userTasks = allTasks.filter((task) => task.assigneeId === userId)

  // Calculate statistics
  const totalTasks = userTasks.length
  const completedTasks = userTasks.filter((task) => task.status === "completed").length
  const inProgressTasks = userTasks.filter((task) => task.status === "in_progress").length
  const pendingTasks = userTasks.filter((task) => task.status === "todo").length
  const overdueTasks = userTasks.filter((task) => {
    if (!task.dueDate) return false
    return new Date(task.dueDate) < new Date() && task.status !== "completed"
  }).length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate priority distribution
  const highPriorityTasks = userTasks.filter((task) => task.priority === "high").length
  const mediumPriorityTasks = userTasks.filter((task) => task.priority === "medium").length
  const lowPriorityTasks = userTasks.filter((task) => task.priority === "low").length

  const highPriorityPercentage = totalTasks > 0 ? Math.round((highPriorityTasks / totalTasks) * 100) : 0
  const mediumPriorityPercentage = totalTasks > 0 ? Math.round((mediumPriorityTasks / totalTasks) * 100) : 0
  const lowPriorityPercentage = totalTasks > 0 ? Math.round((lowPriorityTasks / totalTasks) * 100) : 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Task Overview</CardTitle>
          <CardDescription>Summary of your assigned tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <span className="text-sm font-medium">{completedTasks}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">In Progress</span>
              </div>
              <span className="text-sm font-medium">{inProgressTasks}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <span className="text-sm font-medium">{pendingTasks}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Overdue</span>
              </div>
              <span className="text-sm font-medium">{overdueTasks}</span>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Task Distribution</CardTitle>
          <CardDescription>Breakdown by priority and category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium">High Priority</span>
                </div>
                <span className="text-sm font-medium">{highPriorityTasks}</span>
              </div>
              <Progress value={highPriorityPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium">Medium Priority</span>
                </div>
                <span className="text-sm font-medium">{mediumPriorityTasks}</span>
              </div>
              <Progress
                value={mediumPriorityPercentage}
                className="h-2 bg-gray-200"
                indicatorClassName="bg-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Low Priority</span>
                </div>
                <span className="text-sm font-medium">{lowPriorityTasks}</span>
              </div>
              <Progress value={lowPriorityPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Total Tasks</span>
              </div>
              <span className="text-sm font-medium">{totalTasks}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
