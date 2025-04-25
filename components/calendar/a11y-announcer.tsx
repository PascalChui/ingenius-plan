"use client"

import { useEffect, useState } from "react"
import { useCalendar } from "@/contexts/calendar-context"
import { format } from "date-fns"

export function A11yAnnouncer() {
  const { viewState } = useCalendar()
  const [announcement, setAnnouncement] = useState("")

  useEffect(() => {
    // Announce view changes
    const { view, date } = viewState
    let message = ""

    switch (view) {
      case "day":
        message = `Day view: ${format(date, "EEEE, MMMM d, yyyy")}`
        break
      case "week":
        message = `Week view: Week of ${format(date, "MMMM d, yyyy")}`
        break
      case "month":
        message = `Month view: ${format(date, "MMMM yyyy")}`
        break
    }

    setAnnouncement(message)

    // Clear announcement after 3 seconds
    const timer = setTimeout(() => {
      setAnnouncement("")
    }, 3000)

    return () => clearTimeout(timer)
  }, [viewState])

  return (
    <div aria-live="polite" className="sr-only" role="status">
      {announcement}
    </div>
  )
}
