"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { TwoFactorSetup } from "@/components/profile/two-factor-setup"
import { LoginHistoryComponent } from "@/components/profile/login-history"
import { Shield, KeyRound, AlertTriangle, Check, X } from "lucide-react"
import type { User } from "@/types/team"

interface SecuritySettingsProps {
  user: User
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled)

  const handleToggleTwoFactor = () => {
    if (twoFactorEnabled) {
      // In a real app, this would call an API to disable 2FA
      setTwoFactorEnabled(false)
      toast({
        title: "Two-factor authentication disabled",
        description: "Your account is now less secure.",
        variant: "destructive",
      })
    } else {
      setShowTwoFactorSetup(true)
    }
  }

  const handleTwoFactorSetupComplete = () => {
    setShowTwoFactorSetup(false)
    setTwoFactorEnabled(true)
  }

  const handleTwoFactorSetupCancel = () => {
    setShowTwoFactorSetup(false)
  }

  return (
    <div className="space-y-6">
      {showTwoFactorSetup ? (
        <TwoFactorSetup user={user} onComplete={handleTwoFactorSetupComplete} onCancel={handleTwoFactorSetupCancel} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Two-Factor Authentication</CardTitle>
              </div>
              <CardDescription>
                Add an extra layer of security to your account by requiring a verification code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-factor authentication</Label>
                  <p className="text-sm text-muted-foreground">Require a verification code when signing in</p>
                </div>
                <div className="flex items-center space-x-2">
                  {twoFactorEnabled && <Badge variant="outline">Enabled</Badge>}
                  <Switch id="twoFactorAuth" checked={twoFactorEnabled} onCheckedChange={handleToggleTwoFactor} />
                </div>
              </div>

              {twoFactorEnabled && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Your account is protected</AlertTitle>
                  <AlertDescription>
                    Two-factor authentication is enabled. You'll need to enter a verification code when signing in.
                  </AlertDescription>
                </Alert>
              )}

              {!twoFactorEnabled && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Your account is at risk</AlertTitle>
                  <AlertDescription>
                    Two-factor authentication is not enabled. Enable it to protect your account from unauthorized
                    access.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            {twoFactorEnabled && (
              <CardFooter>
                <Button variant="outline" onClick={handleToggleTwoFactor}>
                  Disable Two-Factor Authentication
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <KeyRound className="h-5 w-5 text-primary" />
                <CardTitle>Password</CardTitle>
              </div>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Password</Label>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Security recommendations</Label>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Use a strong, unique password
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    {twoFactorEnabled ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <X className="mr-2 h-4 w-4 text-destructive" />
                    )}
                    Enable two-factor authentication
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Regularly review login activity
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login History & Sessions</CardTitle>
              <CardDescription>Review your recent login activity and manage active sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginHistoryComponent userId={user.id} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
