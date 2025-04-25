"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ResourceAllocation } from "@/utils/resource-allocation"

interface ResourceAllocationSummaryProps {
  resourceAllocations: ResourceAllocation[]
}

export function ResourceAllocationSummary({ resourceAllocations }: ResourceAllocationSummaryProps) {
  // Calculate overall metrics
  const totalTeamMembers = resourceAllocations.length
  const overallocatedMembers = resourceAllocations.filter((r) => r.overallocatedDays > 0).length
  const underallocatedMembers = resourceAllocations.filter((r) => r.averageUtilization < 50).length
  const optimallyAllocatedMembers = totalTeamMembers - overallocatedMembers - underallocatedMembers

  // Calculate average utilization across all team members
  const averageTeamUtilization =
    resourceAllocations.length > 0
      ? resourceAllocations.reduce((sum, r) => sum + r.averageUtilization, 0) / resourceAllocations.length
      : 0

  // Find most and least allocated team members
  const sortedByUtilization = [...resourceAllocations].sort((a, b) => b.averageUtilization - a.averageUtilization)
  const mostAllocated = sortedByUtilization.length > 0 ? sortedByUtilization[0] : null
  const leastAllocated = sortedByUtilization.length > 0 ? sortedByUtilization[sortedByUtilization.length - 1] : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Overall Utilization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">{averageTeamUtilization.toFixed(0)}%</div>
          <Progress
            value={averageTeamUtilization}
            className="h-2 mb-2"
            indicatorClassName={cn(
              averageTeamUtilization > 100
                ? "bg-red-500"
                : averageTeamUtilization > 85
                  ? "bg-orange-500"
                  : averageTeamUtilization > 50
                    ? "bg-yellow-500"
                    : "bg-green-500",
            )}
          />
          <div className="text-xs text-gray-500">Average utilization across {totalTeamMembers} team members</div>
        </CardContent>
      </Card>

      {/* Allocation Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Allocation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span>Overallocated</span>
              </div>
              <div className="font-medium">{overallocatedMembers}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Optimal</span>
              </div>
              <div className="font-medium">{optimallyAllocatedMembers}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span>Underallocated</span>
              </div>
              <div className="font-medium">{underallocatedMembers}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Allocated */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Most Allocated</CardTitle>
        </CardHeader>
        <CardContent>
          {mostAllocated ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mostAllocated.userAvatar || "/placeholder.svg"} alt={mostAllocated.userName} />
                  <AvatarFallback>{mostAllocated.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{mostAllocated.userName}</div>
                  <div className="text-xs text-gray-500">{mostAllocated.userTitle}</div>
                </div>
              </div>
              <Progress
                value={mostAllocated.averageUtilization}
                className="h-2 mb-1"
                indicatorClassName={cn(
                  mostAllocated.averageUtilization > 100
                    ? "bg-red-500"
                    : mostAllocated.averageUtilization > 85
                      ? "bg-orange-500"
                      : mostAllocated.averageUtilization > 50
                        ? "bg-yellow-500"
                        : "bg-green-500",
                )}
              />
              <div className="flex items-center justify-between text-sm">
                <span>Utilization</span>
                <span
                  className={cn(
                    "font-medium",
                    mostAllocated.averageUtilization > 100
                      ? "text-red-600"
                      : mostAllocated.averageUtilization > 85
                        ? "text-orange-600"
                        : mostAllocated.averageUtilization > 50
                          ? "text-yellow-600"
                          : "text-green-600",
                  )}
                >
                  {mostAllocated.averageUtilization.toFixed(0)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Least Allocated */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Least Allocated</CardTitle>
        </CardHeader>
        <CardContent>
          {leastAllocated ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={leastAllocated.userAvatar || "/placeholder.svg"} alt={leastAllocated.userName} />
                  <AvatarFallback>{leastAllocated.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{leastAllocated.userName}</div>
                  <div className="text-xs text-gray-500">{leastAllocated.userTitle}</div>
                </div>
              </div>
              <Progress
                value={leastAllocated.averageUtilization}
                className="h-2 mb-1"
                indicatorClassName={cn(
                  leastAllocated.averageUtilization > 100
                    ? "bg-red-500"
                    : leastAllocated.averageUtilization > 85
                      ? "bg-orange-500"
                      : leastAllocated.averageUtilization > 50
                        ? "bg-yellow-500"
                        : "bg-green-500",
                )}
              />
              <div className="flex items-center justify-between text-sm">
                <span>Utilization</span>
                <span
                  className={cn(
                    "font-medium",
                    leastAllocated.averageUtilization > 100
                      ? "text-red-600"
                      : leastAllocated.averageUtilization > 85
                        ? "text-orange-600"
                        : leastAllocated.averageUtilization > 50
                          ? "text-yellow-600"
                          : "text-green-600",
                  )}
                >
                  {leastAllocated.averageUtilization.toFixed(0)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
