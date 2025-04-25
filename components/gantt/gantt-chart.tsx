"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Task } from "@/types/task"
import {
  type GanttTask,
  type TimelineConfig,
  calculateGanttDimensions,
  getProjectDateRange,
  findCriticalPath,
} from "@/utils/gantt-utils"
import { GanttTimeline } from "./gantt-timeline"
import { GanttTaskList } from "./gantt-task-list"
import { GanttTaskBar } from "./gantt-task-bar"
import { GanttDependencyLines } from "./gantt-dependency-lines"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, Calendar, ArrowLeft, ArrowRight, Save, Undo } from "lucide-react"
import { addDays, parseISO, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface GanttChartProps {
  tasks: Task[]
  className?: string
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void
}

export function GanttChart({ tasks, className, onTaskUpdate }: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")
  const [zoom, setZoom] = useState(60) // Column width in pixels
  const [undoStack, setUndoStack] = useState<GanttTask[][]>([])
  const [hasChanges, setHasChanges] = useState(false)

  // Convert tasks to GanttTasks with start and end dates
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>(() =>
    tasks.map((task, index) => {
      // In a real app, you would use actual start dates from your task data
      // Here we're creating sample dates for demonstration
      const startDate = task.dueDate ? subDays(parseISO(task.dueDate), 7).toISOString() : new Date().toISOString()
      const endDate = task.dueDate || addDays(new Date(), (index % 5) + 1).toISOString()

      return {
        ...task,
        startDate,
        endDate,
        progress: task.completed ? 100 : Math.floor(Math.random() * 100),
        dependencies: index > 0 && index % 3 === 0 ? [tasks[index - 1].id] : undefined,
        milestone: index % 7 === 0,
        color: task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#f59e0b" : "#10b981",
        level: 0,
      }
    }),
  )

  // Calculate date range for the timeline
  const { startDate, endDate } = getProjectDateRange(ganttTasks)

  // Timeline configuration
  const timelineConfig: TimelineConfig = {
    startDate,
    endDate,
    viewMode,
    columnWidth: zoom,
    rowHeight: 50,
  }

  // Calculate dimensions for each task
  const tasksWithDimensions = calculateGanttDimensions(ganttTasks, timelineConfig)

  // Find critical path
  const criticalPath = findCriticalPath(tasksWithDimensions)

  // Handle scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft)
  }

  // Scroll to today
  const scrollToToday = () => {
    if (!containerRef.current) return

    const today = new Date()
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const position = daysDiff * timelineConfig.columnWidth

    containerRef.current.scrollLeft = position - containerRef.current.clientWidth / 2
  }

  // Scroll left/right by a week
  const scrollByWeek = (direction: "left" | "right") => {
    if (!containerRef.current) return

    const scrollAmount = 7 * timelineConfig.columnWidth
    containerRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount
  }

  // Set initial scroll position
  useEffect(() => {
    scrollToToday()
  }, [zoom, viewMode])

  // Handle task updates
  const handleTaskUpdate = (taskId: string, updates: Partial<GanttTask>) => {
    // Save current state for undo
    setUndoStack((prev) => [...prev, ganttTasks])

    setGanttTasks((prev) => {
      const newTasks = prev.map((task) => {
        if (task.id === taskId) {
          return { ...task, ...updates }
        }
        return task
      })

      setHasChanges(true)
      return newTasks
    })

    // Show toast notification
    toast.toast({
      title: "Task updated",
      description: `Task "${ganttTasks.find((t) => t.id === taskId)?.title}" has been rescheduled.`,
    })
  }

  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, you would save the changes to your backend
    if (onTaskUpdate) {
      ganttTasks.forEach((task) => {
        const originalTask = tasks.find((t) => t.id === task.id)
        if (originalTask) {
          // Only update if dates have changed
          if (originalTask.dueDate !== task.endDate) {
            onTaskUpdate(task.id, {
              dueDate: task.endDate,
              // You might want to add more fields here
            })
          }
        }
      })
    }

    setHasChanges(false)
    toast.toast({
      title: "Changes saved",
      description: "All task changes have been saved successfully.",
    })
  }

  // Handle undo
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1]
      setGanttTasks(previousState)
      setUndoStack((prev) => prev.slice(0, -1))

      if (undoStack.length === 1) {
        setHasChanges(false)
      }

      toast.toast({
        title: "Change undone",
        description: "The last task change has been undone.",
      })
    }
  }

  return (
    <div className={cn("flex flex-col h-full border rounded-md", className)}>
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => scrollToToday()}>
            <Calendar className="h-4 w-4 mr-1" />
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => scrollByWeek("left")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => scrollByWeek("right")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
            Day
          </Button>
          <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => setViewMode("week")}>
            Week
          </Button>
          <Button variant={viewMode === "month" ? "default" : "outline"} size="sm" onClick={() => setViewMode("month")}>
            Month
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ZoomOut className="h-4 w-4" />
          <Slider
            className="w-32"
            value={[zoom]}
            min={30}
            max={150}
            step={10}
            onValueChange={(value) => setZoom(value[0])}
          />
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center justify-between p-2 border-b bg-blue-50">
          <div className="text-sm text-blue-700">You have unsaved changes to task schedules.</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={undoStack.length === 0}>
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button variant="default" size="sm" onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Task names column */}
        <div className="w-64 flex-shrink-0 border-r bg-white z-10">
          <div className="h-10 border-b font-medium flex items-center px-4">Task</div>
          <GanttTaskList tasks={tasksWithDimensions} rowHeight={timelineConfig.rowHeight} />
        </div>

        {/* Timeline and task bars */}
        <div ref={containerRef} className="flex-1 overflow-x-auto" onScroll={handleScroll}>
          <GanttTimeline
            startDate={timelineConfig.startDate}
            endDate={timelineConfig.endDate}
            viewMode={timelineConfig.viewMode}
            columnWidth={timelineConfig.columnWidth}
          />

          <div className="relative">
            {tasksWithDimensions.map((task) => (
              <GanttTaskBar
                key={task.id}
                task={task}
                rowHeight={timelineConfig.rowHeight}
                isOnCriticalPath={criticalPath.includes(task.id)}
                columnWidth={timelineConfig.columnWidth}
                onTaskUpdate={handleTaskUpdate}
                viewMode={viewMode}
              />
            ))}

            <GanttDependencyLines tasks={tasksWithDimensions} rowHeight={timelineConfig.rowHeight} />
          </div>
        </div>
      </div>
    </div>
  )
}
