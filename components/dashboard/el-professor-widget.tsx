"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Send, Bot, Sparkles, Brain, Clock, Calendar, CheckSquare } from "lucide-react"
import { useSession } from "next-auth/react"
import { getTasksByUserId } from "@/actions/task-actions"
import { getEventsByUserId } from "@/actions/event-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ElProfessorWidgetProps {
  className?: string
}

export function ElProfessorWidget({ className }: ElProfessorWidgetProps) {
  const { data: session } = useSession()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Bonjour ! Je suis El_Professor, votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<{
    tasks: any[]
    events: any[]
    name: string
    productivityStats: {
      completedTasks: number
      totalTasks: number
      focusTime: number // in minutes
      averageTaskCompletion: number // in days
    }
    preferences: {
      workHours: { start: number; end: number }
      preferredWorkDays: string[]
      taskPreferences: string[]
    }
  }>({
    tasks: [],
    events: [],
    name: "",
    productivityStats: {
      completedTasks: 0,
      totalTasks: 0,
      focusTime: 0,
      averageTaskCompletion: 0,
    },
    preferences: {
      workHours: { start: 9, end: 17 },
      preferredWorkDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      taskPreferences: ["Important", "Urgent"],
    },
  })
  const [activeTab, setActiveTab] = useState("chat")

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.id) {
        try {
          const [tasks, events] = await Promise.all([
            getTasksByUserId(session.user.id),
            getEventsByUserId(session.user.id),
          ])

          // Calculate productivity stats
          const completedTasks = tasks.filter((t) => t.status.toLowerCase() === "done").length
          const totalTasks = tasks.length

          // Simulate focus time data (in a real app, this would come from Pomodoro sessions)
          const focusTime = Math.floor(Math.random() * 1000) + 500 // Random between 500-1500 minutes

          // Calculate average task completion time
          const completedTasksWithDates = tasks
            .filter((t) => t.status.toLowerCase() === "done" && t.createdAt && t.updatedAt)
            .map((t) => {
              const created = new Date(t.createdAt)
              const completed = new Date(t.updatedAt)
              return (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) // days
            })

          const averageTaskCompletion =
            completedTasksWithDates.length > 0
              ? completedTasksWithDates.reduce((sum, time) => sum + time, 0) / completedTasksWithDates.length
              : 0

          setUserData({
            tasks,
            events,
            name: session.user.name || "utilisateur",
            productivityStats: {
              completedTasks,
              totalTasks,
              focusTime,
              averageTaskCompletion,
            },
            preferences: {
              workHours: { start: 9, end: 17 },
              preferredWorkDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              taskPreferences: ["Important", "Urgent"],
            },
          })
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
    }

    fetchUserData()
  }, [session])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    // Generate AI response based on user data and input
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, userData)
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: aiResponse }])
      setIsLoading(false)
    }, 1000)
  }

  const generateAIResponse = (input: string, userData: any) => {
    const inputLower = input.toLowerCase()

    // Advanced AI features - Context-aware responses

    // Task prioritization
    if (inputLower.includes("priorité") || inputLower.includes("priorités") || inputLower.includes("important")) {
      const pendingTasks = userData.tasks.filter((t) => t.status.toLowerCase() !== "done")

      if (pendingTasks.length === 0) {
        return "Vous n'avez aucune tâche en attente. Bravo pour votre productivité ! Voulez-vous que je vous aide à planifier de nouveaux objectifs ?"
      }

      // Sort tasks by priority and due date
      const sortedTasks = [...pendingTasks].sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        const aPriority = priorityOrder[a.priority.toLowerCase()] || 4
        const bPriority = priorityOrder[b.priority.toLowerCase()] || 4

        if (aPriority !== bPriority) return aPriority - bPriority

        // If same priority, sort by due date
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        }
        return a.dueDate ? -1 : b.dueDate ? 1 : 0
      })

      let response = `Voici vos tâches prioritaires :\n\n`
      sortedTasks.slice(0, 3).forEach((task, index) => {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString("fr-FR") : "Pas de date limite"
        response += `${index + 1}. **${task.title}** (${task.priority}) - Échéance: ${dueDate}\n`
      })

      response += `\nJe vous recommande de commencer par "${sortedTasks[0].title}" qui est la plus prioritaire.`
      return response
    }

    // Schedule optimization
    if (inputLower.includes("optimiser") || inputLower.includes("planning") || inputLower.includes("emploi du temps")) {
      const today = new Date()
      const upcomingEvents = userData.events
        .filter((e) => new Date(e.startTime) > today)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

      const pendingTasks = userData.tasks.filter((t) => t.status.toLowerCase() !== "done")

      if (upcomingEvents.length === 0 && pendingTasks.length === 0) {
        return "Vous n'avez aucun événement ou tâche à venir. Votre emploi du temps est libre !"
      }

      // Find free time slots
      const busySlots = upcomingEvents.map((event) => ({
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        title: event.title,
      }))

      // Get next 5 days
      const nextDays = Array.from({ length: 5 }, (_, i) => {
        const date = new Date()
        date.setDate(today.getDate() + i)
        return date
      })

      let response = "Voici une optimisation de votre emploi du temps pour les prochains jours :\n\n"

      nextDays.forEach((day) => {
        const dayName = day.toLocaleDateString("fr-FR", { weekday: "long" })
        const dayFormatted = day.toLocaleDateString("fr-FR")

        response += `**${dayName} ${dayFormatted}**\n`

        // Events for this day
        const dayEvents = upcomingEvents.filter((e) => {
          const eventDate = new Date(e.startTime)
          return (
            eventDate.getDate() === day.getDate() &&
            eventDate.getMonth() === day.getMonth() &&
            eventDate.getFullYear() === day.getFullYear()
          )
        })

        if (dayEvents.length > 0) {
          dayEvents.forEach((event) => {
            const start = new Date(event.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            const end = new Date(event.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            response += `- ${start}-${end}: ${event.title}\n`
          })
        } else {
          response += "- Aucun événement prévu\n"
        }

        // Suggest tasks for free time
        if (pendingTasks.length > 0) {
          response += "- Tâches suggérées: "
          response += pendingTasks
            .slice(0, 2)
            .map((t) => t.title)
            .join(", ")
          response += "\n"
        }

        response += "\n"
      })

      return response
    }

    // Productivity insights
    if (
      inputLower.includes("productivité") ||
      inputLower.includes("statistiques") ||
      inputLower.includes("performance")
    ) {
      const { completedTasks, totalTasks, focusTime, averageTaskCompletion } = userData.productivityStats

      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      const focusHours = Math.floor(focusTime / 60)
      const focusMinutes = focusTime % 60

      let response = "**Analyse de votre productivité**\n\n"
      response += `Taux de complétion: ${completionRate.toFixed(1)}% (${completedTasks}/${totalTasks} tâches)\n`
      response += `Temps de concentration total: ${focusHours}h ${focusMinutes}min\n`
      response += `Temps moyen de complétion d'une tâche: ${averageTaskCompletion.toFixed(1)} jours\n\n`

      // Add insights
      if (completionRate < 30) {
        response +=
          "Votre taux de complétion est assez bas. Essayez de décomposer vos tâches en sous-tâches plus petites et plus faciles à accomplir.\n"
      } else if (completionRate > 70) {
        response += "Excellent taux de complétion ! Continuez comme ça.\n"
      }

      if (averageTaskCompletion > 7) {
        response +=
          "Vos tâches prennent en moyenne plus d'une semaine à être complétées. Envisagez de les découper en étapes plus petites.\n"
      }

      response += "\nVoulez-vous des conseils spécifiques pour améliorer votre productivité ?"

      return response
    }

    // Learning recommendations
    if (inputLower.includes("apprendre") || inputLower.includes("formation") || inputLower.includes("compétence")) {
      // Analyze user's tasks and interests to suggest learning paths
      const taskTitles = userData.tasks.map((t) => t.title.toLowerCase())
      const taskDescriptions = userData.tasks.map((t) => (t.description || "").toLowerCase())

      const keywords = {
        programming: ["code", "développement", "javascript", "python", "react", "web"],
        design: ["design", "ui", "ux", "interface", "maquette", "figma"],
        marketing: ["marketing", "seo", "social media", "campagne", "publicité"],
        management: ["gestion", "équipe", "projet", "management", "leadership"],
        writing: ["rédaction", "contenu", "article", "blog", "écriture"],
      }

      // Count keyword occurrences
      const scores = Object.entries(keywords).reduce(
        (acc, [category, words]) => {
          acc[category] = words.reduce((sum, word) => {
            const titleMatches = taskTitles.filter((title) => title.includes(word)).length
            const descMatches = taskDescriptions.filter((desc) => desc.includes(word)).length
            return sum + titleMatches * 2 + descMatches
          }, 0)
          return acc
        },
        {} as Record<string, number>,
      )

      // Find top categories
      const topCategories = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([category]) => category)

      const learningRecommendations = {
        programming: [
          "**JavaScript Moderne**: Apprenez les dernières fonctionnalités d'ES6+ sur Codecademy",
          "**React Avancé**: Maîtrisez les hooks et le state management sur Udemy",
          "**Algorithmes et Structures de Données**: Cours fondamental sur Coursera",
        ],
        design: [
          "**UI/UX Design Principles**: Cours complet sur Interaction Design Foundation",
          "**Maîtriser Figma**: Tutoriels avancés sur YouTube",
          "**Design System**: Créer et maintenir un système de design cohérent",
        ],
        marketing: [
          "**SEO Avancé**: Optimisation pour les moteurs de recherche sur Moz Academy",
          "**Marketing de Contenu**: Stratégies efficaces sur HubSpot Academy",
          "**Analytics**: Maîtriser Google Analytics pour mesurer vos performances",
        ],
        management: [
          "**Gestion Agile**: Certification Scrum Master",
          "**Leadership**: Cours de leadership situationnel sur Coursera",
          "**Gestion de Projet**: Méthodologies et outils sur LinkedIn Learning",
        ],
        writing: [
          "**Copywriting**: L'art d'écrire pour convertir",
          "**Storytelling**: Techniques narratives pour engager votre audience",
          "**SEO Writing**: Optimiser vos contenus pour le référencement",
        ],
      }

      let response =
        "Basé sur vos activités, voici des recommandations de formation qui pourraient vous intéresser :\n\n"

      topCategories.forEach((category) => {
        response += `**${category.charAt(0).toUpperCase() + category.slice(1)}**\n`
        learningRecommendations[category as keyof typeof learningRecommendations].forEach((rec) => {
          response += `- ${rec}\n`
        })
        response += "\n"
      })

      return response
    }

    // Check for greeting or introduction
    if (
      inputLower.includes("bonjour") ||
      inputLower.includes("salut") ||
      inputLower.includes("hello") ||
      inputLower.includes("qui es-tu")
    ) {
      return `Bonjour ${userData.name} ! Je suis El_Professor, votre assistant IA personnel. Je suis là pour vous aider à améliorer votre productivité, gérer vos tâches et vous donner des conseils personnalisés. Je peux analyser vos habitudes de travail, optimiser votre emploi du temps, et vous fournir des insights sur votre productivité. N'hésitez pas à me demander de l'aide pour organiser votre journée, prioriser vos tâches ou obtenir des conseils de productivité.`
    }

    // Default responses with more personalization
    const defaultResponses = [
      `D'après votre emploi du temps, je vous suggère de vous concentrer sur la tâche "${userData.tasks[0]?.title || "principale"}" qui semble prioritaire. Vous avez tendance à être plus productif en ${userData.preferences.workHours.start < 12 ? "matinée" : "après-midi"}.`,

      `Avez-vous essayé la technique Pomodoro pour améliorer votre concentration ? Selon vos statistiques, vous êtes plus efficace avec des sessions de travail de ${userData.productivityStats.focusTime > 800 ? "25-30" : "15-20"} minutes.`,

      `Je remarque que vous avez ${userData.tasks.filter((t) => t.status.toLowerCase() !== "done").length} tâches en attente. Votre taux de complétion est de ${userData.productivityStats.completedTasks > 0 ? Math.round((userData.productivityStats.completedTasks / userData.productivityStats.totalTasks) * 100) : 0}%. Souhaitez-vous que je vous aide à les prioriser ?`,

      `Votre productivité est généralement meilleure ${userData.preferences.workHours.start < 10 ? "le matin" : "l'après-midi"}. Envisagez de planifier les tâches importantes pendant cette période pour maximiser votre efficacité.`,

      `Je constate que vous complétez vos tâches en moyenne en ${userData.productivityStats.averageTaskCompletion.toFixed(1)} jours. C'est ${userData.productivityStats.averageTaskCompletion < 3 ? "excellent" : "un peu long"}. Voulez-vous des conseils pour améliorer ce délai ?`,
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <Tabs defaultValue="chat" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              El_Professor
            </CardTitle>
            <TabsList>
              <TabsTrigger value="chat" className="text-xs">
                Chat
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">
                Insights
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-xs">
                Stats
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <TabsContent value="chat" className="mt-0 h-full">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-max max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-muted rounded-lg px-3 py-2 text-sm w-max max-w-[80%]">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="insights" className="mt-0">
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <h3 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Recommandations personnalisées
              </h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 text-primary mt-0.5" />
                  <span>
                    Concentrez-vous sur les tâches "{userData.preferences.taskPreferences.join('" et "')}" en priorité
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5" />
                  <span>
                    Votre période de productivité optimale est entre {userData.preferences.workHours.start}h et{" "}
                    {userData.preferences.workHours.end}h
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-primary mt-0.5" />
                  <span>Essayez des sessions de travail de 25 minutes suivies de pauses de 5 minutes</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <h3 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Prochains événements
              </h3>
              {userData.events.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {userData.events.slice(0, 3).map((event, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{event.title}</span>
                      <span className="text-muted-foreground">
                        {new Date(event.startTime).toLocaleDateString("fr-FR")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Aucun événement à venir</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Tâches complétées</div>
                <div className="text-2xl font-bold">{userData.productivityStats.completedTasks}</div>
                <div className="text-xs text-muted-foreground">sur {userData.productivityStats.totalTasks} tâches</div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Temps de concentration</div>
                <div className="text-2xl font-bold">{Math.floor(userData.productivityStats.focusTime / 60)}h</div>
                <div className="text-xs text-muted-foreground">{userData.productivityStats.focusTime % 60}min</div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <h3 className="text-sm font-medium">Taux de complétion</h3>
              <div className="mt-2 h-2 w-full bg-muted rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{
                    width: `${
                      userData.productivityStats.totalTasks > 0
                        ? (userData.productivityStats.completedTasks / userData.productivityStats.totalTasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-right text-muted-foreground">
                {userData.productivityStats.totalTasks > 0
                  ? Math.round(
                      (userData.productivityStats.completedTasks / userData.productivityStats.totalTasks) * 100,
                    )
                  : 0}
                %
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <h3 className="text-sm font-medium">Temps moyen par tâche</h3>
              <div className="mt-1 text-lg font-bold">
                {userData.productivityStats.averageTaskCompletion.toFixed(1)} jours
              </div>
            </div>
          </div>
        </TabsContent>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Posez une question à El_Professor..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
            disabled={isLoading || activeTab !== "chat"}
          />
          <Button size="icon" onClick={handleSend} disabled={isLoading || activeTab !== "chat"}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Envoyer</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
