"use client"

import type React from "react"

import { format } from "date-fns"
import { useDraggable } from "@dnd-kit/core"
import type { CalendarEvent } from "@/types/calendar-event"

interface DraggableEventProps {
  event: CalendarEvent
  onClick?: (event: CalendarEvent) => void
  className?: string
  compact?: boolean
}

const categoryColors: Record<string, string> = {
  work: "bg-blue-100 text-blue-800 border-blue-500",
  personal: "bg-purple-100 text-purple-800 border-purple-500",
  meeting: "bg-red-100 text-red-800 border-red-500",
  appointment: "bg-green-100 text-green-800 border-green-500",
  holiday: "bg-yellow-100 text-yellow-800 border-yellow-500",
  reminder: "bg-pink-100 text-pink-800 border-pink-500",
  booking: "bg-indigo-100 text-indigo-800 border-indigo-500",
  other: "bg-gray-100 text-gray-800 border-gray-500",
}

const categoryDots: Record<string, string> = {
  work: "bg-blue-500",
  personal: "bg-purple-500",
  meeting: "bg-red-500",
  appointment: "bg-green-500",
  holiday: "bg-yellow-500",
  reminder: "bg-pink-500",
  booking: "bg-indigo-500",
  other: "bg-gray-500",
}

export function DraggableEvent({ event, onClick, className = "", compact = false }: DraggableEventProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: {
      event,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 10,
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDragging ? "0 5px 10px rgba(0, 0, 0, 0.2)" : "none",
      }
    : undefined

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onClick) onClick(event)
  }

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`${categoryColors[event.category]} text-xs p-1 rounded flex items-center cursor-move ${className} ${
          isDragging ? "shadow-lg" : ""
        }`}
        onClick={handleClick}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${categoryDots[event.category]} mr-1`}></div>
        <span className="truncate">{event.title}</span>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${categoryColors[event.category]} p-2 rounded border-l-4 cursor-move ${className} ${
        isDragging ? "shadow-lg" : ""
      }`}
      onClick={handleClick}
    >
      <div className="font-medium">{event.title}</div>
      <div className="text-xs">
        {format(event.startTime, "h:mm a")} - {format(event.endTime, "h:mm a")}
      </div>
      {event.location && <div className="text-xs mt-1">📍 {event.location}</div>}
    </div>
  )
}
