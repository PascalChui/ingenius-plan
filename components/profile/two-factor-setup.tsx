"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCodeDisplay } from "@/components/profile/qr-code"
import { toast } from "@/hooks/use-toast"
import { Copy, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { User } from "@/types/team"

interface TwoFactorSetupProps {
  user: User
  onComplete: () => void
  onCancel: () => void
}

export function TwoFactorSetup({ user, onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<"intro" | "scan" | "verify" | "backup">("intro")
  const [verificationCode, setVerificationCode] = useState("")
  const [secret] = useState("JBSWY3DPEHPK3PXP") // In a real app, this would be generated
  const [backupCodes] = useState([
    "12345-67890",
    "abcde-fghij",
    "klmno-pqrst",
    "uvwxy-z1234",
    "56789-abcde",
    "fghij-klmno",
    "pqrst-uvwxy",
    "z1234-56789",
  ])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const otpAuthUrl = `otpauth://totp/IngeniusPlan:${user.email}?secret=${secret}&issuer=IngeniusPlan&algorithm=SHA1&digits=6&period=30`

  const handleVerify = () => {
    // In a real app, this would verify the code against the secret
    if (verificationCode.length === 6) {
      setStep("backup")
    } else {
      toast({
        title: "Invalid verification code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      })
    }
  }

  const handleComplete = () => {
    toast({
      title: "Two-factor authentication enabled",
      description: "Your account is now more secure with 2FA.",
    })
    onComplete()
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const copyAllBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"))
    toast({
      title: "Backup codes copied",
      description: "All backup codes have been copied to your clipboard.",
    })
  }

  return (
    <Card className="w-full">
      {step === "intro" && (
        <>
          <CardHeader>
            <CardTitle>Set Up Two-Factor Authentication</CardTitle>
            <CardDescription>Two-factor authentication adds an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                You'll need an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to
                complete this setup.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Download and install an authenticator app on your mobile device</li>
                <li>Scan the QR code with your authenticator app</li>
                <li>Enter the verification code from your app to confirm setup</li>
                <li>Save your backup codes in case you lose access to your device</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => setStep("scan")}>Continue</Button>
          </CardFooter>
        </>
      )}

      {step === "scan" && (
        <>
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>Scan this QR code with your authenticator app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <QRCodeDisplay value={otpAuthUrl} />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                If you can't scan the QR code, you can manually enter this setup key in your authenticator app:
              </p>
              <div className="flex items-center space-x-2">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{secret}</code>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => copyToClipboard(secret)}>
                  {copiedCode === secret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("intro")}>
              Back
            </Button>
            <Button onClick={() => setStep("verify")}>Continue</Button>
          </CardFooter>
        </>
      )}

      {step === "verify" && (
        <>
          <CardHeader>
            <CardTitle>Verify Setup</CardTitle>
            <CardDescription>Enter the verification code from your authenticator app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("scan")}>
              Back
            </Button>
            <Button onClick={handleVerify}>Verify</Button>
          </CardFooter>
        </>
      )}

      {step === "backup" && (
        <>
          <CardHeader>
            <CardTitle>Save Backup Codes</CardTitle>
            <CardDescription>
              Save these backup codes in a secure place. You can use them to sign in if you lose access to your
              authenticator app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Each backup code can only be used once. Keep these codes safe and secure.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code) => (
                <div key={code} className="flex items-center justify-between rounded-md border border-border p-2">
                  <code className="font-mono text-sm">{code}</code>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(code)}>
                    {copiedCode === code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full" onClick={copyAllBackupCodes}>
              <Copy className="mr-2 h-4 w-4" />
              Copy all backup codes
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("verify")}>
              Back
            </Button>
            <Button onClick={handleComplete}>Complete Setup</Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
