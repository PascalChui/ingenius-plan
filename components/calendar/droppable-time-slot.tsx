"use client"

import type React from "react"

import { useDroppable } from "@dnd-kit/core"

interface DroppableTimeSlotProps {
  id: string
  date: Date
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function DroppableTimeSlot({ id, date, children, className = "", onClick }: DroppableTimeSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      date,
    },
  })

  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? "bg-blue-50" : ""}`} onClick={onClick}>
      {children}
    </div>
  )
}
