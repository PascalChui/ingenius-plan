"use client"

import { CardContent } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useSocket } from "@/hooks/use-socket"
import { useSession } from "next-auth/react"
import {
  FileText,
  ImageIcon,
  MoreHorizontal,
  FileSpreadsheet,
  Share2,
  Download,
  Clock,
  Users,
  Search,
  Save,
  Eye,
  Edit,
} from "lucide-react"

export function DocumentsView() {
  const { data: session } = useSession()
  const [activeDocument, setActiveDocument] = useState<any>(null)
  const [documentContent, setDocumentContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [collaborators, setCollaborators] = useState<any[]>([])
  const { socket, isConnected } = useSocket(activeDocument?.workspaceId || "wsp_01")

  // Sample documents data
  const documents = [
    {
      id: 1,
      title: "Plan de projet",
      type: "document",
      icon: FileText,
      updatedAt: "Il y a 2 heures",
      workspaceId: "wsp_01",
      sharedWith: [
        { id: 1, name: "Alice Martin", avatar: "/abstract-am.png" },
        { id: 2, name: "Thomas Dubois", avatar: "/abstract-geometric-TD.png" },
      ],
    },
    {
      id: 2,
      title: "Budget Q3",
      type: "spreadsheet",
      icon: FileSpreadsheet,
      updatedAt: "Hier",
      workspaceId: "wsp_01",
      sharedWith: [{ id: 1, name: "Alice Martin", avatar: "/abstract-am.png" }],
    },
    {
      id: 3,
      title: "Maquette UI",
      type: "image",
      icon: ImageIcon,
      updatedAt: "Il y a 3 jours",
      workspaceId: "wsp_02",
      sharedWith: [
        { id: 2, name: "Thomas Dubois", avatar: "/abstract-geometric-TD.png" },
        { id: 3, name: "Sophie Lefèvre", avatar: "/abstract-geometric-sl.png" },
      ],
    },
  ]

  // Sample shared documents
  const sharedDocuments = [
    {
      id: 4,
      title: "Stratégie marketing",
      type: "document",
      icon: FileText,
      owner: "Alice Martin",
      workspaceId: "wsp_01",
      updatedAt: "Il y a 1 jour",
    },
    {
      id: 5,
      title: "Analyse des ventes",
      type: "spreadsheet",
      icon: FileSpreadsheet,
      owner: "Thomas Dubois",
      workspaceId: "wsp_02",
      updatedAt: "Il y a 1 semaine",
    },
  ]

  const handleOpenDocument = (doc: any) => {
    setActiveDocument(doc)
    setIsEditing(false)
    // In a real app, we would fetch the document content from the server
    setDocumentContent(
      "# Plan de projet\n\n## Objectifs\n\n- Définir les objectifs du projet\n- Identifier les parties prenantes\n- Établir un calendrier\n\n## Ressources\n\n- Équipe de développement\n- Budget alloué\n- Outils et technologies\n\n## Échéances\n\n- Phase 1: Analyse - 2 semaines\n- Phase 2: Conception - 3 semaines\n- Phase 3: Développement - 8 semaines\n- Phase 4: Tests - 2 semaines\n- Phase 5: Déploiement - 1 semaine",
    )
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setDocumentContent(newContent)

    // Send real-time updates to collaborators
    if (socket && activeDocument) {
      socket.emit("document-update", {
        documentId: activeDocument.id,
        content: newContent,
        userId: session?.user?.id,
        userName: session?.user?.name,
        workspaceId: activeDocument.workspaceId,
      })
    }
  }

  const handleSaveDocument = () => {
    // In a real app, we would save the document to the server
    console.log("Saving document:", activeDocument?.id, documentContent)
    setIsEditing(false)
  }

  // Listen for document updates from other users
  useState(() => {
    if (!socket) return

    socket.on("document-updated", (data) => {
      if (activeDocument?.id === data.documentId) {
        setDocumentContent(data.content)
      }
    })

    socket.on("user-active", (user) => {
      setCollaborators((prev) => {
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

    return () => {
      socket.off("document-updated")
      socket.off("user-active")
    }
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Tabs defaultValue="my-documents">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="my-documents">Mes documents</TabsTrigger>
            <TabsTrigger value="shared">Partagés avec moi</TabsTrigger>
          </TabsList>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher des documents..." className="pl-8" />
            </div>
          </div>

          <TabsContent value="my-documents" className="m-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-2">
                {documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className={`cursor-pointer hover:bg-accent/5 ${
                      activeDocument?.id === doc.id ? "border-primary" : ""
                    }`}
                    onClick={() => handleOpenDocument(doc)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-md">
                            {/* @ts-expect-error */}
                            <doc.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{doc.title}</CardTitle>
                            <CardDescription className="text-xs flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {doc.updatedAt}
                            </CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              Partager
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    {doc.sharedWith.length > 0 && (
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <div className="flex -space-x-2">
                          {doc.sharedWith.map((user) => (
                            <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          Partagé
                        </Badge>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shared" className="m-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-2">
                {sharedDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className={`cursor-pointer hover:bg-accent/5 ${
                      activeDocument?.id === doc.id ? "border-primary" : ""
                    }`}
                    onClick={() => handleOpenDocument(doc)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-md">
                            {/* @ts-expect-error */}
                            <doc.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{doc.title}</CardTitle>
                            <CardDescription className="text-xs flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {doc.updatedAt}
                            </CardDescription>
                            <CardDescription className="text-xs mt-1">Propriétaire: {doc.owner}</CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <div className="md:col-span-2">
        {activeDocument ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{activeDocument.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {activeDocument.updatedAt}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isConnected && (
                    <Badge variant="outline" className="bg-green-50">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Connecté
                    </Badge>
                  )}
                  {collaborators.length > 0 && (
                    <div className="flex -space-x-2">
                      {collaborators.map((user) => (
                        <Avatar key={user.userId} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={user.userImage || "/placeholder.svg"} alt={user.userName} />
                          <AvatarFallback>{user.userName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1">
                    {isEditing ? (
                      <Button size="sm" onClick={handleSaveDocument}>
                        <Save className="h-4 w-4 mr-1" />
                        Enregistrer
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Partager
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Copier le lien</DropdownMenuItem>
                        <DropdownMenuItem>Inviter des collaborateurs</DropdownMenuItem>
                        <DropdownMenuItem>Paramètres de partage</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {isEditing ? (
                <Textarea className="min-h-[500px] font-mono" value={documentContent} onChange={handleContentChange} />
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-muted rounded-md">{documentContent}</pre>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t p-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {activeDocument.sharedWith?.length || 0} personnes peuvent voir ce document
              </div>
            </CardFooter>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center border rounded-lg">
            <div className="text-center p-6">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Aucun document sélectionné</h3>
              <p className="text-muted-foreground mt-2">
                Sélectionnez un document dans la liste pour l'afficher ou le modifier
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
