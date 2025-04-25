"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { format, formatDistanceToNow } from "date-fns"
import { Shield, LogOut, AlertTriangle, Check, X } from "lucide-react"
import type { LoginHistory, ActiveSession } from "@/types/team"
import { getLoginHistoryForUser, getActiveSessionsForUser } from "@/data/teams"

interface LoginHistoryProps {
  userId: string
}

export function LoginHistoryComponent({ userId }: LoginHistoryProps) {
  const [loginHistory] = useState<LoginHistory[]>(getLoginHistoryForUser(userId))
  const [activeSessions] = useState<ActiveSession[]>(getActiveSessionsForUser(userId))

  const handleTerminateSession = (sessionId: string) => {
    // In a real app, this would call an API to terminate the session
    toast({
      title: "Session terminated",
      description: "The selected session has been terminated.",
    })
  }

  const handleTerminateAllSessions = () => {
    // In a real app, this would call an API to terminate all sessions
    toast({
      title: "All sessions terminated",
      description: "All sessions except your current one have been terminated.",
    })
  }

  return (
    <Tabs defaultValue="sessions" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
        <TabsTrigger value="history">Login History</TabsTrigger>
      </TabsList>

      <TabsContent value="sessions" className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleTerminateAllSessions}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out of all other sessions
          </Button>
        </div>

        {activeSessions.map((session) => (
          <Card key={session.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{session.deviceName}</CardTitle>
                </div>
                <Badge variant="outline" className="ml-2">
                  {session.id === "session-1" ? "Current Session" : "Active"}
                </Badge>
              </div>
              <CardDescription>Last active {formatDistanceToNow(new Date(session.lastActive))} ago</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Browser</p>
                  <p className="font-medium">{session.browser}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Operating System</p>
                  <p className="font-medium">{session.operatingSystem}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">IP Address</p>
                  <p className="font-medium">{session.ipAddress}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{session.location}</p>
                </div>
              </div>

              {session.id !== "session-1" && (
                <div className="mt-4 flex justify-end">
                  <Button variant="destructive" size="sm" onClick={() => handleTerminateSession(session.id)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Terminate Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="history">
        <div className="space-y-4">
          {loginHistory.map((login) => (
            <Card key={login.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {login.status === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                    <CardTitle className="text-base">
                      {login.status === "success" ? "Successful login" : "Failed login attempt"}
                    </CardTitle>
                  </div>
                  <Badge variant={login.status === "success" ? "outline" : "destructive"} className="ml-2">
                    {login.status === "success" ? "Success" : "Failed"}
                  </Badge>
                </div>
                <CardDescription>
                  {format(new Date(login.timestamp), "PPP 'at' p")} ({formatDistanceToNow(new Date(login.timestamp))}{" "}
                  ago)
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Device</p>
                    <p className="font-medium">{login.device}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Browser</p>
                    <p className="font-medium">{login.browser}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IP Address</p>
                    <p className="font-medium">{login.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{login.location}</p>
                  </div>
                </div>

                {login.status === "failed" && login.failureReason && (
                  <div className="mt-4 rounded-md bg-destructive/10 p-3">
                    <div className="flex items-center space-x-2">
                      <X className="h-4 w-4 text-destructive" />
                      <p className="font-medium text-destructive">Reason: {login.failureReason}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
