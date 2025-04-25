import type { GanttTask } from "@/utils/gantt-utils"
import { getDependencyPath } from "@/utils/gantt-utils"
import type { JSX } from "react"

interface GanttDependencyLinesProps {
  tasks: GanttTask[]
  rowHeight: number
}

export function GanttDependencyLines({ tasks, rowHeight }: GanttDependencyLinesProps) {
  // Create a map of task IDs to tasks for quick lookup
  const taskMap = new Map<string, GanttTask>()
  tasks.forEach((task) => {
    taskMap.set(task.id, task)
  })

  // Generate dependency lines
  const dependencyLines: JSX.Element[] = []

  tasks.forEach((task) => {
    if (task.dependencies?.length) {
      task.dependencies.forEach((depId) => {
        const dependencyTask = taskMap.get(depId)
        if (dependencyTask && dependencyTask.visible !== false) {
          const path = getDependencyPath(dependencyTask, task, rowHeight)
          dependencyLines.push(
            <path
              key={`${dependencyTask.id}-${task.id}`}
              d={path}
              stroke="#9ca3af"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />,
          )
        }
      })
    }
  })

  // Add parent-child connecting lines
  tasks.forEach((task) => {
    if (task.parent && task.visible !== false) {
      const parentTask = taskMap.get(task.parent)
      if (parentTask && parentTask.visible !== false) {
        // Create a vertical line connecting parent to child
        const parentLevel = parentTask.level || 0
        const childLevel = task.level || 0

        // Only draw lines for direct children
        if (childLevel === parentLevel + 1) {
          const x = 10 + parentLevel * 16 // Adjust based on indentation
          const y1 = parentLevel * rowHeight + rowHeight / 2
          const y2 = childLevel * rowHeight + rowHeight / 2

          dependencyLines.push(
            <line
              key={`parent-${parentTask.id}-${task.id}`}
              x1={x}
              y1={y1}
              x2={x}
              y2={y2}
              stroke="#d1d5db"
              strokeWidth="1"
            />,
          )
        }
      }
    }
  })

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="#9ca3af" />
        </marker>
      </defs>
      {dependencyLines}
    </svg>
  )
}
