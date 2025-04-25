"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { templates } from "@/data/templates"
import { cn } from "@/lib/utils"
import type { TaskTemplate } from "@/types/template"

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: TaskTemplate) => void
}

export function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter templates based on search term
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Template">
      <div className="mt-4">
        <div className="relative w-full mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search templates..."
            className="pl-10 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No templates found</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-medium">{template.name}</h3>
                  <div
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      template.category === "work"
                        ? "bg-blue-100 text-blue-800"
                        : template.category === "personal"
                          ? "bg-purple-100 text-purple-800"
                          : template.category === "meeting"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800",
                    )}
                  >
                    {template.category
                      ? template.category.charAt(0).toUpperCase() + template.category.slice(1)
                      : "Other"}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{template.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {template.priority && (
                    <div
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        template.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : template.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800",
                      )}
                    >
                      {template.priority.charAt(0).toUpperCase() + template.priority.slice(1)}
                    </div>
                  )}
                  {template.project && <div className="text-xs text-gray-500">• {template.project}</div>}
                  {template.tags && template.tags.length > 0 && (
                    <div className="text-xs text-gray-500">
                      • {template.tags.slice(0, 2).join(", ")}
                      {template.tags.length > 2 && ` +${template.tags.length - 2} more`}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
