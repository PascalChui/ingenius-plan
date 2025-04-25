"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { GanttTask } from "@/utils/gantt-utils"
import { cn } from "@/lib/utils"
import { format, parseISO, addDays } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Diamond, GripHorizontal } from "lucide-react"

interface GanttTaskBarProps {
  task: GanttTask
  rowHeight: number
  isOnCriticalPath: boolean
  columnWidth: number
  onTaskUpdate: (taskId: string, updates: Partial<GanttTask>) => void
  viewMode: "day" | "week" | "month"
}

export function GanttTaskBar({
  task,
  rowHeight,
  isOnCriticalPath,
  columnWidth,
  onTaskUpdate,
  viewMode,
}: GanttTaskBarProps) {
  const { left, width, progress, milestone } = task
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, left: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, width: 0 })
  const [position, setPosition] = useState({ left, width })
  const taskRef = useRef<HTMLDivElement>(null)

  // Update position when task changes
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setPosition({ left, width })
    }
  }, [left, width, isDragging, isResizing])

  // Handle mouse down for dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (milestone) return
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX, left: position.left })

    // Add event listeners to window
    window.addEventListener("mousemove", handleDragMove)
    window.addEventListener("mouseup", handleDragEnd)
  }

  // Handle mouse move during drag
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const newLeft = Math.max(0, dragStart.left + deltaX)

    setPosition((prev) => ({ ...prev, left: newLeft }))
  }

  // Handle mouse up to end dragging
  const handleDragEnd = () => {
    if (!isDragging) return

    setIsDragging(false)

    // Calculate new dates based on position
    const daysDelta = Math.round((position.left - left) / columnWidth)

    if (daysDelta !== 0) {
      // Calculate new dates
      const startDate = parseISO(task.startDate)
      const endDate = parseISO(task.endDate)

      let daysToAdd = daysDelta
      if (viewMode === "week") {
        daysToAdd = daysDelta * 7
      } else if (viewMode === "month") {
        // Approximate - in a real app you'd use a more precise calculation
        daysToAdd = daysDelta * 30
      }

      const newStartDate = addDays(startDate, daysToAdd)
      const newEndDate = addDays(endDate, daysToAdd)

      // Update the task
      onTaskUpdate(task.id, {
        startDate: newStartDate.toISOString(),
        endDate: newEndDate.toISOString(),
      })
    }

    // Remove event listeners
    window.removeEventListener("mousemove", handleDragMove)
    window.removeEventListener("mouseup", handleDragEnd)
  }

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, direction: "left" | "right") => {
    if (milestone) return
    e.preventDefault()
    e.stopPropagation() // Prevent triggering drag

    setIsResizing(true)
    setResizeStart({ x: e.clientX, width: position.width })

    // Add event listeners to window
    window.addEventListener("mousemove", (e) => handleResizeMove(e, direction))
    window.addEventListener("mouseup", () => handleResizeEnd(direction))
  }

  // Handle mouse move during resize
  const handleResizeMove = (e: MouseEvent, direction: "left" | "right") => {
    if (!isResizing) return

    if (direction === "right") {
      const deltaX = e.clientX - resizeStart.x
      const newWidth = Math.max(columnWidth, resizeStart.width + deltaX)
      setPosition((prev) => ({ ...prev, width: newWidth }))
    } else {
      const deltaX = e.clientX - resizeStart.x
      const newLeft = Math.max(0, position.left + deltaX)
      const newWidth = Math.max(columnWidth, position.width - (newLeft - position.left))

      setPosition({ left: newLeft, width: newWidth })
    }
  }

  // Handle resize end
  const handleResizeEnd = (direction: "left" | "right") => {
    if (!isResizing) return

    setIsResizing(false)

    // Calculate new dates based on position
    if (direction === "right") {
      const daysDelta = Math.round((position.width - width) / columnWidth)

      if (daysDelta !== 0) {
        // Calculate new end date
        const endDate = parseISO(task.endDate)

        let daysToAdd = daysDelta
        if (viewMode === "week") {
          daysToAdd = daysDelta * 7
        } else if (viewMode === "month") {
          daysToAdd = daysDelta * 30
        }

        const newEndDate = addDays(endDate, daysToAdd)

        // Update the task
        onTaskUpdate(task.id, {
          endDate: newEndDate.toISOString(),
        })
      }
    } else {
      const daysDelta = Math.round((position.left - left) / columnWidth)

      if (daysDelta !== 0) {
        // Calculate new start date
        const startDate = parseISO(task.startDate)

        let daysToAdd = daysDelta
        if (viewMode === "week") {
          daysToAdd = daysDelta * 7
        } else if (viewMode === "month") {
          daysToAdd = daysDelta * 30
        }

        const newStartDate = addDays(startDate, daysToAdd)

        // Update the task
        onTaskUpdate(task.id, {
          startDate: newStartDate.toISOString(),
        })
      }
    }

    // Remove event listeners
    window.removeEventListener("mousemove", (e) => handleResizeMove(e, direction))
    window.removeEventListener("mouseup", () => handleResizeEnd(direction))
  }

  if (milestone) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                left: left + width / 2 - 8,
                top: (task.level || 0) * rowHeight + rowHeight / 2 - 8,
                zIndex: 10,
              }}
            >
              <Diamond className={cn("h-4 w-4 fill-current", isOnCriticalPath ? "text-red-500" : "text-blue-500")} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm font-medium">{task.title} (Milestone)</div>
            <div className="text-xs">{format(parseISO(task.endDate), "MMM d, yyyy")}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={taskRef}
            className={cn(
              "absolute rounded-sm cursor-grab border group",
              isDragging ? "cursor-grabbing opacity-70 z-20" : "",
              isResizing ? "cursor-ew-resize opacity-70 z-20" : "",
              isOnCriticalPath ? "border-red-500" : "border-gray-300",
            )}
            style={{
              left: position.left,
              top: (task.level || 0) * rowHeight + rowHeight / 4,
              width: position.width,
              height: rowHeight / 2,
              backgroundColor: task.color || "#3b82f6",
              zIndex: isDragging || isResizing ? 20 : isOnCriticalPath ? 5 : 1,
              transition: isDragging || isResizing ? "none" : "all 0.2s ease",
            }}
            onMouseDown={handleDragStart}
          >
            {/* Progress bar */}
            <div
              className="h-full opacity-70"
              style={{
                width: `${progress}%`,
                backgroundColor: isOnCriticalPath ? "#ef4444" : "#1e40af",
              }}
            />

            {/* Task title (only show if there's enough space) */}
            {position.width > 50 && (
              <div className="absolute inset-0 flex items-center px-2 text-xs text-white truncate">
                <GripHorizontal className="h-3 w-3 mr-1 opacity-70" />
                {task.title}
              </div>
            )}

            {/* Resize handles */}
            <div
              className="absolute left-0 top-0 w-2 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 hover:opacity-100"
              onMouseDown={(e) => handleResizeStart(e, "left")}
            />
            <div
              className="absolute right-0 top-0 w-2 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 hover:opacity-100"
              onMouseDown={(e) => handleResizeStart(e, "right")}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm font-medium">{task.title}</div>
          <div className="text-xs">
            {format(parseISO(task.startDate), "MMM d, yyyy")} - {format(parseISO(task.endDate), "MMM d, yyyy")}
          </div>
          <div className="text-xs">Duration: {task.duration} days</div>
          <div className="text-xs">Progress: {progress}%</div>
          {task.priority && <div className="text-xs">Priority: {task.priority}</div>}
          {isOnCriticalPath && <div className="text-xs font-semibold text-red-500">On Critical Path</div>}
          <div className="text-xs italic mt-1">Drag to reschedule • Resize edges to adjust duration</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
