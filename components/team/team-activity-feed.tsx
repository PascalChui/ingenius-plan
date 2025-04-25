"use client"

import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { TeamActivity } from "@/types/team"
import { getUserById } from "@/data/teams"
import { MessageSquare, CheckCircle, Plus, UserPlus, Edit, AlertCircle } from "lucide-react"

interface TeamActivityFeedProps {
  activities: TeamActivity[]
}

export function TeamActivityFeed({ activities }: TeamActivityFeedProps) {
  if (activities.length === 0) {
    return <div className="text-center py-4 text-gray-500">No recent activity</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  )
}

function ActivityItem({ activity }: { activity: TeamActivity }) {
  const user = getUserById(activity.userId)

  if (!user) return null

  const getActivityIcon = () => {
    switch (activity.type) {
      case "task_created":
        return <Plus className="h-4 w-4 text-green-500" />
      case "task_updated":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "task_assigned":
        return <UserPlus className="h-4 w-4 text-purple-500" />
      case "comment_added":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "member_joined":
        return <UserPlus className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-gray-700">{activity.message}</p>
        {activity.metadata?.comment && (
          <div className="mt-1 text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
            {activity.metadata.comment}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 mt-1">{getActivityIcon()}</div>
    </div>
  )
}
