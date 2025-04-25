"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Bell, Check, Clock, Settings, Trash } from "lucide-react"
import { useNotifications } from "@/contexts/notification-context"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const router = useRouter()
  const { notifications, markAsRead, markAllAsRead, clearNotification, clearAllNotifications } = useNotifications()
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
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
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Layout>
      <div className="container px-4 py-6">
        <div className="mb-6">
          <Link href="/tasks" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tasks
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={!notifications.some((n) => !n.read)}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all as read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash className="h-4 w-4 mr-1" />
                Clear all
              </Button>
              <Link href="/notification-settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="mention">Mentions</TabsTrigger>
            <TabsTrigger value="assignment">Assignments</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No notifications</h3>
            <p className="text-gray-400">You don't have any {activeTab !== "all" ? activeTab : ""} notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id} className={cn(!notification.read && "border-blue-200 bg-blue-50")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => clearNotification(notification.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
