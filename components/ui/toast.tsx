"use client"

import * as React from "react"
import { X } from "lucide-react"

interface ToastProps {
  title?: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
}

export function Toast({ title, description, action, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-white border rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {title && <h3 className="font-medium text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <button onClick={onClose} className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
          <X className="h-5 w-5" />
        </button>
      </div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([])

  React.useEffect(() => {
    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent
      const toast = customEvent.detail
      const id = Math.random().toString()

      setToasts((prev) => [...prev, { ...toast, id }])

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    }

    window.addEventListener("show-toast", handleShowToast)
    return () => window.removeEventListener("show-toast", handleShowToast)
  }, [])

  return (
    <>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        />
      ))}
    </>
  )
}

export function useToast() {
  const toast = (props: ToastProps) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("show-toast", { detail: props })
      window.dispatchEvent(event)
    }
  }

  return { toast }
}
