"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  BarChart2,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Download,
  Edit,
  Trash2,
  Users,
  Tag,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { getProjectWithDetails, getProjectTasks } from "@/data/projects"
import { TaskList } from "@/components/task-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ProjectCreationModal } from "@/components/project-creation-modal"
import { TeamProvider } from "@/contexts/team-context"
import { GanttChart } from "@/components/gantt/gantt-chart"
import { toast } from "@/hooks/use-toast"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [activeTab, setActiveTab] = useState("overview")
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (projectId) {
      // In a real app, you would fetch this data from an API
      const projectData = getProjectWithDetails(projectId)
      const projectTasks = getProjectTasks(projectId)

      setProject(projectData)
      setTasks(projectTasks)
      setIsLoading(false)
    }
  }, [projectId])

  // Rest of the component remains the same...

  // Only updating the relevant part with the task update handler
  const handleTaskUpdate = (taskId: string, updates: Partial<any>) => {
    // Update the local tasks state
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))

    // Show a toast notification
    toast.toast({
      title: "Task updated",
      description: `Task schedule has been updated.`,
    })
  }

  // The rest of the component remains the same...

  if (isLoading) {
    return (
      <Layout>
        <div className="container px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-6"></div>
            <div className="h-10 w-full bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="container px-4 py-6">
          <Link href="/projects" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-gray-500 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Link href="/projects">
              <Button>View All Projects</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const statusColors = {
    planning: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    "on-hold": "bg-yellow-100 text-yellow-800",
  }

  return (
    <Layout>
      {/* Most of the JSX remains the same */}
      <div className="container px-4 py-6">
        <div className="mb-6">
          <Link href="/projects" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">{project.title}</h1>
              <p className="text-gray-500">{project.description}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Start: {format(new Date(project.startDate), "MMMM d, yyyy")}
                </div>
                {project.endDate && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    End: {format(new Date(project.endDate), "MMMM d, yyyy")}
                  </div>
                )}
                {project.category && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <BarChart2 className="h-4 w-4" />
                    Category: {project.category}
                  </div>
                )}
              </div>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.tags.map((tag: string) => (
                    <div key={tag} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "text-xs px-3 py-1 rounded-full capitalize",
                    statusColors[project.status as keyof typeof statusColors],
                  )}
                >
                  {project.status}
                </div>
                <div className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">
                  {project.progress}% Complete
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">
              <FileText className="h-4 w-4 mr-1" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-1" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-1" />
              Team
            </TabsTrigger>
            <TabsTrigger value="comments">
              <MessageSquare className="h-4 w-4 mr-1" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart2 className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="risks">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Risks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Project Overview</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Description</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Progress</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div
                            className={cn(
                              "h-2.5 rounded-full",
                              project.progress === 100 ? "bg-green-500" : "bg-blue-600",
                            )}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Start Date</h3>
                          <p className="text-sm text-gray-600">{format(new Date(project.startDate), "MMMM d, yyyy")}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">End Date</h3>
                          <p className="text-sm text-gray-600">
                            {project.endDate ? format(new Date(project.endDate), "MMMM d, yyyy") : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Status</h3>
                          <div
                            className={cn(
                              "inline-block text-xs px-2 py-1 rounded-full capitalize",
                              statusColors[project.status as keyof typeof statusColors],
                            )}
                          >
                            {project.status}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Priority</h3>
                          <div
                            className={cn(
                              "inline-block text-xs px-2 py-1 rounded-full capitalize",
                              project.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : project.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800",
                            )}
                          >
                            {project.priority}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Recent Tasks</h2>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${project.id}/tasks`}>View All</Link>
                      </Button>
                    </div>

                    {tasks.length > 0 ? (
                      <TaskList tasks={tasks.slice(0, 3)} />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No tasks found for this project</p>
                        <Button variant="outline" size="sm">
                          Add Task
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Team Members</h2>
                    {project.memberDetails && project.memberDetails.length > 0 ? (
                      <div className="space-y-4">
                        {project.memberDetails.map((member: any) => (
                          <div key={member.id} className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-gray-500">{member.title || member.email}</div>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <Users className="h-4 w-4 mr-2" />
                          Manage Team
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-4">No team members assigned</p>
                        <Button variant="outline" size="sm">
                          Add Members
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Project Stats</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Tasks</div>
                        <div className="text-2xl font-bold">{tasks.length}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Completed Tasks</div>
                        <div className="text-2xl font-bold">{tasks.filter((task) => task.completed).length}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Team Members</div>
                        <div className="text-2xl font-bold">{project.memberDetails?.length || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Days Remaining</div>
                        <div className="text-2xl font-bold">
                          {project.endDate
                            ? Math.max(
                                0,
                                Math.ceil(
                                  (new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                                ),
                              )
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Project Tasks</h2>
                <Button className="gap-1 bg-black text-white hover:bg-gray-800">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>

              {tasks.length > 0 ? (
                <TaskList tasks={tasks} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No tasks found for this project</p>
                  <Button className="gap-1 bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4" />
                    Create First Task
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Only updating the GanttChart component in the timeline tab */}
          <TabsContent value="timeline" className="mt-0">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Project Timeline</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button className="gap-1 bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>

              {tasks.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <GanttChart tasks={tasks} className="h-[600px]" onTaskUpdate={handleTaskUpdate} />
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md">
                  <p className="text-gray-500 mb-4">No tasks found for this project</p>
                  <Button className="gap-1 bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4" />
                    Create First Task
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-4">Project Analytics</h2>

              <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" size="sm">
                  Week
                </Button>
                <Button variant="default" size="sm">
                  Month
                </Button>
                <Button variant="outline" size="sm">
                  Quarter
                </Button>
                <Button variant="outline" size="sm">
                  Year
                </Button>
                <Button variant="outline" size="sm">
                  All
                </Button>
                <Button variant="outline" size="sm" className="ml-auto">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500 mb-1">Completion Rate</div>
                    <div className="text-3xl font-bold mb-1">
                      {tasks.length > 0
                        ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100)
                        : 0}
                      %
                    </div>
                    <div className="text-xs text-gray-500">
                      {tasks.filter((task) => task.completed).length} of {tasks.length} tasks completed
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500 mb-1">Avg. Completion Time</div>
                    <div className="text-3xl font-bold mb-1">0 days</div>
                    <div className="text-xs text-gray-500">From creation to completion</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500 mb-1">On-Time Completion</div>
                    <div className="text-3xl font-bold mb-1">0%</div>
                    <div className="text-xs text-gray-500">Tasks completed before deadline</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500 mb-1">Project Progress</div>
                    <div className="text-3xl font-bold mb-1">{project.progress}%</div>
                    <div className="text-xs text-gray-500">Overall project completion</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-4">Task Completion Trend</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">[Task Completion Chart]</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-4">Task Priority Distribution</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      [Priority Distribution Chart]
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Rest of the JSX remains the same */}

      <TeamProvider>
        <ProjectCreationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialProject={project}
          isEditing={true}
        />
      </TeamProvider>
    </Layout>
  )
}
