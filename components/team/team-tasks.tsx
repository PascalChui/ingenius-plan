"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTeam } from "@/contexts/team-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskCreationModal } from "@/components/task-creation-modal"
import { cn } from "@/lib/utils"

export function TeamTasks() {
  const { currentTeam, teamTasks } = useTeam()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!currentTeam) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 mb-2">No team selected</h3>
        <p className="text-gray-400 mb-4">Please select a team to view tasks</p>
      </div>
    )
  }

  // Filter tasks
  const filteredTasks = teamTasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "active" && !task.completed) ||
      (statusFilter === "overdue" && !task.completed && new Date(task.dueDate) < new Date())

    // Priority filter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2, null: 3 }
        return (priorityOrder[a.priority || "null"] || 3) - (priorityOrder[b.priority || "null"] || 3)
      case "title":
        return a.title.localeCompare(b.title)
      case "status":
        return Number(a.completed) - Number(b.completed)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Team Tasks ({teamTasks.length})</h2>
        <Button className="gap-1 bg-black text-white hover:bg-gray-800" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px] h-9">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all" className="flex-1 md:flex-none">
            All
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1 md:flex-none">
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 md:flex-none">
            Completed
          </TabsTrigger>
          <TabsTrigger value="overdue" className="flex-1 md:flex-none">
            Overdue
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No tasks found</div>
        ) : (
          sortedTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded-full border-2 mt-1"
                    checked={task.completed}
                    readOnly
                  />
                  <div className="flex-1 min-w-0">
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
                        })}
                      </span>
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
                      {task.status && task.status !== "completed" && (
                        <span
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full",
                            task.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : task.status === "in_review"
                                ? "bg-purple-100 text-purple-800"
                                : task.status === "blocked"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800",
                          )}
                        >
                          {task.status
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </span>
                      )}
                    </div>
                  </div>
                  {task.assignee && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.assigneeAvatar || "/placeholder.svg"} alt={task.assigneeName} />
                      <AvatarFallback>{task.assigneeName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <TaskCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTask={{ teamId: currentTeam.id } as any}
      />
    </div>
  )
}
