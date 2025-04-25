"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskCompletionChart } from "@/components/analytics/task-completion-chart"
import { TaskDistributionChart } from "@/components/analytics/task-distribution-chart"
import { ProductivityTrendsChart } from "@/components/analytics/productivity-trends-chart"
import { FocusTimeChart } from "@/components/analytics/focus-time-chart"
import { ProductivityScoreCard } from "@/components/analytics/productivity-score-card"

export function AnalyticsView({ analyticsData }: { analyticsData: any }) {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="time">Temps</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">90 derniers jours</SelectItem>
            <SelectItem value="1y">1 an</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TabsContent value="overview" className="mt-0 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ProductivityScoreCard analyticsData={analyticsData} />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tâches complétées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData?.tasksByStatus?.find((t: any) => t.status === "DONE")?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                sur{" "}
                {analyticsData?.tasksByStatus?.reduce(
                  (acc: number, curr: any) => acc + Number.parseInt(curr.count),
                  0,
                ) || 0}{" "}
                tâches
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Temps de concentration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  analyticsData?.pomodoroData?.reduce(
                    (acc: number, curr: any) => acc + Number.parseFloat(curr.duration),
                    0,
                  ) / 60 || 0,
                )}
                h
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  analyticsData?.pomodoroData?.reduce(
                    (acc: number, curr: any) => acc + Number.parseFloat(curr.duration),
                    0,
                  ) % 60 || 0,
                )}
                min
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData?.tasksByStatus
                  ? Math.round(
                      ((analyticsData.tasksByStatus.find((t: any) => t.status === "DONE")?.count || 0) /
                        analyticsData.tasksByStatus.reduce(
                          (acc: number, curr: any) => acc + Number.parseInt(curr.count),
                          0,
                        )) *
                        100,
                    )
                  : 0}
                %
              </div>
              <div className="mt-2 h-2 w-full bg-muted rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{
                    width: `${
                      analyticsData?.tasksByStatus
                        ? (
                            (analyticsData.tasksByStatus.find((t: any) => t.status === "DONE")?.count || 0) /
                              analyticsData.tasksByStatus.reduce(
                                (acc: number, curr: any) => acc + Number.parseInt(curr.count),
                                0,
                              )
                          ) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Complétion des tâches</CardTitle>
              <CardDescription>Nombre de tâches complétées par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskCompletionChart data={analyticsData?.taskCompletionByDay || []} />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Distribution des tâches</CardTitle>
              <CardDescription>Répartition par statut et priorité</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskDistributionChart
                statusData={analyticsData?.tasksByStatus || []}
                priorityData={analyticsData?.tasksByPriority || []}
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="tasks" className="mt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendances de productivité</CardTitle>
            <CardDescription>Comparaison entre tâches créées et complétées</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductivityTrendsChart
              creationData={analyticsData?.taskCreationByDay || []}
              completionData={analyticsData?.taskCompletionByDay || []}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="time" className="mt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Temps de concentration</CardTitle>
            <CardDescription>Minutes de concentration par jour (sessions Pomodoro)</CardDescription>
          </CardHeader>
          <CardContent>
            <FocusTimeChart data={analyticsData?.pomodoroData || []} />
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  )
}
