"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, FileText, BarChart2, Calendar, Clock } from "lucide-react"
import { ReportGeneratorForm } from "@/components/report-generator-form"
import Link from "next/link"
import { useState } from "react"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("generate")

  return (
    <Layout>
      <div className="container px-4 py-6">
        <div className="mb-6">
          <Link href="/statistics" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Statistics
          </Link>
          <h1 className="text-2xl font-bold">Productivity Reports</h1>
          <p className="text-gray-500 mt-1">
            Generate and download customized reports with productivity metrics and task data
          </p>
        </div>

        <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="generate">
              <FileText className="h-4 w-4 mr-1" />
              Generate Report
            </TabsTrigger>
            <TabsTrigger value="templates">
              <BarChart2 className="h-4 w-4 mr-1" />
              Report Templates
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <Calendar className="h-4 w-4 mr-1" />
              Scheduled Reports
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-1" />
              Report History
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "generate" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Generate Custom Report</h2>
            <ReportGeneratorForm />
          </div>
        )}

        {activeTab === "templates" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Report Templates</h2>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Create New Template
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTemplates.map((template) => (
                <ReportTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "scheduled" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Scheduled Reports</h2>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule New Report
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledReports.map((report) => (
                <ScheduledReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Report History</h2>

            <div className="space-y-4">
              {reportHistory.map((report) => (
                <ReportHistoryItem key={report.id} report={report} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

// Report template card component
function ReportTemplateCard({ template }: { template: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold">{template.name}</h3>
          <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{template.type}</div>
        </div>
        <p className="text-sm text-gray-500 mb-4">{template.description}</p>
        <div className="text-xs text-gray-500 mb-4">
          <div>Time Period: {template.timePeriod}</div>
          <div>Created: {template.createdAt}</div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button size="sm" className="bg-black text-white hover:bg-gray-800">
            <Download className="h-4 w-4 mr-1" />
            Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Scheduled report card component
function ScheduledReportCard({ report }: { report: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold">{report.name}</h3>
          <div className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">{report.frequency}</div>
        </div>
        <p className="text-sm text-gray-500 mb-4">{report.description}</p>
        <div className="text-xs text-gray-500 mb-4">
          <div>Next Run: {report.nextRun}</div>
          <div>Recipients: {report.recipients}</div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
            Disable
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Report history item component
function ReportHistoryItem({ report }: { report: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{report.name}</h3>
            <div className="text-sm text-gray-500">Generated: {report.generatedAt}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{report.type}</div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Sample data for report templates
const reportTemplates = [
  {
    id: "template-1",
    name: "Weekly Productivity Summary",
    type: "Summary",
    description: "A weekly overview of task completion and productivity metrics",
    timePeriod: "Last 7 days",
    createdAt: "Apr 15, 2025",
  },
  {
    id: "template-2",
    name: "Monthly Project Progress",
    type: "Project",
    description: "Detailed monthly report on project progress and task distribution",
    timePeriod: "Last 30 days",
    createdAt: "Apr 10, 2025",
  },
  {
    id: "template-3",
    name: "Quarterly Performance Review",
    type: "Detailed",
    description: "Comprehensive quarterly report with all productivity metrics",
    timePeriod: "Last 90 days",
    createdAt: "Mar 31, 2025",
  },
]

// Sample data for scheduled reports
const scheduledReports = [
  {
    id: "scheduled-1",
    name: "Weekly Team Performance",
    frequency: "Weekly",
    description: "Sent every Monday morning to the team",
    nextRun: "Apr 29, 2025",
    recipients: "Team (5 members)",
  },
  {
    id: "scheduled-2",
    name: "Monthly Executive Summary",
    frequency: "Monthly",
    description: "Sent on the 1st of each month to management",
    nextRun: "May 1, 2025",
    recipients: "Management (3 members)",
  },
]

// Sample data for report history
const reportHistory = [
  {
    id: "history-1",
    name: "Weekly Productivity Summary",
    type: "Summary",
    generatedAt: "Apr 22, 2025, 9:30 AM",
  },
  {
    id: "history-2",
    name: "Project Progress Report - Website Redesign",
    type: "Project",
    generatedAt: "Apr 15, 2025, 2:45 PM",
  },
  {
    id: "history-3",
    name: "Monthly Performance Review",
    type: "Detailed",
    generatedAt: "Apr 1, 2025, 10:15 AM",
  },
  {
    id: "history-4",
    name: "Quarterly Productivity Analysis",
    type: "Detailed",
    generatedAt: "Mar 31, 2025, 4:20 PM",
  },
]
