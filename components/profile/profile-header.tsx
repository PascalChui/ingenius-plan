import type { User } from "@/types/team"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getTeamsForUser } from "@/data/teams"
import { formatDistanceToNow } from "date-fns"
import { Mail, Edit } from "lucide-react"

interface ProfileHeaderProps {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const teams = getTeamsForUser(user.id)
  const joinedDate = new Date(user.joinedAt)
  const timeAgo = formatDistanceToNow(joinedDate, { addSuffix: true })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
      <Avatar className="h-24 w-24 border-2 border-border">
        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          {user.title && <div>• {user.title}</div>}
          {user.department && <div>• {user.department}</div>}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <div className="text-sm text-muted-foreground">Joined {timeAgo}</div>
          <div className="text-sm text-muted-foreground">
            • Member of {teams.length} {teams.length === 1 ? "team" : "teams"}
          </div>
        </div>
      </div>

      <div className="ml-auto mt-2 md:mt-0">
        <Button variant="outline" size="sm" className="gap-1">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  )
}
