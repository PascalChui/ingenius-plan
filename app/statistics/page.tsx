"use client"

import { useState, useMemo } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, FileText } from "lucide-react"
import { tasks } from "@/data/tasks"
import { calculateTaskMetrics } from "@/utils/task-metrics"
// Import components directly from their file paths
import { LineChart } from "@/components/statistics/line-chart"
import { BarChart } from "@/components/statistics/bar-chart"
import { PieChart } from "@/components/statistics/pie-chart"
import {
  CompletionRateCard,
  ProductivityCard,
  OverdueTasksCard,
  AverageCompletionTimeCard,
} from "@/components/statistics/metric-cards"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { DateRangePicker } from "@/components/date-range-picker"
import Link from "next/link"

export default function StatisticsPage() {
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Time period tabs
  const [timePeriod, setTimePeriod] = useState("30days")

  // Handle time period change
  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value)
    const today = new Date()

    switch (value) {
      case "7days":
        setDateRange({ from: subDays(today, 7), to: today })
        break
      case "30days":
        setDateRange({ from: subDays(today, 30), to: today })
        break
      case "90days":
        setDateRange({ from: subDays(today, 90), to: today })
        break
      case "year":
        setDateRange({ from: subDays(today, 365), to: today })
        break
      default:
        break
    }
  }

  // Calculate metrics based on date range
  const metrics = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return null
    return calculateTaskMetrics(tasks, dateRange.from as Date, dateRange.to as Date)
  }, [dateRange])

  if (!metrics) return null

  return (
    <Layout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Task Statistics</h1>
          <div className="flex items-center gap-2">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />

            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Link href="/reports">
              <Button variant="outline" size="sm" className="gap-1">
                <FileText className="h-4 w-4" />
                Reports
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={timePeriod} onValueChange={handleTimePeriodChange} className="mb-6">
          <TabsList>
            <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
            <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
            <TabsTrigger value="90days">Last 90 Days</TabsTrigger>
            <TabsTrigger value="year">Last Year</TabsTrigger>
            <TabsTrigger value="custom">Custom Range</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CompletionRateCard
            completionRate={metrics.completionRate}
            completedTasks={metrics.completedTasks}
            totalTasks={metrics.totalTasks}
          />
          <AverageCompletionTimeCard avgCompletionTime={metrics.avgCompletionTime} />
          <OverdueTasksCard overdueTasks={metrics.overdueTasks} totalTasks={metrics.totalTasks} />
          <ProductivityCard onTimeCompletionRate={metrics.onTimeCompletionRate} />
        </div>

        {/* Charts - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Task Completion Trend</h2>
              <LineChart data={metrics.completionTrend} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tasks by Priority</h2>
              <PieChart data={Object.entries(metrics.tasksByPriority).map(([name, value]) => ({ name, value }))} />
            </CardContent>
          </Card>
        </div>

        {/* Charts - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tasks by Category</h2>
              <BarChart
                data={Object.entries(metrics.tasksByCategory).map(([name, value]) => ({
                  name: name.charAt(0).toUpperCase() + name.slice(1),
                  value,
                }))}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tasks by Day of Week</h2>
              <BarChart data={Object.entries(metrics.tasksByWeekday).map(([name, value]) => ({ name, value }))} />
            </CardContent>
          </Card>
        </div>

        {/* Charts - Third Row */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tasks by Project</h2>
              <BarChart
                data={Object.entries(metrics.tasksByProject)
                  .filter(([name]) => name !== "No Project")
                  .map(([name, value]) => ({ name, value }))}
                layout="horizontal"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
