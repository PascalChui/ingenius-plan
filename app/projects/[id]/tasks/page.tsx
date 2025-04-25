"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Search, X } from "lucide-react"
import { TaskCreationModal } from "@/components/task-creation-modal"
import { TaskList } from "@/components/task-list"
import { tasks } from "@/data/tasks"
import { filterTasks } from "@/utils/filter-tasks"
import { sortTasks } from "@/utils/sort-tasks"
import type { Task, TaskFilter, TaskSort } from "@/types/task"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { SortDropdown } from "@/components/sort-dropdown"

export default function ProjectTasksPage({ params }: { params: { id: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Get project name from ID (in a real app, you'd fetch this from an API)
  const projectName =
    params.id === "website-redesign"
      ? "Website Redesign"
      : params.id === "mobile-app"
        ? "Mobile App Development"
        : params.id === "marketing"
          ? "Marketing Campaign"
          : params.id === "database"
            ? "Database Migration"
            : "Unknown Project"

  const [filter, setFilter] = useState<TaskFilter>({
    category: null,
    timeframe: null,
    priority: null,
    status: null,
    project: projectName,
    search: "",
  })

  const [sort, setSort] = useState<TaskSort>({
    field: "dueDate",
    direction: "asc",
  })

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, filter)
  }, [filter, projectName])

  // Apply sorting to filtered tasks
  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks, sort.field, sort.direction)
  }, [filteredTasks, sort])

  // Group tasks by status
  const groupedTasks = useMemo(() => {
    return {
      notStarted: sortedTasks.filter((task) => !task.completed),
      completed: sortedTasks.filter((task) => task.completed),
    }
  }, [sortedTasks])

  // Handle task editing
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  return (
    <Layout>
      <div className="container px-4 py-6">
        <div className="mb-6">
          <Link href="/projects" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{projectName}: Tasks</h1>
            <div className="flex gap-2">
              <SortDropdown sort={sort} onSortChange={setSort} />
              <Button className="gap-1 bg-black text-white hover:bg-gray-800" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 pr-10"
                value={filter.search}
                onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
              />
              {filter.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                  onClick={() => setFilter((prev) => ({ ...prev, search: "" }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <h2 className="text-sm font-medium mb-2">Priority</h2>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={filter.priority === null}
                  onClick={() => setFilter((prev) => ({ ...prev, priority: null }))}
                >
                  All
                </FilterButton>
                <FilterButton
                  active={filter.priority === "high"}
                  onClick={() => setFilter((prev) => ({ ...prev, priority: prev.priority === "high" ? null : "high" }))}
                >
                  High
                </FilterButton>
                <FilterButton
                  active={filter.priority === "medium"}
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, priority: prev.priority === "medium" ? null : "medium" }))
                  }
                >
                  Medium
                </FilterButton>
                <FilterButton
                  active={filter.priority === "low"}
                  onClick={() => setFilter((prev) => ({ ...prev, priority: prev.priority === "low" ? null : "low" }))}
                >
                  Low
                </FilterButton>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Status</h2>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={filter.status === null}
                  onClick={() => setFilter((prev) => ({ ...prev, status: null }))}
                >
                  All
                </FilterButton>
                <FilterButton
                  active={filter.status === "completed"}
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, status: prev.status === "completed" ? null : "completed" }))
                  }
                >
                  Completed
                </FilterButton>
                <FilterButton
                  active={filter.status === "incomplete"}
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, status: prev.status === "incomplete" ? null : "incomplete" }))
                  }
                >
                  Not Started
                </FilterButton>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {groupedTasks.notStarted.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Not Started ({groupedTasks.notStarted.length})</h2>
              <TaskList tasks={groupedTasks.notStarted} onEdit={handleEditTask} />
            </div>
          )}

          {groupedTasks.completed.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Completed ({groupedTasks.completed.length})</h2>
              <TaskList tasks={groupedTasks.completed} onEdit={handleEditTask} />
            </div>
          )}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500 mb-2">No tasks match your filters</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filters or create a new task</p>
              <Button onClick={() => setFilter({ ...filter, priority: null, status: null, search: "" })}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        <TaskCreationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          initialTask={
            {
              ...editingTask,
              project: projectName,
            } as any
          }
          isEditing={!!editingTask}
        />
      </div>
    </Layout>
  )
}

// Filter button component
function FilterButton({
  children,
  active,
  onClick,
  className,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn(active && !className && "bg-black text-white hover:bg-gray-800", className)}
    >
      {children}
    </Button>
  )
}
