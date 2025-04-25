"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/types/team"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { Bell, Mail, Calendar, Eye, EyeOff, AlertCircle } from "lucide-react"
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter"
import { validatePasswordHistory, updatePasswordHistory, getPasswordPolicy } from "@/utils/password-history"

interface ProfileSettingsProps {
  user: User
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    taskAssignments: true,
    taskComments: true,
    taskStatusChanges: true,
    teamUpdates: true,
    systemAnnouncements: true,
    calendarEvents: true,
    dailyDigest: false,
    weeklyDigest: true,
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordHistoryError, setPasswordHistoryError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const passwordPolicy = getPasswordPolicy()

  const handleNotificationChange = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof notificationSettings],
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))

    // Clear history error when user starts typing a new password
    if (name === "newPassword" && passwordHistoryError) {
      setPasswordHistoryError(null)
    }
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validatePassword = () => {
    // Basic validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      })
      return false
    }

    // Check password history
    const historyValidation = validatePasswordHistory(user.id, passwordForm.newPassword)
    if (!historyValidation.valid) {
      setPasswordHistoryError(historyValidation.message)
      return false
    }

    return true
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordHistoryError(null)

    if (!validatePassword()) {
      return
    }

    // In a real app, this would call an API to update the password
    setTimeout(() => {
      // Update password history
      updatePasswordHistory(user.id, passwordForm.newPassword)

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }, 500)
  }

  const handleSaveNotifications = () => {
    // In a real app, this would call an API to update notification settings
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Task Notifications</h3>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="taskReminders" className="flex flex-col gap-1">
                  <span>Task reminders</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive reminders for upcoming task deadlines
                  </span>
                </Label>
                <Switch
                  id="taskReminders"
                  checked={notificationSettings.taskReminders}
                  onCheckedChange={() => handleNotificationChange("taskReminders")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="taskAssignments" className="flex flex-col gap-1">
                  <span>Task assignments</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Get notified when you're assigned to a task
                  </span>
                </Label>
                <Switch
                  id="taskAssignments"
                  checked={notificationSettings.taskAssignments}
                  onCheckedChange={() => handleNotificationChange("taskAssignments")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="taskComments" className="flex flex-col gap-1">
                  <span>Task comments</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Get notified when someone comments on your tasks
                  </span>
                </Label>
                <Switch
                  id="taskComments"
                  checked={notificationSettings.taskComments}
                  onCheckedChange={() => handleNotificationChange("taskComments")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="taskStatusChanges" className="flex flex-col gap-1">
                  <span>Task status changes</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Get notified when the status of your tasks changes
                  </span>
                </Label>
                <Switch
                  id="taskStatusChanges"
                  checked={notificationSettings.taskStatusChanges}
                  onCheckedChange={() => handleNotificationChange("taskStatusChanges")}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Calendar Notifications</h3>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="calendarEvents" className="flex flex-col gap-1">
                  <span>Calendar events</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Get notified about upcoming calendar events
                  </span>
                </Label>
                <Switch
                  id="calendarEvents"
                  checked={notificationSettings.calendarEvents}
                  onCheckedChange={() => handleNotificationChange("calendarEvents")}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Email Digests</h3>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="dailyDigest" className="flex flex-col gap-1">
                  <span>Daily digest</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive a daily summary of your tasks and activities
                  </span>
                </Label>
                <Switch
                  id="dailyDigest"
                  checked={notificationSettings.dailyDigest}
                  onCheckedChange={() => handleNotificationChange("dailyDigest")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="weeklyDigest" className="flex flex-col gap-1">
                  <span>Weekly digest</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive a weekly summary of your tasks and activities
                  </span>
                </Label>
                <Switch
                  id="weeklyDigest"
                  checked={notificationSettings.weeklyDigest}
                  onCheckedChange={() => handleNotificationChange("weeklyDigest")}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNotifications}>Save Preferences</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {passwordForm.newPassword && (
                <PasswordStrengthMeter password={passwordForm.newPassword} className="mt-3" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords don't match</p>
              )}
            </div>

            {/* Password history policy information */}
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Password Policy</p>
              <p className="text-muted-foreground text-xs mt-1">{passwordPolicy.description}</p>
            </div>

            {/* Password history error */}
            {passwordHistoryError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordHistoryError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Preferences</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="flex flex-col gap-1">
                <span>Email notifications</span>
                <span className="font-normal text-xs text-muted-foreground">Receive notifications via email</span>
              </Label>
              <Switch
                id="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onCheckedChange={() => handleNotificationChange("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="teamUpdates" className="flex flex-col gap-1">
                <span>Team updates</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Get notified about team activity and updates
                </span>
              </Label>
              <Switch
                id="teamUpdates"
                checked={notificationSettings.teamUpdates}
                onCheckedChange={() => handleNotificationChange("teamUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="systemAnnouncements" className="flex flex-col gap-1">
                <span>System announcements</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Receive important system announcements
                </span>
              </Label>
              <Switch
                id="systemAnnouncements"
                checked={notificationSettings.systemAnnouncements}
                onCheckedChange={() => handleNotificationChange("systemAnnouncements")}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
