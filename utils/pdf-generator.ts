import jsPDF from "jspdf"
import "jspdf-autotable"
import { format } from "date-fns"
import type { Task } from "@/types/task"
import type { TaskMetrics } from "@/utils/task-metrics"

// Add the autotable plugin to jsPDF
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

// Define report types
export type ReportType = "summary" | "detailed" | "project" | "personal"

// Define report time periods
export type ReportTimePeriod = "week" | "month" | "quarter" | "year" | "custom"

// Define report options
export interface ReportOptions {
  type: ReportType
  timePeriod: ReportTimePeriod
  dateRange?: [Date, Date]
  projectId?: string
  includeCharts: boolean
  includeTaskList: boolean
  includeMetrics: boolean
  title?: string
  userName?: string
}

// Generate PDF report
export function generatePdfReport(tasks: Task[], metrics: TaskMetrics, options: ReportOptions): jsPDF {
  // Create a new PDF document
  const doc = new jsPDF()

  // Set default font
  doc.setFont("helvetica")

  // Add report title
  const title = options.title || `${capitalizeFirstLetter(options.type)} Report`
  doc.setFontSize(20)
  doc.text(title, 105, 20, { align: "center" })

  // Add report subtitle with date range
  doc.setFontSize(12)
  let dateRangeText = ""

  if (options.dateRange) {
    const [startDate, endDate] = options.dateRange
    dateRangeText = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`
  } else {
    dateRangeText = getTimePeriodText(options.timePeriod)
  }

  doc.text(`Period: ${dateRangeText}`, 105, 30, { align: "center" })

  // Add user name if provided
  if (options.userName) {
    doc.text(`User: ${options.userName}`, 105, 38, { align: "center" })
  }

  // Add generation date
  doc.setFontSize(10)
  doc.text(`Generated on: ${format(new Date(), "MMM d, yyyy, h:mm a")}`, 105, 45, { align: "center" })

  // Add horizontal line
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 50, 190, 50)

  let yPosition = 60

  // Add metrics section if requested
  if (options.includeMetrics) {
    yPosition = addMetricsSection(doc, metrics, yPosition)
  }

  // Add task list if requested
  if (options.includeTaskList) {
    yPosition = addTaskListSection(doc, tasks, yPosition)
  }

  // Add charts if requested
  if (options.includeCharts) {
    // Note: Adding charts to PDF is complex and would require canvas manipulation
    // This is a simplified placeholder
    doc.setFontSize(14)
    doc.text("Productivity Charts", 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.text("Charts are not included in this demo version.", 20, yPosition)
    yPosition += 20
  }

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" })
    doc.text("IngeniusPlan", 20, 285)
  }

  return doc
}

// Helper function to add metrics section
function addMetricsSection(doc: jsPDF, metrics: TaskMetrics, startY: number): number {
  let yPosition = startY

  doc.setFontSize(14)
  doc.text("Productivity Metrics", 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)

  // Create a metrics table
  const metricsData = [
    ["Total Tasks", metrics.totalTasks.toString()],
    ["Completed Tasks", metrics.completedTasks.toString()],
    ["Completion Rate", `${metrics.completionRate.toFixed(1)}%`],
    ["Overdue Tasks", metrics.overdueTasks.toString()],
    ["Avg. Completion Time", `${metrics.avgCompletionTime.toFixed(1)} days`],
    ["On-Time Completion Rate", `${metrics.onTimeCompletionRate.toFixed(1)}%`],
  ]

  doc.autoTable({
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: metricsData,
    theme: "grid",
    headStyles: { fillColor: [66, 66, 66] },
    margin: { left: 20, right: 20 },
    styles: { fontSize: 10 },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // Add task distribution by priority
  doc.setFontSize(12)
  doc.text("Task Distribution by Priority", 20, yPosition)
  yPosition += 8

  const priorityData = Object.entries(metrics.tasksByPriority).map(([priority, count]) => [
    priority === "null" || priority === "none" ? "None" : capitalizeFirstLetter(priority),
    count.toString(),
    `${((count / metrics.totalTasks) * 100).toFixed(1)}%`,
  ])

  doc.autoTable({
    startY: yPosition,
    head: [["Priority", "Count", "Percentage"]],
    body: priorityData,
    theme: "grid",
    headStyles: { fillColor: [66, 66, 66] },
    margin: { left: 20, right: 20 },
    styles: { fontSize: 10 },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // Add task distribution by category
  doc.setFontSize(12)
  doc.text("Task Distribution by Category", 20, yPosition)
  yPosition += 8

  const categoryData = Object.entries(metrics.tasksByCategory).map(([category, count]) => [
    category === "null" || category === "uncategorized" ? "Uncategorized" : capitalizeFirstLetter(category),
    count.toString(),
    `${((count / metrics.totalTasks) * 100).toFixed(1)}%`,
  ])

  doc.autoTable({
    startY: yPosition,
    head: [["Category", "Count", "Percentage"]],
    body: categoryData,
    theme: "grid",
    headStyles: { fillColor: [66, 66, 66] },
    margin: { left: 20, right: 20 },
    styles: { fontSize: 10 },
  })

  return (doc as any).lastAutoTable.finalY + 15
}

// Helper function to add task list section
function addTaskListSection(doc: jsPDF, tasks: Task[], startY: number): number {
  let yPosition = startY

  doc.setFontSize(14)
  doc.text("Task List", 20, yPosition)
  yPosition += 10

  // Create task table data
  const taskData = tasks.map((task) => [
    task.title,
    task.priority ? capitalizeFirstLetter(task.priority) : "None",
    task.category ? capitalizeFirstLetter(task.category) : "None",
    format(new Date(task.dueDate), "MMM d, yyyy"),
    task.completed ? "Completed" : "Pending",
    task.project || "None",
  ])

  doc.autoTable({
    startY: yPosition,
    head: [["Task", "Priority", "Category", "Due Date", "Status", "Project"]],
    body: taskData,
    theme: "grid",
    headStyles: { fillColor: [66, 66, 66] },
    margin: { left: 20, right: 20 },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 50 },
    },
  })

  return (doc as any).lastAutoTable.finalY + 15
}

// Helper function to get time period text
function getTimePeriodText(timePeriod: ReportTimePeriod): string {
  const now = new Date()

  switch (timePeriod) {
    case "week":
      return "Last 7 days"
    case "month":
      return "Last 30 days"
    case "quarter":
      return "Last 90 days"
    case "year":
      return "Last 365 days"
    default:
      return "Custom period"
  }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
