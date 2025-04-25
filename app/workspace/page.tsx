"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Play,
  RefreshCw,
  Settings,
  Plus,
  Download,
  Lightbulb,
  LayoutListIcon as LayoutPlaneLine,
  ListTodo,
  FileText,
  Volume2,
} from "lucide-react"

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("focus")
  const [focusMode, setFocusMode] = useState("timer") // 'timer' or 'deep-work'

  return (
    <Layout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Workspace</h1>
          <Button variant="outline" size="sm" className="gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        <div className="grid md:grid-cols-[350px_1fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Focus Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="w-36 h-36 rounded-full border-8 border-gray-200 flex items-center justify-center mb-4">
                    <div className="text-3xl font-bold">25:00</div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">Focus Mode</div>

                  <div className="flex gap-2 mb-4 w-full">
                    <Button
                      variant="outline"
                      className="flex-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500 mb-2 w-full">0 sessions completed</div>

                  <Button variant="link" size="sm" className="text-gray-500">
                    <Settings className="h-3 w-3 mr-1" />
                    Timer Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Ambient Sounds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button variant="outline" className="justify-start text-sm h-9">
                    <span className="mr-2">🌧️</span> Rain
                  </Button>
                  <Button variant="outline" className="justify-start text-sm h-9">
                    <span className="mr-2">🌲</span> Forest
                  </Button>
                  <Button variant="outline" className="justify-start text-sm h-9">
                    <span className="mr-2">☕</span> Cafe
                  </Button>
                  <Button variant="outline" className="justify-start text-sm h-9">
                    <span className="mr-2">🌊</span> Ocean
                  </Button>
                  <Button variant="outline" className="justify-start text-sm h-9">
                    <span className="mr-2">🔥</span> Fireplace
                  </Button>
                  <Button variant="outline" className="justify-start text-sm h-9">
                    <span className="mr-2">📻</span> White Noise
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-gray-400" />
                  <input type="range" className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Tabs defaultValue="focus" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="focus" className="gap-1">
                  <Lightbulb className="h-4 w-4" />
                  Focus
                </TabsTrigger>
                <TabsTrigger value="ideation" className="gap-1">
                  <Lightbulb className="h-4 w-4" />
                  Ideation
                </TabsTrigger>
                <TabsTrigger value="planning" className="gap-1">
                  <LayoutPlaneLine className="h-4 w-4" />
                  Planning
                </TabsTrigger>
                <TabsTrigger value="tasks" className="gap-1">
                  <ListTodo className="h-4 w-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-1">
                  <FileText className="h-4 w-4" />
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="focus" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2">Deep Work Mode</h2>
                    <p className="text-gray-600 mb-6">
                      Focus mode helps you concentrate on your most important work. Set your intention, start the timer,
                      and minimize distractions.
                    </p>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-1 block">Session Intention</label>
                      <Input placeholder="What do you want to accomplish in this session?" className="mb-4" />

                      <Button className="w-full bg-black text-white hover:bg-gray-800">Start Focus Session</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ideation" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Idea Board</h2>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          Export/Import
                        </Button>
                        <Button variant="outline" size="sm">
                          Categories
                        </Button>
                        <Button variant="outline" size="sm">
                          Templates
                        </Button>
                        <Button size="sm" className="gap-1 bg-black text-white hover:bg-gray-800">
                          <Plus className="h-4 w-4" />
                          Add Idea
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <Button variant="default" size="sm" className="bg-black text-white hover:bg-gray-800">
                        All Categories
                      </Button>
                      <Button variant="outline" size="sm">
                        General
                      </Button>
                      <Button variant="outline" size="sm">
                        Feature Ideas
                      </Button>
                      <Button variant="outline" size="sm">
                        Improvements
                      </Button>
                      <Button variant="outline" size="sm">
                        Bug Fixes
                      </Button>
                      <Button variant="outline" size="sm">
                        Research
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-3 w-3" />
                        Add Category
                      </Button>
                    </div>

                    <div className="flex gap-2 mb-6">
                      <Input placeholder="Search ideas..." className="max-w-md" />
                      <Button variant="outline" size="sm">
                        Search
                      </Button>
                    </div>

                    <div className="h-64 flex items-center justify-center text-gray-400 border rounded-md">
                      No ideas yet. Click "Add Idea" to get started.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  )
}
