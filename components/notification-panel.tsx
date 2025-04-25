"use client"

import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Check, Clock, Settings, Trash, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/contexts/notification-context"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface NotificationPanelProps {
  onClose: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, clearAllNotifications } =
    useNotifications()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
      onClose()
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "upcoming":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "overdue":
        return <Clock className="h-5 w-5 text-red-500" />
      case "mention":
        return <span className="text-purple-500 font-bold">@</span>
      case "assignment":
        return <Check className="h-5 w-5 text-green-500" />
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />
      case "event-reminder":
        return <Calendar className="h-5 w-5 text-indigo-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg border z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">
          Notifications {unreadCount > 0 && <span className="text-sm text-gray-500">({unreadCount} unread)</span>}
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
          <Link href="/notification-settings" onClick={onClose}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border-b hover:bg-gray-50 cursor-pointer flex items-start gap-3",
                  !notification.read && "bg-blue-50 hover:bg-blue-50",
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearNotification(notification.id)
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t flex justify-between">
        <Button variant="ghost" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
          Clear all
        </Button>
        <Link href="/notifications" onClick={onClose}>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </div>
    </div>
  )
}
