"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileText, Search, Filter, SortAsc } from "lucide-react"
import { TeamProvider } from "@/contexts/team-context"
import { ProjectCreationModal } from "@/components/project-creation-modal"
import { ProjectCard } from "@/components/project-card"
import { Input } from "@/components/ui/input"
import { projects, getProjectsByStatus } from "@/data/projects"
import type { Project } from "@/types/project"

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    let result = activeTab === "all" ? projects : getProjectsByStatus(activeTab)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.category?.toLowerCase().includes(query) ||
          project.tags?.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredProjects(result)
  }, [activeTab, searchQuery])

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDeleteProject = (projectId: string) => {
    // In a real app, you would call an API to delete the project
    console.log(`Deleting project ${projectId}`)
    // Then update the UI
    setFilteredProjects(filteredProjects.filter((p) => p.id !== projectId))
    setConfirmDeleteId(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  return (
    <Layout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <FileText className="h-4 w-4" />
              New Template
            </Button>
            <Button className="gap-1 bg-black text-white hover:bg-gray-800" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="on-hold">On Hold</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search projects..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SortAsc className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No projects found</p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-1 bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={(id) => setConfirmDeleteId(id)}
              />
            ))}
          </div>
        )}

        <TeamProvider>
          <ProjectCreationModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            initialProject={editingProject || undefined}
            isEditing={!!editingProject}
          />
        </TeamProvider>

        {/* Delete Confirmation Modal would go here */}
      </div>
    </Layout>
  )
}
