"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Copy, Edit, Plus, Search, Tag, Trash, X } from "lucide-react"
import { templates } from "@/data/templates"
import { cn } from "@/lib/utils"
import { TemplateModal } from "@/components/template-modal"
import type { TaskTemplate } from "@/types/template"
import { useRouter } from "next/navigation"

export default function TemplatesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null)

  // Filter templates based on search term and active tab
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return matchesSearch && template.category === activeTab
  })

  const handleEditTemplate = (template: TaskTemplate) => {
    setEditingTemplate(template)
    setIsModalOpen(true)
  }

  const handleCreateFromTemplate = (template: TaskTemplate) => {
    // In a real app, you would navigate to the task creation page with the template data
    router.push(`/tasks/new?template=${template.id}`)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTemplate(null)
  }

  return (
    <Layout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Task Templates</h1>
          <Button className="gap-1 bg-black text-white hover:bg-gray-800" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative w-full max-w-md mb-4">
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

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="meeting">Meeting</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500 mb-2">No templates found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or create a new template</p>
            <Button onClick={() => setIsModalOpen(true)}>Create Template</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={() => handleEditTemplate(template)}
                onUse={() => handleCreateFromTemplate(template)}
              />
            ))}
          </div>
        )}

        <TemplateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialTemplate={editingTemplate}
          isEditing={!!editingTemplate}
        />
      </div>
    </Layout>
  )
}

interface TemplateCardProps {
  template: TaskTemplate
  onEdit: () => void
  onUse: () => void
}

function TemplateCard({ template, onEdit, onUse }: TemplateCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-bold">{template.name}</h2>
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
            {template.category ? template.category.charAt(0).toUpperCase() + template.category.slice(1) : "Other"}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>

        <div className="flex items-center gap-2 mb-4">
          {template.estimatedTime && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {template.estimatedTime} min
            </div>
          )}
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
        </div>

        {template.tags && template.tags.length > 0 && (
          <div className="flex items-center gap-1 mb-4 flex-wrap">
            <Tag className="h-3 w-3 text-gray-400" />
            {template.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div>Used {template.usageCount} times</div>
          <div>Updated {new Date(template.updatedAt).toLocaleDateString()}</div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" size="sm" className="gap-1" onClick={onUse}>
            <Copy className="h-4 w-4" />
            Use Template
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
