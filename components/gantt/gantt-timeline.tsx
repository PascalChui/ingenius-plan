import { getTimelineDates, formatTimelineHeader } from "@/utils/gantt-utils"
import { format, isToday, isWeekend } from "date-fns"
import { cn } from "@/lib/utils"

interface GanttTimelineProps {
  startDate: Date
  endDate: Date
  viewMode: "day" | "week" | "month"
  columnWidth: number
}

export function GanttTimeline({ startDate, endDate, viewMode, columnWidth }: GanttTimelineProps) {
  const timelineDates = getTimelineDates(startDate, endDate, viewMode)

  return (
    <div className="border-b bg-gray-50 sticky top-0 z-10">
      <div className="flex h-10">
        {timelineDates.map((date, index) => (
          <div
            key={index}
            className={cn(
              "flex-shrink-0 border-r flex items-center justify-center text-xs font-medium",
              isToday(date) ? "bg-blue-50" : isWeekend(date) && viewMode === "day" ? "bg-gray-100" : "",
            )}
            style={{ width: columnWidth }}
          >
            {formatTimelineHeader(date, viewMode)}
          </div>
        ))}
      </div>

      {/* For day view, add a second row with day of week */}
      {viewMode === "day" && (
        <div className="flex h-6 border-t">
          {timelineDates.map((date, index) => (
            <div
              key={index}
              className={cn(
                "flex-shrink-0 border-r flex items-center justify-center text-xs text-gray-500",
                isToday(date) ? "bg-blue-50" : isWeekend(date) ? "bg-gray-100" : "",
              )}
              style={{ width: columnWidth }}
            >
              {format(date, "EEE")}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
