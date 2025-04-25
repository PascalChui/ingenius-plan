"use client"

import { useDashboard } from "@/contexts/dashboard-context"
import { DashboardWidget } from "./dashboard-widget"
import {
  CompletionRateCard,
  ProductivityCard,
  OverdueTasksCard,
  AverageCompletionTimeCard,
} from "@/components/statistics"
import { TaskCompletionChart } from "./widgets/task-completion-chart"
import { TaskDistributionChart } from "./widgets/task-distribution-chart"
import { TeamPerformanceChart } from "./widgets/team-performance-chart"
import { TaskStatusChart } from "./widgets/task-status-chart"
import { TaskPriorityChart } from "./widgets/task-priority-chart"
import { TaskTimelineChart } from "./widgets/task-timeline-chart"
import { TaskHeatmapChart } from "./widgets/task-heatmap-chart"
import { TaskComparisonChart } from "./widgets/task-comparison-chart"

export function DashboardGrid() {
  const { metrics, layout } = useDashboard()

  if (!metrics) return null

  // Layout classes based on the selected layout
  const gridClasses = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
    columns: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
    full: "space-y-6 mb-6",
  }

  const chartGridClasses = {
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",
    columns: "grid grid-cols-1 gap-6 mb-6",
    full: "space-y-6 mb-6",
  }

  return (
    <>
      {/* Key Metrics Cards */}
      <div className={gridClasses[layout]}>
        <DashboardWidget id="completion-rate" title="Completion Rate">
          <CompletionRateCard
            completionRate={metrics.completionRate}
            completedTasks={metrics.completedTasks}
            totalTasks={metrics.totalTasks}
          />
        </DashboardWidget>

        <DashboardWidget id="avg-completion-time" title="Average Completion Time">
          <AverageCompletionTimeCard avgCompletionTime={metrics.avgCompletionTime} />
        </DashboardWidget>

        <DashboardWidget id="overdue-tasks" title="Overdue Tasks">
          <OverdueTasksCard overdueTasks={metrics.overdueTasks} totalTasks={metrics.totalTasks} />
        </DashboardWidget>

        <DashboardWidget id="productivity" title="On-Time Completion">
          <ProductivityCard onTimeCompletionRate={metrics.onTimeCompletionRate} />
        </DashboardWidget>
      </div>

      {/* Primary Charts */}
      <div className={chartGridClasses[layout]}>
        <DashboardWidget
          id="task-completion-trend"
          title="Task Completion Trend"
          description="Track task creation and completion over time"
        >
          <TaskCompletionChart data={metrics.completionTrend} />
        </DashboardWidget>

        <DashboardWidget
          id="task-distribution"
          title="Task Distribution by Category"
          description="Breakdown of tasks by category"
        >
          <TaskDistributionChart
            data={Object.entries(metrics.tasksByCategory).map(([name, value]) => ({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              value,
            }))}
          />
        </DashboardWidget>
      </div>

      {/* Secondary Charts */}
      <div className={chartGridClasses[layout]}>
        <DashboardWidget
          id="team-performance"
          title="Team Performance"
          description="Compare task completion rates across team members"
        >
          <TeamPerformanceChart />
        </DashboardWidget>

        <DashboardWidget id="task-status" title="Tasks by Status" description="Current distribution of tasks by status">
          <TaskStatusChart />
        </DashboardWidget>
      </div>

      {/* Tertiary Charts */}
      <div className={chartGridClasses[layout]}>
        <DashboardWidget
          id="task-priority"
          title="Tasks by Priority"
          description="Distribution of tasks by priority level"
        >
          <TaskPriorityChart
            data={Object.entries(metrics.tasksByPriority).map(([name, value]) => ({
              name,
              value,
            }))}
          />
        </DashboardWidget>

        <DashboardWidget
          id="task-timeline"
          title="Task Timeline"
          description="Timeline view of upcoming and overdue tasks"
        >
          <TaskTimelineChart />
        </DashboardWidget>
      </div>

      {/* Full Width Charts */}
      <div className="space-y-6 mb-6">
        <DashboardWidget
          id="task-heatmap"
          title="Task Activity Heatmap"
          description="Visualize task activity patterns by day and hour"
        >
          <TaskHeatmapChart />
        </DashboardWidget>

        <DashboardWidget
          id="task-comparison"
          title="Period Comparison"
          description="Compare current period with previous period"
        >
          <TaskComparisonChart />
        </DashboardWidget>
      </div>
    </>
  )
}
