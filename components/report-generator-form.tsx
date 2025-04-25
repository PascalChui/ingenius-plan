"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import type { ReportOptions, ReportType, ReportTimePeriod } from "@/utils/pdf-generator"
import { generatePdfReport } from "@/utils/pdf-generator"
import { tasks } from "@/data/tasks"
import { calculateTaskMetrics } from "@/utils/task-metrics"

export function ReportGeneratorForm() {
  // Default date range (last 30 days)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Report options state
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    type: "summary",
    timePeriod: "month",
    includeCharts: true,
    includeTaskList: true,
    includeMetrics: true,
  })

  // Custom report title
  const [customTitle, setCustomTitle] = useState("")

  // User name for the report
  const [userName, setUserName] = useState("")

  // Selected project for project reports
  const [selectedProject, setSelectedProject] = useState<string>("")

  // Handle report type change
  const handleReportTypeChange = (value: string) => {
    setReportOptions((prev) => ({
      ...prev,
      type: value as ReportType,
    }))
  }

  // Handle time period change
  const handleTimePeriodChange = (value: string) => {
    const timePeriod = value as ReportTimePeriod
    setReportOptions((prev) => ({
      ...prev,
      timePeriod,
    }))

    // Update date range based on time period
    const today = new Date()
    switch (timePeriod) {
      case "week":
        setDateRange({ from: subDays(today, 7), to: today })
        break
      case "month":
        setDateRange({ from: subDays(today, 30), to: today })
        break
      case "quarter":
        setDateRange({ from: subDays(today, 90), to: today })
        break
      case "year":
        setDateRange({ from: subDays(today, 365), to: today })
        break
      // For custom, keep the current date range
    }
  }

  // Handle toggle changes
  const handleToggleChange = (key: keyof ReportOptions) => {
    setReportOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Handle project selection
  const handleProjectChange = (value: string) => {
    setSelectedProject(value)
    setReportOptions((prev) => ({
      ...prev,
      projectId: value === "all" ? undefined : value,
    }))
  }

  // Generate and download the report
  const handleGenerateReport = () => {
    if (!dateRange.from || !dateRange.to) return

    // Filter tasks based on date range and project if selected
    let filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      return taskDate >= dateRange.from! && taskDate <= dateRange.to!
    })

    // Filter by project if a specific project is selected
    if (reportOptions.projectId) {
      filteredTasks = filteredTasks.filter((task) => task.project === reportOptions.projectId)
    }

    // Calculate metrics for the filtered tasks
    const metrics = calculateTaskMetrics(filteredTasks, [dateRange.from, dateRange.to])

    // Prepare final report options
    const finalOptions: ReportOptions = {
      ...reportOptions,
      dateRange: [dateRange.from, dateRange.to],
      title: customTitle || undefined,
      userName: userName || undefined,
    }

    // Generate the PDF
    const doc = generatePdfReport(filteredTasks, metrics, finalOptions)

    // Generate filename
    const reportType = finalOptions.type.charAt(0).toUpperCase() + finalOptions.type.slice(1)
    const dateStr = new Date().toISOString().split("T")[0]
    const filename = `IngeniusPlan_${reportType}_Report_${dateStr}.pdf`

    // Download the PDF
    doc.save(filename)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportOptions.type} onValueChange={handleReportTypeChange}>
                  <SelectTrigger id="report-type" className="mt-1">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="project">Project Report</SelectItem>
                    <SelectItem value="personal">Personal Productivity Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time-period">Time Period</Label>
                <Select value={reportOptions.timePeriod} onValueChange={handleTimePeriodChange}>
                  <SelectTrigger id="time-period" className="mt-1">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">Last 90 Days</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reportOptions.timePeriod === "custom" && (
                <div>
                  <Label>Custom Date Range</Label>
                  <div className="mt-1">
                    <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
                  </div>
                </div>
              )}

              {reportOptions.type === "project" && (
                <div>
                  <Label htmlFor="project">Project</Label>
                  <Select value={selectedProject} onValueChange={handleProjectChange}>
                    <SelectTrigger id="project" className="mt-1">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                      <SelectItem value="Database Migration">Database Migration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-title">Custom Report Title (Optional)</Label>
                <Input
                  id="custom-title"
                  placeholder="Enter custom title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="user-name">Your Name (Optional)</Label>
                <Input
                  id="user-name"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-metrics" className="cursor-pointer">
                    Include Productivity Metrics
                  </Label>
                  <Switch
                    id="include-metrics"
                    checked={reportOptions.includeMetrics}
                    onCheckedChange={() => handleToggleChange("includeMetrics")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-task-list" className="cursor-pointer">
                    Include Task List
                  </Label>
                  <Switch
                    id="include-task-list"
                    checked={reportOptions.includeTaskList}
                    onCheckedChange={() => handleToggleChange("includeTaskList")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-charts" className="cursor-pointer">
                    Include Charts
                  </Label>
                  <Switch
                    id="include-charts"
                    checked={reportOptions.includeCharts}
                    onCheckedChange={() => handleToggleChange("includeCharts")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleGenerateReport} className="bg-black text-white hover:bg-gray-800">
              <Download className="h-4 w-4 mr-2" />
              Generate & Download Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
