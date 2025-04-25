"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import { NotificationBell } from "@/components/notification-bell"
import { NotificationProvider } from "@/contexts/notification-context"

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="bg-blue-600 text-white p-1 rounded">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-blue-600 font-bold">IngeniusPlan</span>
            </Link>
            <nav className="ml-auto flex items-center gap-4">
              <Link
                href="/home"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/home" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Home
              </Link>
              <Link
                href="/calendar"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/calendar" || pathname.startsWith("/calendar")
                    ? "bg-muted px-3 py-1 rounded-md"
                    : "text-muted-foreground",
                )}
              >
                Calendar
              </Link>
              <div className="relative">
                <Link
                  href="/tasks"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                    pathname === "/tasks" || pathname.startsWith("/tasks")
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Tasks
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down h-4 w-4"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Link>
              </div>
              <Link
                href="/projects"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/projects" || pathname.startsWith("/projects")
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                Projects
              </Link>
              <Link
                href="/teams"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/teams" || pathname.startsWith("/teams") ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Teams
              </Link>
              <Link
                href="/profile"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                  pathname === "/profile" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Profile
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down h-4 w-4"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>
              <Link
                href="/templates"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/templates" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Templates
              </Link>
              <Link
                href="/statistics"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/statistics" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Statistics
              </Link>
              <Link
                href="/workspace"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/workspace" ? "bg-muted px-3 py-1 rounded-md" : "text-muted-foreground",
                )}
              >
                Workspace
              </Link>
              <Link
                href="/resources"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/resources" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Resources
              </Link>
              <NotificationBell />
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </NotificationProvider>
  )
}
