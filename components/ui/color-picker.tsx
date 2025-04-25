"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

const predefinedColors = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f43f5e", // rose
  "#64748b", // slate
]

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(value || predefinedColors[0])

  useEffect(() => {
    if (value && value !== selectedColor) {
      setSelectedColor(value)
    }
  }, [value])

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    onChange(color)
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {predefinedColors.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-transform",
            selectedColor === color ? "ring-2 ring-offset-2 ring-black" : "hover:scale-110",
          )}
          style={{ backgroundColor: color }}
          onClick={() => handleColorChange(color)}
          aria-label={`Select color ${color}`}
        >
          {selectedColor === color && <Check className="h-4 w-4 text-white" />}
        </button>
      ))}
    </div>
  )
}
