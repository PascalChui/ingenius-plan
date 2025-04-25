"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { useNotifications } from "@/contexts/notification-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, Calendar } from "lucide-react"

export default function NotificationSettingsPage() {
  const { preferences, updatePreferences } = useNotifications()
  const [localPreferences, setLocalPreferences] = useState({ ...preferences })

  // Handle toggle changes
  const handleToggleChange = (key: keyof typeof localPreferences) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setLocalPreferences((prev) => ({
      ...prev,
      upcomingReminderHours: value[0],
    }))
  }

  // Handle event reminder time toggle
  const handleReminderTimeToggle = (time: number) => {
    setLocalPreferences((prev) => {
      const currentTimes = [...prev.eventReminderTimes]
      const index = currentTimes.indexOf(time)

      if (index === -1) {
        // Add the time
        return {
          ...prev,
          eventReminderTimes: [...currentTimes, time].sort((a, b) => a - b),
        }
      } else {
        // Remove the time
        currentTimes.splice(index, 1)
        return {
          ...prev,
          eventReminderTimes: currentTimes,
        }
      }
    })
  }

  // Save changes
  const saveChanges = () => {
    updatePreferences(localPreferences)
  }

  // Format reminder time for display
  const formatReminderTime = (minutes: number) => {
    if (minutes === 5) return "5 minutes"
    if (minutes === 15) return "15 minutes"
    if (minutes === 30) return "30 minutes"
    if (minutes === 60) return "1 hour"
    if (minutes === 1440) return "1 day"
    return `${minutes} minutes`
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                General Notifications
              </CardTitle>
              <CardDescription>Control your overall notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-enabled" className="flex-1">
                  Enable notifications
                </Label>
                <Switch
                  id="notifications-enabled"
                  checked={localPreferences.enabled}
                  onCheckedChange={() => handleToggleChange("enabled")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-notifications" className="flex-1">
                  System notifications
                </Label>
                <Switch
                  id="system-notifications"
                  checked={localPreferences.systemNotifications}
                  onCheckedChange={() => handleToggleChange("systemNotifications")}
                  disabled={!localPreferences.enabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Task Notifications
              </CardTitle>
              <CardDescription>Control notifications related to tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="upcoming-task-reminders" className="flex-1">
                  Upcoming task reminders
                </Label>
                <Switch
                  id="upcoming-task-reminders"
                  checked={localPreferences.upcomingTaskReminders}
                  onCheckedChange={() => handleToggleChange("upcomingTaskReminders")}
                  disabled={!localPreferences.enabled}
                />
              </div>

              {localPreferences.upcomingTaskReminders && localPreferences.enabled && (
                <div className="space-y-2">
                  <Label>Remind me this many hours before a task is due:</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[localPreferences.upcomingReminderHours]}
                      min={1}
                      max={72}
                      step={1}
                      onValueChange={handleSliderChange}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{localPreferences.upcomingReminderHours}h</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="overdue-task-alerts" className="flex-1">
                  Overdue task alerts
                </Label>
                <Switch
                  id="overdue-task-alerts"
                  checked={localPreferences.overdueTaskAlerts}
                  onCheckedChange={() => handleToggleChange("overdueTaskAlerts")}
                  disabled={!localPreferences.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="mention-alerts" className="flex-1">
                  Mention alerts
                </Label>
                <Switch
                  id="mention-alerts"
                  checked={localPreferences.mentionAlerts}
                  onCheckedChange={() => handleToggleChange("mentionAlerts")}
                  disabled={!localPreferences.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="assignment-alerts" className="flex-1">
                  Assignment alerts
                </Label>
                <Switch
                  id="assignment-alerts"
                  checked={localPreferences.assignmentAlerts}
                  onCheckedChange={() => handleToggleChange("assignmentAlerts")}
                  disabled={!localPreferences.enabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Calendar Event Notifications
              </CardTitle>
              <CardDescription>Control notifications for calendar events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="event-reminders" className="flex-1">
                  Event reminders
                </Label>
                <Switch
                  id="event-reminders"
                  checked={localPreferences.eventReminders}
                  onCheckedChange={() => handleToggleChange("eventReminders")}
                  disabled={!localPreferences.enabled}
                />
              </div>

              {localPreferences.eventReminders && localPreferences.enabled && (
                <div className="space-y-2">
                  <Label>Default reminder times:</Label>
                  <div className="flex flex-wrap gap-2">
                    {[5, 15, 30, 60, 1440].map((time) => (
                      <Badge
                        key={time}
                        variant={localPreferences.eventReminderTimes.includes(time) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleReminderTimeToggle(time)}
                      >
                        {formatReminderTime(time)}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    These are the default reminder times for new events. You can customize reminders for individual
                    events when creating them.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveChanges}>Save Changes</Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
