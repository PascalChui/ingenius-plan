"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, BarChart2, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Project } from "@/types/project"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const statusColors = {
    planning: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    "on-hold": "bg-yellow-100 text-yellow-800",
  }

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  }

  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "h-1.5",
          project.priority === "high" ? "bg-red-500" : project.priority === "medium" ? "bg-yellow-500" : "bg-green-500",
        )}
      />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-lg font-bold line-clamp-1">{project.title}</h2>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "text-xs px-2 py-1 rounded-full capitalize",
                statusColors[project.status as keyof typeof statusColors],
              )}
            >
              {project.status}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(project)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(project.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn("h-2 rounded-full", project.progress === 100 ? "bg-green-500" : "bg-blue-600")}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags?.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="text-xs text-gray-500 space-y-1 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Start: {format(new Date(project.startDate), "MMM d, yyyy")}</span>
          </div>
          {project.endDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>End: {format(new Date(project.endDate), "MMM d, yyyy")}</span>
            </div>
          )}
          {project.category && (
            <div className="flex items-center gap-1">
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Category: {project.category}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((memberId, index) => (
              <Avatar key={memberId} className="h-7 w-7 border-2 border-white">
                <AvatarFallback>{index + 1}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-xs border-2 border-white">
                +{project.members.length - 3}
              </div>
            )}
          </div>

          <Link href={`/projects/${project.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
