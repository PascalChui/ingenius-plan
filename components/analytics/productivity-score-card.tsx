"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProductivityScoreCard({ analyticsData }: { analyticsData: any }) {
  // Calculate productivity score based on various metrics
  const calculateProductivityScore = () => {
    if (!analyticsData) return 0

    let score = 0
    let maxScore = 0

    // Task completion rate (up to 40 points)
    const totalTasks =
      analyticsData.tasksByStatus?.reduce((acc: number, curr: any) => acc + Number.parseInt(curr.count), 0) || 0
    const completedTasks = analyticsData.tasksByStatus?.find((t: any) => t.status === "DONE")?.count || 0

    if (totalTasks > 0) {
      score += (completedTasks / totalTasks) * 40
      maxScore += 40
    }

    // Focus time (up to 30 points)
    const totalFocusMinutes =
      analyticsData.pomodoroData?.reduce((acc: number, curr: any) => acc + Number.parseFloat(curr.duration), 0) || 0
    // Assume 25 minutes per day is good (750 minutes per month)
    const focusScore = Math.min((totalFocusMinutes / 750) * 30, 30)
    score += focusScore
    maxScore += 30

    // Task creation vs completion ratio (up to 30 points)
    const createdTasks =
      analyticsData.taskCreationByDay?.reduce((acc: number, curr: any) => acc + Number.parseInt(curr.count), 0) || 0

    if (createdTasks > 0) {
      const ratio = Math.min(completedTasks / createdTasks, 1)
      score += ratio * 30
      maxScore += 30
    }

    // Return percentage
    return Math.round((score / maxScore) * 100) || 0
  }

  const score = calculateProductivityScore()

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return "text-tertiary"
    if (score >= 60) return "text-primary"
    if (score >= 40) return "text-accent"
    return "text-secondary"
  }

  // Determine message based on score
  const getScoreMessage = () => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Bon"
    if (score >= 40) return "Moyen"
    return "À améliorer"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Score de productivité</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getScoreColor()}`}>{score}%</div>
        <p className="text-xs text-muted-foreground">{getScoreMessage()}</p>
        <div className="mt-2 h-2 w-full bg-muted rounded-full">
          <div
            className={`h-2 rounded-full ${score >= 80 ? "bg-tertiary" : score >= 60 ? "bg-primary" : score >= 40 ? "bg-accent" : "bg-secondary"}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  )
}
