"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Users, Tag, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTeam } from "@/contexts/team-context"
import { teams, users } from "@/data/teams"
import type { Project } from "@/types/project"

interface ProjectCreationModalProps {
  isOpen: boolean
  onClose: () => void
  initialProject?: Partial<Project>
  isEditing?: boolean
}

export function ProjectCreationModal({
  isOpen,
  onClose,
  initialProject,
  isEditing = false,
}: ProjectCreationModalProps) {
  // Initialize state with default values
  const [title, setTitle] = useState(initialProject?.title || "")
  const [description, setDescription] = useState(initialProject?.description || "")
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialProject?.startDate ? new Date(initialProject.startDate) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialProject?.endDate ? new Date(initialProject.endDate) : undefined,
  )
  const [status, setStatus] = useState<string>(initialProject?.status || "planning")
  const [priority, setPriority] = useState<string>(initialProject?.priority || "medium")
  const [category, setCategory] = useState<string>(initialProject?.category || "")
  const [teamId, setTeamId] = useState<string>(initialProject?.teamId || "")
  const [selectedMembers, setSelectedMembers] = useState<string[]>(initialProject?.members || [])
  const [tags, setTags] = useState<string[]>(initialProject?.tags || [])
  const [newTag, setNewTag] = useState("")

  // Fetch team context outside of the try/catch block to avoid conditional hook call
  let teamContext
  try {
    teamContext = useTeam()
  } catch (error) {
    teamContext = null
    console.warn("TeamProvider not available, using default values.")
  }

  // Use values from context or default values
  const currentUser = teamContext?.currentUser || users[0] || null
  const currentTeam = teamContext?.currentTeam || null
  const teamMembers = teamContext?.teamMembers || []

  useEffect(() => {
    if (isOpen) {
      // Set default team if none is selected and current team exists
      if (!teamId && currentTeam) {
        setTeamId(currentTeam.id)
      }

      // Add current user to members if not already included
      if (currentUser && !selectedMembers.includes(currentUser.id)) {
        setSelectedMembers([...selectedMembers, currentUser.id])
      }
    }
  }, [isOpen, teamId, currentTeam, selectedMembers, currentUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create new project object
    const newProject: Partial<Project> = {
      title,
      description,
      status: status as any,
      progress: initialProject?.progress || 0,
      startDate: startDate ? startDate.toISOString().split("T")[0] : "",
      endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
      teamId: teamId || undefined,
      ownerId: currentUser?.id || "",
      members: selectedMembers,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      category,
      priority: priority as any,
      tags,
    }

    console.log(newProject)

    // Here you would typically send the data to your backend

    // Reset form and close modal
    resetForm()
    onClose()
  }

  const resetForm = () => {
    if (!isEditing) {
      setTitle("")
      setDescription("")
      setStartDate(undefined)
      setEndDate(undefined)
      setStatus("planning")
      setPriority("medium")
      setCategory("")
      setTeamId("")
      setSelectedMembers([])
      setTags([])
      setNewTag("")
    }
  }

  const toggleMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId))
    } else {
      setSelectedMembers([...selectedMembers, userId])
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  // Get available team members for assignment
  const availableMembers = teamId
    ? users.filter((user) =>
        teams.find((team) => team.id === teamId)?.members.some((member) => member.userId === user.id),
      )
    : users

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Project" : "Create New Project"}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Project Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            placeholder="Enter project title"
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
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date <span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="team" className="text-sm font-medium">
              Team
            </label>
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal_project">Personal Project</SelectItem>
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
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Project Members</label>
          <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
            {availableMembers.length === 0 ? (
              <p className="text-sm text-gray-500">No team members available</p>
            ) : (
              <div className="space-y-2">
                {availableMembers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`member-${user.id}`}
                      checked={selectedMembers.includes(user.id)}
                      onChange={() => toggleMember(user.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`member-${user.id}`} className="flex items-center gap-2 text-sm">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      {user.id === currentUser?.id && <span className="text-xs text-gray-500">(You)</span>}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTag()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              <Tag className="h-4 w-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-3 w-3" />
                  </button>
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
            {isEditing ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
