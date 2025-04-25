"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Edit, Plus } from "lucide-react"
import { getTasksByUserId } from "@/actions/task-actions"
import { getEventsByUserId } from "@/actions/event-actions"
import { useSession } from "next-auth/react"

export function RecentActivity() {
  const { data: session } = useSession()
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    async function fetchActivities() {
      if (session?.user?.id) {
        try {
          // Fetch tasks and events
          const tasks = await getTasksByUserId(session.user.id)
          const events = await getEventsByUserId(session.user.id)

          // Create activity items from tasks
          const taskActivities = tasks.slice(0, 5).map((task) => {
            let type, description, icon, iconColor, iconBg

            if (task.status === "DONE") {
              type = "task_completed"
              description = `Vous avez terminé la tâche "${task.title}"`
              icon = CheckCircle2
              iconColor = "text-tertiary"
              iconBg = "bg-tertiary/10"
            } else if (task.status === "IN_PROGRESS") {
              type = "task_updated"
              description = `Vous avez mis à jour la tâche "${task.title}"`
              icon = Edit
              iconColor = "text-accent"
              iconBg = "bg-accent/10"
            } else {
              type = "task_created"
              description = `Vous avez créé une nouvelle tâche "${task.title}"`
              icon = Plus
              iconColor = "text-primary"
              iconBg = "bg-primary/10"
            }

            // Calculate time difference
            const updatedAt = new Date(task.updatedAt)
            const now = new Date()
            const diffMs = now.getTime() - updatedAt.getTime()
            const diffMins = Math.round(diffMs / 60000)
            const diffHours = Math.round(diffMs / 3600000)
            const diffDays = Math.round(diffMs / 86400000)

            let time
            if (diffMins < 60) {
              time = `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`
            } else if (diffHours < 24) {
              time = `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
            } else {
              time = `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
            }

            return {
              id: task.id,
              type,
              description,
              time,
              icon,
              iconColor,
              iconBg,
              timestamp: updatedAt,
            }
          })

          // Create activity items from upcoming events
          const eventActivities = events
            .filter((event) => new Date(event.startTime) > new Date())
            .slice(0, 3)
            .map((event) => {
              // Calculate time until event
              const eventDate = new Date(event.startTime)
              const now = new Date()
              const diffMs = eventDate.getTime() - now.getTime()
              const diffDays = Math.round(diffMs / 86400000)

              let time
              if (diffDays === 0) {
                time = "Aujourd'hui"
              } else if (diffDays === 1) {
                time = "Demain"
              } else {
                time = `Dans ${diffDays} jours`
              }

              return {
                id: event.id,
                type: "reminder",
                description: `Rappel pour l'événement "${event.title}"`,
                time,
                icon: Clock,
                iconColor: "text-secondary",
                iconBg: "bg-secondary/10",
                timestamp: now, // Use current time for sorting
              }
            })

          // Combine and sort activities
          const combinedActivities = [...taskActivities, ...eventActivities]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5)

          setActivities(combinedActivities)
        } catch (error) {
          console.error("Error fetching activities:", error)
        }
      }
    }

    fetchActivities()
  }, [session])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`${activity.iconBg} p-2 rounded-full mt-0.5`}>
                    <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="space-y-1">
                    <p>{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-muted-foreground">Aucune activité récente</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
