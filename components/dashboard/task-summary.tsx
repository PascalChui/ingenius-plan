"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertTriangle, AlertCircle } from "lucide-react"
import { getTasksByUserId } from "@/actions/task-actions"
import { useSession } from "next-auth/react"

export function TaskSummary() {
  const { data: session } = useSession()
  const [taskStats, setTaskStats] = useState([
    {
      title: "Tâches terminées",
      value: 0,
      icon: CheckCircle,
      color: "text-tertiary",
      bgColor: "bg-tertiary/10",
    },
    {
      title: "En cours",
      value: 0,
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Importantes",
      value: 0,
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Urgentes",
      value: 0,
      icon: AlertCircle,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ])

  useEffect(() => {
    async function fetchTaskStats() {
      if (session?.user?.id) {
        try {
          const tasks = await getTasksByUserId(session.user.id)

          const completed = tasks.filter((task) => task.status === "DONE").length
          const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length
          const important = tasks.filter((task) => task.priority === "HIGH").length
          const urgent = tasks.filter((task) => task.priority === "URGENT").length

          setTaskStats([
            {
              title: "Tâches terminées",
              value: completed,
              icon: CheckCircle,
              color: "text-tertiary",
              bgColor: "bg-tertiary/10",
            },
            {
              title: "En cours",
              value: inProgress,
              icon: Clock,
              color: "text-primary",
              bgColor: "bg-primary/10",
            },
            {
              title: "Importantes",
              value: important,
              icon: AlertTriangle,
              color: "text-accent",
              bgColor: "bg-accent/10",
            },
            {
              title: "Urgentes",
              value: urgent,
              icon: AlertCircle,
              color: "text-secondary",
              bgColor: "bg-secondary/10",
            },
          ])
        } catch (error) {
          console.error("Error fetching task stats:", error)
        }
      }
    }

    fetchTaskStats()
  }, [session])

  return (
    <>
      {taskStats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-full`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}
