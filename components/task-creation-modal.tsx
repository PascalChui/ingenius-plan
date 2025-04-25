"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Paperclip, X, Copy, Users } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"
import { templates } from "@/data/templates"
import { TemplateSelector } from "@/components/template-selector"
import type { TaskTemplate } from "@/types/template"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTeam } from "@/contexts/team-context"
import { teams, users } from "@/data/teams"

interface TaskCreationModalProps {
  isOpen: boolean
  onClose: () => void
  initialTask?: Partial<Task>
  isEditing?: boolean
  templateId?: string
}

export function TaskCreationModal({
  isOpen,
  onClose,
  initialTask,
  isEditing = false,
  templateId,
}: TaskCreationModalProps) {
  // Use try/catch to handle the case when TeamProvider is not available
  let teamContext
  let currentUser = users[0] || null
  let currentTeam = null
  let teamMembers = []

  try {
    const context = useTeam()
    currentUser = context.currentUser
    currentTeam = context.currentTeam
    teamMembers = context.teamMembers
  } catch (error) {
    // If TeamProvider is not available, use default values
    console.warn("TeamProvider not available, using default values.")
  }

  const [title, setTitle] = useState(initialTask?.title || "")
  const [description, setDescription] = useState(initialTask?.description || "")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialTask?.dueDate ? new Date(initialTask.dueDate) : undefined,
  )
  const [priority, setPriority] = useState<string>(initialTask?.priority || "")
  const [category, setCategory] = useState<string>(initialTask?.category || "")
  const [project, setProject] = useState<string>(initialTask?.project || "")
  const [assignee, setAssignee] = useState<string>(initialTask?.assignee || "")
  const [teamId, setTeamId] = useState<string>(initialTask?.teamId || "")
  const [status, setStatus] = useState<string>(initialTask?.status || "not_started")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // If a template ID is provided, load the template data
      if (templateId && !isEditing) {
        const template = templates.find((t) => t.id === templateId)
        if (template) {
          applyTemplate(template)
        }
      }

      // Set default team if none is selected and current team exists
      if (!teamId && currentTeam) {
        setTeamId(currentTeam.id)
      }

      // Set default assignee to current user if none is selected
      if (!assignee && currentUser) {
        setAssignee(currentUser.id)
      }
    }
  }, [isOpen, templateId, isEditing, teamId, currentTeam, assignee, currentUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create new task object
    const newTask: Partial<Task> = {
      title,
      description,
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : "",
      priority: priority as any,
      category: category as any,
      project: project || null,
      assignee: assignee || null,
      teamId: teamId || undefined,
      status: status as any,
      completed: initialTask?.completed || false,
      creator: currentUser?.id || null,
    }

    console.log(newTask)

    // Here you would typically send the data to your backend

    // Reset form and close modal
    resetForm()
    onClose()
  }

  const resetForm = () => {
    if (!isEditing) {
      setTitle("")
      setDescription("")
      setDueDate(undefined)
      setPriority("")
      setCategory("")
      setProject("")
      setAssignee("")
      setStatus("not_started")
      setAttachments([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const applyTemplate = (template: TaskTemplate) => {
    setTitle(template.name)
    setDescription(template.description)
    setCategory(template.category || "")
    setPriority(template.priority || "")
    setProject(template.project || "")
    setIsTemplateSelectorOpen(false)
  }

  // Get available team members for assignment
  const availableAssignees = teamId && teamMembers.length > 0 ? teamMembers : users

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Task" : "Create New Task"}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {!isEditing && (
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => setIsTemplateSelectorOpen(true)}
            >
              <Copy className="h-4 w-4" />
              Use Template
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Task Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date <span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="project" className="text-sm font-medium">
              Project
            </label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                <SelectItem value="Database Migration">Database Migration</SelectItem>
                <SelectItem value="none_value">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="team" className="text-sm font-medium">
              Team
            </label>
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal_task">Personal Task</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {team.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="assignee" className="text-sm font-medium">
            Assignee
          </label>
          <Select value={assignee} onValueChange={setAssignee}>
            <SelectTrigger>
              <SelectValue placeholder="Assign to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned_value">Unassigned</SelectItem>
              {availableAssignees.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="attachments" className="text-sm font-medium">
            Attachments
          </label>
          <div className="flex items-center gap-2">
            <Input id="attachments" type="file" multiple className="hidden" onChange={handleFileChange} />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("attachments")?.click()}
              className="gap-1"
            >
              <Paperclip className="h-4 w-4" />
              Add Files
            </Button>
            <span className="text-sm text-gray-500">
              {attachments.length > 0 ? `${attachments.length} file(s) selected` : "No files selected"}
            </span>
          </div>
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">
            {isEditing ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>

      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        onSelectTemplate={applyTemplate}
      />
    </Modal>
  )
}
