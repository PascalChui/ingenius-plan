"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { Label } from "@/components/ui/label"
import type { TaskTemplate, CreateTemplateInput } from "@/types/template"

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  initialTemplate?: TaskTemplate | null
  isEditing?: boolean
}

export function TemplateModal({ isOpen, onClose, initialTemplate, isEditing = false }: TemplateModalProps) {
  const [formData, setFormData] = useState<CreateTemplateInput>({
    name: "",
    description: "",
    category: null,
    priority: null,
    project: null,
    estimatedTime: undefined,
    tags: [],
  })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    if (initialTemplate) {
      setFormData({
        name: initialTemplate.name,
        description: initialTemplate.description,
        category: initialTemplate.category,
        priority: initialTemplate.priority,
        project: initialTemplate.project,
        estimatedTime: initialTemplate.estimatedTime,
        tags: initialTemplate.tags || [],
      })
    } else {
      setFormData({
        name: "",
        description: "",
        category: null,
        priority: null,
        project: null,
        estimatedTime: undefined,
        tags: [],
      })
    }
    setTagInput("")
  }, [initialTemplate, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would save the template to your backend
    console.log("Saving template:", formData)

    // Close the modal
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Template" : "Create Template"}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Template Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter template name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter template description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) => handleSelectChange("category", value || null)}
            >
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
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority || ""}
              onValueChange={(value) => handleSelectChange("priority", value || null)}
            >
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
            <Label htmlFor="project">Project</Label>
            <Select
              value={formData.project || ""}
              onValueChange={(value) => handleSelectChange("project", value === "none" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                <SelectItem value="Database Migration">Database Migration</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
            <Input
              id="estimatedTime"
              name="estimatedTime"
              type="number"
              placeholder="Enter estimated time"
              value={formData.estimatedTime || ""}
              onChange={(e) => {
                const value = e.target.value ? Number.parseInt(e.target.value) : undefined
                setFormData((prev) => ({ ...prev, estimatedTime: value }))
              }}
              min="1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <div key={tag} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
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
            {isEditing ? "Update Template" : "Create Template"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
