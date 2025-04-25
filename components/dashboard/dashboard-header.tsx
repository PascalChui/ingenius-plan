"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/date-range-picker"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, LayoutGrid, Columns, Maximize2, Download, Settings, Share2 } from "lucide-react"
import { useDashboard } from "@/contexts/dashboard-context"
import { DashboardFilters } from "./dashboard-filters"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { subDays } from "date-fns"

export function DashboardHeader() {
  const { dateRange, setDateRange, layout, setLayout } = useDashboard()

  const [timePeriod, setTimePeriod] = useState("30days")
  const [showFilters, setShowFilters] = useState(false)

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

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Interactive Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />

          <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
            <Settings className="h-4 w-4" />
            Filters
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Image</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" className="h-9 w-9">
            <Share2 className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <Tabs value={timePeriod} onValueChange={handleTimePeriodChange}>
          <TabsList>
            <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
            <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
            <TabsTrigger value="90days">Last 90 Days</TabsTrigger>
            <TabsTrigger value="year">Last Year</TabsTrigger>
            <TabsTrigger value="custom">Custom Range</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center">
          <Tabs value={layout} onValueChange={(value) => setLayout(value as any)}>
            <TabsList>
              <TabsTrigger value="grid" className="px-3">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="columns" className="px-3">
                <Columns className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="full" className="px-3">
                <Maximize2 className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {showFilters && <DashboardFilters className="mb-6" />}
    </>
  )
}
