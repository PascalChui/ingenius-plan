"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDownAZ, ArrowDownUp, ArrowUpAZ, ArrowUpDown, Calendar, CheckCircle, Clock } from "lucide-react"
import type { SortField, SortDirection, TaskSort } from "@/types/task"

interface SortDropdownProps {
  sort: TaskSort
  onSortChange: (sort: TaskSort) => void
}

export function SortDropdown({ sort, onSortChange }: SortDropdownProps) {
  const handleSortChange = (field: SortField) => {
    if (sort.field === field) {
      // Toggle direction if same field
      onSortChange({
        field,
        direction: sort.direction === "asc" ? "desc" : "asc",
      })
    } else {
      // Set new field with default direction
      const defaultDirection: Record<SortField, SortDirection> = {
        dueDate: "asc",
        priority: "desc",
        title: "asc",
        createdAt: "desc",
        status: "asc",
      }
      onSortChange({
        field,
        direction: defaultDirection[field],
      })
    }
  }

  const getSortIcon = () => {
    if (sort.field === "dueDate") {
      return sort.direction === "asc" ? <Calendar className="h-4 w-4" /> : <Calendar className="h-4 w-4" />
    } else if (sort.field === "priority") {
      return sort.direction === "asc" ? <ArrowUpDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />
    } else if (sort.field === "title") {
      return sort.direction === "asc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />
    } else if (sort.field === "createdAt") {
      return sort.direction === "asc" ? <Clock className="h-4 w-4" /> : <Clock className="h-4 w-4" />
    } else if (sort.field === "status") {
      return sort.direction === "asc" ? <CheckCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />
    }
    return <ArrowDownUp className="h-4 w-4" />
  }

  const getSortLabel = () => {
    const fieldLabels: Record<SortField, string> = {
      dueDate: "Due Date",
      priority: "Priority",
      title: "Title",
      createdAt: "Created Date",
      status: "Status",
    }

    const directionLabels: Record<SortDirection, string> = {
      asc: "Ascending",
      desc: "Descending",
    }

    return `${fieldLabels[sort.field]} (${directionLabels[sort.direction]})`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getSortIcon()}
          <span>Sort: {getSortLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSortChange("dueDate")} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Due Date
          </span>
          {sort.field === "dueDate" && (
            <span className="text-xs text-muted-foreground">
              {sort.direction === "asc" ? "Earliest first" : "Latest first"}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("priority")} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Priority
          </span>
          {sort.field === "priority" && (
            <span className="text-xs text-muted-foreground">
              {sort.direction === "asc" ? "Low to High" : "High to Low"}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("title")} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {sort.direction === "asc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
            Title
          </span>
          {sort.field === "title" && (
            <span className="text-xs text-muted-foreground">{sort.direction === "asc" ? "A to Z" : "Z to A"}</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("createdAt")} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Created Date
          </span>
          {sort.field === "createdAt" && (
            <span className="text-xs text-muted-foreground">
              {sort.direction === "asc" ? "Oldest first" : "Newest first"}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("status")} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Status
          </span>
          {sort.field === "status" && (
            <span className="text-xs text-muted-foreground">
              {sort.direction === "asc" ? "Incomplete first" : "Completed first"}
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
