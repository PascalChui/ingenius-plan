"use client"
import { format, addDays, isWeekend } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ResourceAllocation, DailyAllocation } from "@/utils/resource-allocation"

interface ResourceAllocationChartProps {
  resourceAllocations: ResourceAllocation[]
  startDate: Date
  endDate: Date
  onTaskClick?: (taskId: string) => void
}

export function ResourceAllocationChart({
  resourceAllocations,
  startDate,
  endDate,
  onTaskClick,
}: ResourceAllocationChartProps) {
  // Generate all dates in the range
  const dates: Date[] = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate = addDays(currentDate, 1)
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Header with dates */}
        <div className="flex border-b sticky top-0 bg-white z-10">
          <div className="w-64 flex-shrink-0 p-2 font-medium border-r">Team Member</div>
          {dates.map((date, index) => (
            <div
              key={index}
              className={cn("w-16 flex-shrink-0 p-1 text-center text-xs border-r", isWeekend(date) && "bg-gray-50")}
            >
              <div className="font-medium">{format(date, "EEE")}</div>
              <div>{format(date, "MMM d")}</div>
            </div>
          ))}
          <div className="w-24 flex-shrink-0 p-2 text-center text-xs font-medium border-r">Avg. Util.</div>
        </div>

        {/* Resource rows */}
        {resourceAllocations.map((resource) => (
          <div key={resource.userId} className="flex border-b hover:bg-gray-50">
            {/* Resource info */}
            <div className="w-64 flex-shrink-0 p-2 border-r">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={resource.userAvatar || "/placeholder.svg"} alt={resource.userName} />
                  <AvatarFallback>{resource.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <div className="font-medium truncate">{resource.userName}</div>
                  {resource.userTitle && <div className="text-xs text-gray-500 truncate">{resource.userTitle}</div>}
                </div>
              </div>
            </div>

            {/* Allocation cells */}
            <TooltipProvider>
              {dates.map((date, index) => {
                const dateString = format(date, "yyyy-MM-dd")
                const allocation =
                  resource.allocations.find((a) => a.date === dateString) ||
                  ({
                    hours: 0,
                    utilization: 0,
                    tasks: [],
                  } as DailyAllocation)

                // Determine cell color based on utilization
                let cellColor = "bg-gray-50"
                if (allocation.utilization > 0) {
                  if (allocation.utilization <= 50) {
                    cellColor = "bg-green-100"
                  } else if (allocation.utilization <= 85) {
                    cellColor = "bg-yellow-100"
                  } else if (allocation.utilization <= 100) {
                    cellColor = "bg-orange-100"
                  } else {
                    cellColor = "bg-red-100"
                  }
                }

                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "w-16 h-16 flex-shrink-0 border-r relative",
                          isWeekend(date) ? "bg-gray-50" : cellColor,
                        )}
                      >
                        {allocation.tasks.length > 0 && (
                          <div className="absolute inset-0 p-1">
                            {allocation.tasks.map((task, taskIndex) => (
                              <div
                                key={taskIndex}
                                className="h-2 mb-1 rounded-sm cursor-pointer"
                                style={{
                                  backgroundColor: task.color,
                                  width: `${(task.hours / 8) * 100}%`,
                                }}
                                onClick={() => onTaskClick?.(task.id)}
                              />
                            ))}
                          </div>
                        )}
                        {allocation.hours > 0 && (
                          <div className="absolute bottom-1 right-1 text-xs font-medium">
                            {Math.round(allocation.hours)}h
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <div className="text-sm font-medium">{format(date, "EEEE, MMMM d")}</div>
                      <div className="text-xs">
                        {allocation.hours.toFixed(1)} hours ({allocation.utilization.toFixed(0)}%)
                      </div>
                      {allocation.tasks.length > 0 ? (
                        <div className="mt-1 space-y-1">
                          {allocation.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex items-center gap-1 text-xs">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.color }} />
                              <span>
                                {task.title} ({task.hours.toFixed(1)}h)
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 mt-1">No tasks scheduled</div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </TooltipProvider>

            {/* Average utilization */}
            <div
              className={cn(
                "w-24 flex-shrink-0 p-2 text-center font-medium border-r",
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
            </div>
          </div>
        ))}

        {/* Empty state */}
        {resourceAllocations.length === 0 && (
          <div className="py-8 text-center text-gray-500">No resource allocations found for the selected criteria.</div>
        )}
      </div>
    </div>
  )
}
