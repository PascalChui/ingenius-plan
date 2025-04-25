"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, Calendar, Settings, Users, Brain } from "lucide-react"

const items = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tâches",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Calendrier",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Brainstorming",
    href: "/workspace",
    icon: Brain,
  },
  {
    title: "Collaboration",
    href: "/collaboration",
    icon: Users,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 px-2 py-4">
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
