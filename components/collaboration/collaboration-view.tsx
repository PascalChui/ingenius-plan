"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Share2, Users, MessageSquare } from "lucide-react"
import { useSocket } from "@/hooks/use-socket"
import { useSession } from "next-auth/react"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CollaborationView() {
  const { data: session } = useSession()
  const [activeWorkspace, setActiveWorkspace] = useState("wsp_01") // Default workspace
  const { socket, isConnected } = useSocket(activeWorkspace)
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")

  // In a real app, this data would come from an API
  const collaborators = [
    { id: 1, name: "Alice Martin", email: "alice@example.com", role: "Admin", avatar: "/abstract-am.png" },
    {
      id: 2,
      name: "Thomas Dubois",
      email: "thomas@example.com",
      role: "Éditeur",
      avatar: "/abstract-geometric-TD.png",
    },
    {
      id: 3,
      name: "Sophie Lefèvre",
      email: "sophie@example.com",
      role: "Lecteur",
      avatar: "/abstract-geometric-sl.png",
    },
  ]

  const sharedProjects = [
    {
      id: "wsp_01",
      name: "Projet Marketing Q3",
      description: "Planification de la campagne marketing pour le troisième trimestre",
      owner: "Alice Martin",
      members: 4,
      tasks: 12,
      completedTasks: 5,
    },
    {
      id: "wsp_02",
      name: "Refonte du site web",
      description: "Mise à jour du design et de l'architecture du site web",
      owner: "Thomas Dubois",
      members: 3,
      tasks: 8,
      completedTasks: 2,
    },
  ]

  useEffect(() => {
    if (!socket) return

    // Listen for user presence updates
    socket.on("user-active", (user) => {
      setActiveUsers((prev) => {
        // Check if user is already in the list
        const existingUserIndex = prev.findIndex((u) => u.userId === user.userId)
        if (existingUserIndex >= 0) {
          // Update existing user
          const updatedUsers = [...prev]
          updatedUsers[existingUserIndex] = user
          return updatedUsers
        } else {
          // Add new user
          return [...prev, user]
        }
      })
    })

    // Listen for chat messages
    socket.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message])
    })

    // Listen for task updates
    socket.on("task-updated", (task) => {
      console.log("Task updated:", task)
      // Update task in UI
    })

    // Listen for task creation
    socket.on("task-created", (task) => {
      console.log("Task created:", task)
      // Add task to UI
    })

    // Listen for task deletion
    socket.on("task-deleted", (taskId) => {
      console.log("Task deleted:", taskId)
      // Remove task from UI
    })

    return () => {
      socket.off("user-active")
      socket.off("chat-message")
      socket.off("task-updated")
      socket.off("task-created")
      socket.off("task-deleted")
    }
  }, [socket])

  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !session?.user) return

    const message = {
      id: Date.now(),
      text: newMessage,
      userId: session.user.id,
      userName: session.user.name,
      userImage: session.user.image,
      timestamp: new Date().toISOString(),
      workspaceId: activeWorkspace,
    }

    socket.emit("chat-message", message)
    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const selectWorkspace = (workspaceId: string) => {
    if (socket) {
      socket.emit("leave-workspace", activeWorkspace)
      socket.emit("join-workspace", workspaceId)

      if (session?.user) {
        socket.emit("user-active", {
          workspaceId,
          userId: session.user.id,
          userName: session.user.name,
          userImage: session.user.image,
        })
      }
    }

    setActiveWorkspace(workspaceId)
    setMessages([]) // Clear messages when changing workspace
    setActiveUsers([]) // Clear active users when changing workspace
  }

  return (
    <Tabs defaultValue="projects" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="projects">Projets partagés</TabsTrigger>
        <TabsTrigger value="team">Équipe</TabsTrigger>
        <TabsTrigger value="chat">Chat en direct</TabsTrigger>
      </TabsList>

      <TabsContent value="projects">
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Projets partagés</h2>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Connecté" : "Déconnecté"}</Badge>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau projet
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {sharedProjects.map((project) => (
              <Card
                key={project.id}
                className={`${project.id === activeWorkspace ? "border-primary" : ""}`}
                onClick={() => selectWorkspace(project.id)}
              >
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{project.members} membres</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Propriétaire: {project.owner}</div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progression</span>
                      <span className="text-sm text-muted-foreground">
                        {project.completedTasks}/{project.tasks} tâches
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2"
                        style={{ width: `${(project.completedTasks / project.tasks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Voir le projet</Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="team">
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Membres de l'équipe</h2>
            <div className="flex gap-2">
              <Input placeholder="Inviter par email" className="w-64" />
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Inviter
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Collaborateurs</CardTitle>
              <CardDescription>Gérez les membres de votre équipe et leurs permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaborators.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant={user.role === "Admin" ? "default" : user.role === "Éditeur" ? "outline" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs actifs</CardTitle>
              <CardDescription>Membres actuellement en ligne dans ce projet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activeUsers.length > 0 ? (
                  activeUsers.map((user) => (
                    <div key={user.userId} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.userImage || "/placeholder.svg"} alt={user.userName} />
                        <AvatarFallback>{user.userName?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.userName}</span>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun utilisateur actif pour le moment</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="chat">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Chat en direct</CardTitle>
            <CardDescription>
              Discutez en temps réel avec les membres du projet{" "}
              {sharedProjects.find((p) => p.id === activeWorkspace)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.userId === session?.user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${
                          message.userId === session?.user?.id ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.userImage || "/placeholder.svg"} alt={message.userName} />
                          <AvatarFallback>{message.userName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            message.userId === session?.user?.id ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm font-medium">{message.userName}</p>
                          <p>{message.text}</p>
                          <p className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">Aucun message pour le moment</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full gap-2">
              <Textarea
                placeholder="Écrivez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <Button onClick={sendMessage}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Envoyer
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
