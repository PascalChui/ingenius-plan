import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react"

interface CompletionRateCardProps {
  completionRate: number
  completedTasks: number
  totalTasks: number
}

export function CompletionRateCard({ completionRate, completedTasks, totalTasks }: CompletionRateCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
            <p className="text-2xl font-bold">{completionRate.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AverageCompletionTimeCardProps {
  avgCompletionTime: number
}

export function AverageCompletionTimeCard({ avgCompletionTime }: AverageCompletionTimeCardProps) {
  const days = Math.floor(avgCompletionTime)
  const hours = Math.round((avgCompletionTime - days) * 24)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avg. Completion Time</p>
            <p className="text-2xl font-bold">
              {days}d {hours}h
            </p>
            <p className="text-xs text-muted-foreground mt-1">Average time to complete tasks</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface OverdueTasksCardProps {
  overdueTasks: number
  totalTasks: number
}

export function OverdueTasksCard({ overdueTasks, totalTasks }: OverdueTasksCardProps) {
  const overduePercentage = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Overdue Tasks</p>
            <p className="text-2xl font-bold">{overdueTasks}</p>
            <p className="text-xs text-muted-foreground mt-1">{overduePercentage.toFixed(0)}% of total tasks</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProductivityCardProps {
  onTimeCompletionRate: number
}

export function ProductivityCard({ onTimeCompletionRate }: ProductivityCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">On-Time Completion</p>
            <p className="text-2xl font-bold">{onTimeCompletionRate.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Tasks completed before deadline</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
