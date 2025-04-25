"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Plus, Search, X } from "lucide-react"
import { TaskCreationModal } from "@/components/task-creation-modal"
import { TaskList } from "@/components/task-list"
import { tasks } from "@/data/tasks"
import { filterTasks, groupTasksByDate } from "@/utils/filter-tasks"
import { sortTasks } from "@/utils/sort-tasks"
import type { Task, TaskFilter, TaskSort } from "@/types/task"
import { cn } from "@/lib/utils"
import { SortDropdown } from "@/components/sort-dropdown"

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<TaskFilter>({
    category: null,
    timeframe: null,
    priority: null,
    status: null,
    project: null,
    search: "",
  })
  const [sort, setSort] = useState<TaskSort>({
    field: "dueDate",
    direction: "asc",
  })

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, filter)
  }, [filter])

  // Apply sorting to filtered tasks
  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks, sort.field, sort.direction)
  }, [filteredTasks, sort])

  // Group tasks by date
  const groupedTasks = useMemo(() => {
    return groupTasksByDate(sortedTasks)
  }, [sortedTasks])

  // Update a single filter
  const updateFilter = (key: keyof TaskFilter, value: string | null) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value === prev[key] ? null : value,
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilter({
      category: null,
      timeframe: null,
      priority: null,
      status: null,
      project: null,
      search: "",
    })
  }

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Tasks</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <Mic className="h-4 w-4" />
              Voice
            </Button>
            <Button className="gap-1 bg-black text-white hover:bg-gray-800" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              New Task
            </Button>
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
            <div className="flex items-center gap-2">
              <SortDropdown sort={sort} onSortChange={setSort} />
              {(filter.category ||
                filter.timeframe ||
                filter.priority ||
                filter.status ||
                filter.project ||
                filter.search) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <h2 className="text-sm font-medium mb-2">Category</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterButton
              active={filter.category === "all"}
              onClick={() => updateFilter("category", "all")}
              className="bg-black text-white hover:bg-gray-800"
            >
              All Categories
            </FilterButton>
            <FilterButton active={filter.category === "work"} onClick={() => updateFilter("category", "work")}>
              Work
            </FilterButton>
            <FilterButton active={filter.category === "personal"} onClick={() => updateFilter("category", "personal")}>
              Personal
            </FilterButton>
            <FilterButton active={filter.category === "meeting"} onClick={() => updateFilter("category", "meeting")}>
              Meeting
            </FilterButton>
            <FilterButton active={filter.category === "other"} onClick={() => updateFilter("category", "other")}>
              Other
            </FilterButton>
          </div>

          <h2 className="text-sm font-medium mb-2">Timeframe</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterButton active={filter.timeframe === "all"} onClick={() => updateFilter("timeframe", "all")}>
              All
            </FilterButton>
            <FilterButton active={filter.timeframe === "today"} onClick={() => updateFilter("timeframe", "today")}>
              Today
            </FilterButton>
            <FilterButton
              active={filter.timeframe === "tomorrow"}
              onClick={() => updateFilter("timeframe", "tomorrow")}
            >
              Tomorrow
            </FilterButton>
            <FilterButton
              active={filter.timeframe === "this-week"}
              onClick={() => updateFilter("timeframe", "this-week")}
            >
              This Week
            </FilterButton>
            <FilterButton
              active={filter.timeframe === "overdue"}
              onClick={() => updateFilter("timeframe", "overdue")}
              className="bg-black text-white hover:bg-gray-800"
            >
              Overdue
            </FilterButton>
          </div>

          <h2 className="text-sm font-medium mb-2">Priority</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterButton active={filter.priority === "all"} onClick={() => updateFilter("priority", "all")}>
              All Priorities
            </FilterButton>
            <FilterButton active={filter.priority === "high"} onClick={() => updateFilter("priority", "high")}>
              High
            </FilterButton>
            <FilterButton active={filter.priority === "medium"} onClick={() => updateFilter("priority", "medium")}>
              Medium
            </FilterButton>
            <FilterButton active={filter.priority === "low"} onClick={() => updateFilter("priority", "low")}>
              Low
            </FilterButton>
          </div>

          <h2 className="text-sm font-medium mb-2">Status</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterButton active={filter.status === "all"} onClick={() => updateFilter("status", "all")}>
              All Tasks
            </FilterButton>
            <FilterButton active={filter.status === "completed"} onClick={() => updateFilter("status", "completed")}>
              Completed
            </FilterButton>
            <FilterButton active={filter.status === "incomplete"} onClick={() => updateFilter("status", "incomplete")}>
              Incomplete
            </FilterButton>
          </div>

          <h2 className="text-sm font-medium mb-2">Project</h2>
          <div className="flex flex-wrap gap-2">
            <FilterButton active={filter.project === "all"} onClick={() => updateFilter("project", "all")}>
              All Projects
            </FilterButton>
            <FilterButton
              active={filter.project === "Website Redesign"}
              onClick={() => updateFilter("project", "Website Redesign")}
            >
              Website Redesign
            </FilterButton>
            <FilterButton
              active={filter.project === "Mobile App Development"}
              onClick={() => updateFilter("project", "Mobile App Development")}
            >
              Mobile App
            </FilterButton>
            <FilterButton
              active={filter.project === "Marketing Campaign"}
              onClick={() => updateFilter("project", "Marketing Campaign")}
            >
              Marketing
            </FilterButton>
            <FilterButton
              active={filter.project === "Database Migration"}
              onClick={() => updateFilter("project", "Database Migration")}
            >
              Database
            </FilterButton>
            <FilterButton active={filter.project === "none"} onClick={() => updateFilter("project", "none")}>
              No Project
            </FilterButton>
          </div>
        </div>

        <div className="space-y-8">
          {/* Render task groups */}
          {groupedTasks.overdue.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Overdue</h2>
              <TaskList tasks={groupedTasks.overdue} onEdit={handleEditTask} />
            </div>
          )}

          {groupedTasks.today.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Today</h2>
              <TaskList tasks={groupedTasks.today} onEdit={handleEditTask} />
            </div>
          )}

          {groupedTasks.tomorrow.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Tomorrow</h2>
              <TaskList tasks={groupedTasks.tomorrow} onEdit={handleEditTask} />
            </div>
          )}

          {groupedTasks.upcoming.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Upcoming</h2>
              <TaskList tasks={groupedTasks.upcoming} onEdit={handleEditTask} />
            </div>
          )}

          {groupedTasks.completed.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Completed</h2>
              <TaskList tasks={groupedTasks.completed} onEdit={handleEditTask} />
            </div>
          )}

          {/* Show message when no tasks match filters */}
          {Object.values(groupedTasks).every((group) => group.length === 0) && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500 mb-2">No tasks match your filters</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filters or create a new task</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>

        <TaskCreationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          initialTask={editingTask || undefined}
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
