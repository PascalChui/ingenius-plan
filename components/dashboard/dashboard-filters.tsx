"use client"

import { useDashboard } from "@/contexts/dashboard-context"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tasks } from "@/data/tasks"

interface DashboardFiltersProps {
  className?: string
}

export function DashboardFilters({ className }: DashboardFiltersProps) {
  const { filters, setFilters } = useDashboard()

  // Extract unique values for filter options
  const projects = Array.from(new Set(tasks.map((task) => task.project))).filter(Boolean)
  const categories = Array.from(new Set(tasks.map((task) => task.category))).filter(Boolean)
  const assignees = Array.from(new Set(tasks.map((task) => task.assignedTo))).filter(Boolean)
  const priorities = Array.from(new Set(tasks.map((task) => task.priority))).filter(Boolean)

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project-filter">Project</Label>
            <Select value={filters.project} onValueChange={(value) => setFilters({ ...filters, project: value })}>
              <SelectTrigger id="project-filter">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee-filter">Assignee</Label>
            <Select value={filters.assignee} onValueChange={(value) => setFilters({ ...filters, assignee: value })}>
              <SelectTrigger id="assignee-filter">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority-filter">Priority</Label>
            <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
              <SelectTrigger id="priority-filter">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
