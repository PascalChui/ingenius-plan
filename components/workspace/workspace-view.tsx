"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Clock, Play, Pause, RotateCcw, Plus } from "lucide-react"

export function WorkspaceView() {
  const [activeTab, setActiveTab] = useState("pomodoro")
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
  })

  // Brainstorming notes (in a real app, this would be stored in a database)
  const [notes, setNotes] = useState([
    { id: 1, content: "Idée pour améliorer l'interface utilisateur" },
    { id: 2, content: "Rechercher des solutions pour optimiser les performances" },
    { id: 3, content: "Planifier la réunion avec l'équipe marketing" },
  ])
  const [newNote, setNewNote] = useState("")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTime(pomodoroSettings.workDuration * 60)
  }

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), content: newNote }])
      setNewNote("")
    }
  }

  return (
    <Tabs defaultValue="pomodoro" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="pomodoro" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pomodoro
        </TabsTrigger>
        <TabsTrigger value="brainstorming" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Brainstorming
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pomodoro" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Minuteur Pomodoro</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-8">{formatTime(time)}</div>
              <div className="flex gap-4">
                <Button onClick={toggleTimer} className="w-32">
                  {isRunning ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Démarrer
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetTimer}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Durée de travail (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[pomodoroSettings.workDuration]}
                    max={60}
                    step={1}
                    onValueChange={(value) => {
                      setPomodoroSettings({ ...pomodoroSettings, workDuration: value[0] })
                      if (!isRunning) setTime(value[0] * 60)
                    }}
                  />
                  <span className="w-12 text-center">{pomodoroSettings.workDuration}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pause courte (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[pomodoroSettings.shortBreak]}
                    max={15}
                    step={1}
                    onValueChange={(value) => setPomodoroSettings({ ...pomodoroSettings, shortBreak: value[0] })}
                  />
                  <span className="w-12 text-center">{pomodoroSettings.shortBreak}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pause longue (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[pomodoroSettings.longBreak]}
                    max={30}
                    step={1}
                    onValueChange={(value) => setPomodoroSettings({ ...pomodoroSettings, longBreak: value[0] })}
                  />
                  <span className="w-12 text-center">{pomodoroSettings.longBreak}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sessions avant pause longue</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[pomodoroSettings.sessionsUntilLongBreak]}
                    max={10}
                    step={1}
                    onValueChange={(value) =>
                      setPomodoroSettings({ ...pomodoroSettings, sessionsUntilLongBreak: value[0] })
                    }
                  />
                  <span className="w-12 text-center">{pomodoroSettings.sessionsUntilLongBreak}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="brainstorming" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Notes et idées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ajoutez une nouvelle idée..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addNote}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-2">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <p>{note.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
