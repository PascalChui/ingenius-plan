"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Clock, AlertTriangle, AlertCircle, Plus } from "lucide-react"
import { getTasksByUserId, updateTask } from "@/actions/task-actions"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

export function TaskList() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTasks() {
      if (session?.user?.id) {
        try {
          const fetchedTasks = await getTasksByUserId(session.user.id)
          setTasks(fetchedTasks)
        } catch (error) {
          console.error("Error fetching tasks:", error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les tâches",
            variant: "destructive",
          })
        }
      }
    }

    fetchTasks()
  }, [session, toast])

  const filteredTasks = activeTab === "all" ? tasks : tasks.filter((task) => task.status.toLowerCase() === activeTab)

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-tertiary text-white"
      case "medium":
        return "bg-primary text-white"
      case "high":
        return "bg-accent text-white"
      case "urgent":
        return "bg-secondary text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return null
      case "medium":
        return <Clock className="h-3 w-3" />
      case "high":
        return <AlertTriangle className="h-3 w-3" />
      case "urgent":
        return <AlertCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus.toLowerCase() === "done" ? "TODO" : "DONE"

    try {
      const result = await updateTask(id, { status: newStatus })

      if (result.success) {
        setTasks(
          tasks.map((task) => {
            if (task.id === id) {
              return { ...task, status: newStatus }
            }
            return task
          }),
        )

        toast({
          title: newStatus === "DONE" ? "Tâche terminée" : "Tâche rouverte",
          description: newStatus === "DONE" ? "La tâche a été marquée comme terminée" : "La tâche a été rouverte",
        })
      } else {
        throw new Error("Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task status:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tâche",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="todo">À faire</TabsTrigger>
          <TabsTrigger value="in_progress">En cours</TabsTrigger>
          <TabsTrigger value="done">Terminées</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={activeTab} className="mt-6">
        <div className="grid gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.status.toLowerCase() === "done"}
                        onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                      />
                      <div>
                        <CardTitle
                          className={task.status.toLowerCase() === "done" ? "line-through text-muted-foreground" : ""}
                        >
                          {task.title}
                        </CardTitle>
                        <CardDescription className="mt-1">{task.description}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardFooter className="pt-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      <span className="flex items-center gap-1">
                        {getPriorityIcon(task.priority)}
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase()}
                      </span>
                    </Badge>
                    {task.dueDate && <span>Échéance: {new Date(task.dueDate).toLocaleDateString("fr-FR")}</span>}
                    {task.workspaceName && <span className="ml-auto">{task.workspaceName}</span>}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">Aucune tâche trouvée</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une tâche
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
