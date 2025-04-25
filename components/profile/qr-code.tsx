"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface QRCodeDisplayProps {
  value: string
  size?: number
  level?: "L" | "M" | "Q" | "H"
}

export function QRCodeDisplay({ value, size = 200, level = "M" }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 1,
          errorCorrectionLevel: level,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error)
        },
      )
    }
  }, [value, size, level])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} className="border border-border rounded-md" />
    </div>
  )
}
