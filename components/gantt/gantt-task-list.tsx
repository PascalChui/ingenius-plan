"use client"

import type { GanttTask } from "@/utils/gantt-utils"
import { format, parseISO } from "date-fns"
import { CheckCircle2, Circle, AlertCircle, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface GanttTaskListProps {
  tasks: GanttTask[]
  rowHeight: number
  onToggleExpand: (taskId: string) => void
}

export function GanttTaskList({ tasks, rowHeight, onToggleExpand }: GanttTaskListProps) {
  return (
    <div className="overflow-y-auto">
      {tasks
        .filter((task) => task.visible !== false)
        .map((task) => (
          <div key={task.id} className="flex items-center border-b hover:bg-gray-50" style={{ height: rowHeight }}>
            <div
              className="flex items-center gap-2 w-full overflow-hidden px-4"
              style={{ paddingLeft: `${(task.level || 0) * 16 + 16}px` }}
            >
              {task.isParent && (
                <button
                  className="flex-shrink-0 w-4 h-4 flex items-center justify-center"
                  onClick={() => onToggleExpand(task.id)}
                >
                  {task.expanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              )}

              {!task.isParent && <div className="w-4" />}

              {task.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : task.priority === "high" ? (
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />
              )}

              <div className="truncate">
                <div className={cn("text-sm truncate", task.isParent && "font-medium")}>{task.title}</div>
                <div className="text-xs text-gray-500 truncate">
                  {format(parseISO(task.startDate), "MMM d")} - {format(parseISO(task.endDate), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
