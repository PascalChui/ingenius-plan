"use client"

import { useState } from "react"
import { startOfWeek, endOfWeek } from "date-fns"
import { format, parseISO } from "date-fns"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResourceAllocationChart } from "@/components/resource/resource-allocation-chart"
import { ResourceAllocationFilters } from "@/components/resource/resource-allocation-filters"
import { ResourceAllocationSummary } from "@/components/resource/resource-allocation-summary"
import { calculateResourceAllocation, type AllocationFilters } from "@/utils/resource-allocation"
import { users } from "@/data/teams"
import { tasks } from "@/data/tasks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ResourcesPage() {
  // Initialize filters with default values
  const [filters, setFilters] = useState<AllocationFilters>({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    teamMembers: [],
    showOverallocatedOnly: false,
  })

  // Calculate resource allocations based on filters
  const resourceAllocations = calculateResourceAllocation(tasks, users, filters)

  return (
    <Layout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Resource Allocation</h1>
        </div>

        <Tabs defaultValue="chart">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chart" className="space-y-4">
            {/* Filters */}
            <ResourceAllocationFilters users={users} filters={filters} onFiltersChange={setFilters} />

            {/* Summary Cards */}
            <ResourceAllocationSummary resourceAllocations={resourceAllocations} />

            {/* Resource Allocation Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResourceAllocationChart
                  resourceAllocations={resourceAllocations}
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <ResourceAllocationFilters users={users} filters={filters} onFiltersChange={setFilters} />

            {/* Summary Cards */}
            <ResourceAllocationSummary resourceAllocations={resourceAllocations} />

            {/* Resource Allocation List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Resource Allocation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {resourceAllocations.map((resource) => (
                    <div key={resource.userId} className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={resource.userAvatar || "/placeholder.svg"} alt={resource.userName} />
                              <AvatarFallback>{resource.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{resource.userName}</div>
                              {resource.userTitle && <div className="text-xs text-gray-500">{resource.userTitle}</div>}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className="text-gray-500">Total Hours:</span>{" "}
                              <span className="font-medium">{resource.totalHours.toFixed(1)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Utilization:</span>{" "}
                              <span
                                className={cn(
                                  "font-medium",
                                  resource.averageUtilization > 100
                                    ? "text-red-600"
                                    : resource.averageUtilization > 85
                                      ? "text-orange-600"
                                      : resource.averageUtilization > 50
                                        ? "text-yellow-600"
                                        : "text-green-600",
                                )}
                              >
                                {resource.averageUtilization.toFixed(0)}%
                              </span>
                            </div>
                            {resource.overallocatedDays > 0 && (
                              <div className="text-sm text-red-600">
                                <AlertCircle className="h-4 w-4 inline mr-1" />
                                {resource.overallocatedDays} overallocated{" "}
                                {resource.overallocatedDays === 1 ? "day" : "days"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium">Task</th>
                              <th className="text-left py-2 font-medium">Date Range</th>
                              <th className="text-left py-2 font-medium">Hours</th>
                              <th className="text-left py-2 font-medium">Priority</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resource.allocations
                              .flatMap((allocation) => allocation.tasks)
                              .filter((task, index, self) => index === self.findIndex((t) => t.id === task.id))
                              .map((task, index) => {
                                const fullTask = tasks.find((t) => t.id === task.id)
                                if (!fullTask) return null

                                return (
                                  <tr key={index} className="border-b last:border-0">
                                    <td className="py-2">{fullTask.title}</td>
                                    <td className="py-2">
                                      {fullTask.startDate ? format(parseISO(fullTask.startDate), "MMM d") : "—"} -{" "}
                                      {format(parseISO(fullTask.dueDate), "MMM d, yyyy")}
                                    </td>
                                    <td className="py-2">{fullTask.estimatedHours || "—"}</td>
                                    <td className="py-2">
                                      <span
                                        className={cn(
                                          "px-2 py-1 rounded-full text-xs",
                                          fullTask.priority === "high"
                                            ? "bg-red-100 text-red-800"
                                            : fullTask.priority === "medium"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-green-100 text-green-800",
                                        )}
                                      >
                                        {fullTask.priority.charAt(0).toUpperCase() + fullTask.priority.slice(1)}
                                      </span>
                                    </td>
                                  </tr>
                                )
                              })}
                            {resource.allocations.flatMap((a) => a.tasks).length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-4 text-center text-gray-500">
                                  No tasks assigned during the selected period
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}

                  {resourceAllocations.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      No resource allocations found for the selected criteria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
