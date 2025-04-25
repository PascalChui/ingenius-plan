"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import type { Task } from "@/types/task"
import { cn } from "@/lib/utils"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete?: (taskId: string) => void
  onEdit?: (task: Task) => void
}

export function TaskList({ tasks, onToggleComplete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded-full border-2"
                checked={task.completed}
                onChange={() => onToggleComplete?.(task.id)}
              />
              <div className="flex-1">
                <h3 className={cn("font-medium", task.completed && "line-through text-gray-500")}>{task.title}</h3>
                <p className={cn("text-sm text-gray-500", task.completed && "line-through")}>{task.description}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {new Date(task.dueDate) < new Date() && !task.completed && (
                    <span className="text-xs text-red-500 font-medium">Overdue!</span>
                  )}
                  <span className="text-xs text-gray-500">
                    Due:{" "}
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {task.project && <span className="text-xs text-gray-500">• {task.project}</span>}
                  {task.priority && (
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        task.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800",
                      )}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  )}
                  {task.category && (
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        task.category === "work"
                          ? "bg-blue-100 text-blue-800"
                          : task.category === "personal"
                            ? "bg-purple-100 text-purple-800"
                            : task.category === "meeting"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Assign
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(task)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
