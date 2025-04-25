"use client"

import { useState, useEffect } from "react"
import { calculatePasswordStrength, getStrengthColor, getStrengthLabel } from "@/utils/password-strength"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"

interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState({
    score: 0,
    feedback: "",
    requirements: [] as { text: string; met: boolean }[],
  })

  useEffect(() => {
    setStrength(calculatePasswordStrength(password))
  }, [password])

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Password Strength</span>
          <span className="text-sm font-medium">{getStrengthLabel(strength.score)}</span>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{strength.feedback}</p>
      </div>

      {/* Requirements */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Requirements</span>
        <ul className="space-y-1">
          {strength.requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-2 text-xs">
              {req.met ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
              <span className={req.met ? "text-muted-foreground" : ""}>{req.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
