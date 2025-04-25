"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CalendarPermission } from "@/types/calendar-event"
import { getTeamsForUser, getUserById, users, teams } from "@/data/teams"
import { useCalendar } from "@/contexts/calendar-context"
import { X, Check, UserPlus, Users } from "lucide-react"

interface ShareCalendarModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShareCalendarModal({ isOpen, onClose }: ShareCalendarModalProps) {
  const { shareCalendar, removeCalendarShare, getCalendarShares } = useCalendar()
  const [tab, setTab] = useState<"users" | "teams">("users")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [permission, setPermission] = useState<CalendarPermission>("view")
  const [shares, setShares] = useState<any[]>([])

  // Current user - in a real app, this would come from auth context
  const currentUser = users[0]

  // Get user's teams
  const userTeams = getTeamsForUser(currentUser.id)

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.id !== currentUser.id &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Filter teams based on search query
  const filteredTeams = userTeams.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Load current shares
  useEffect(() => {
    if (isOpen) {
      const currentShares = getCalendarShares()
      setShares(currentShares)
    }
  }, [isOpen, getCalendarShares])

  const handleShare = () => {
    if (tab === "users" && selectedUserId) {
      shareCalendar({
        shareType: "user",
        sharedWith: selectedUserId,
        permission,
      })
      setSelectedUserId(null)
    } else if (tab === "teams" && selectedTeamId) {
      shareCalendar({
        shareType: "team",
        sharedWith: selectedTeamId,
        permission,
      })
      setSelectedTeamId(null)
    }

    // Refresh shares
    setShares(getCalendarShares())
  }

  const handleRemoveShare = (shareId: string) => {
    removeCalendarShare(shareId)
    setShares(shares.filter((share) => share.id !== shareId))
  }

  const handlePermissionChange = (shareId: string, newPermission: CalendarPermission) => {
    // Update permission in the context
    shareCalendar({
      id: shareId,
      permission: newPermission,
    })

    // Update local state
    setShares(shares.map((share) => (share.id === shareId ? { ...share, permission: newPermission } : share)))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Calendar</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs value={tab} onValueChange={(value) => setTab(value as "users" | "teams")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">
                <UserPlus className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="teams">
                <Users className="mr-2 h-4 w-4" />
                Teams
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4 mt-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="user-search">Search Users</Label>
                  <Input
                    id="user-search"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-[120px] space-y-2">
                  <Label htmlFor="permission">Permission</Label>
                  <Select value={permission} onValueChange={(value) => setPermission(value as CalendarPermission)}>
                    <SelectTrigger id="permission">
                      <SelectValue placeholder="Permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View only</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleShare} disabled={!selectedUserId} className="mb-px">
                  Share
                </Button>
              </div>

              <div className="h-[200px] overflow-y-auto border rounded-md p-2">
                {filteredUsers.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">No users found</div>
                ) : (
                  <ul className="space-y-2">
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                          selectedUserId === user.id ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        {selectedUserId === user.id && <Check className="h-4 w-4 text-green-500" />}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-4 mt-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="team-search">Search Teams</Label>
                  <Input
                    id="team-search"
                    placeholder="Search by team name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-[120px] space-y-2">
                  <Label htmlFor="team-permission">Permission</Label>
                  <Select value={permission} onValueChange={(value) => setPermission(value as CalendarPermission)}>
                    <SelectTrigger id="team-permission">
                      <SelectValue placeholder="Permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View only</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleShare} disabled={!selectedTeamId} className="mb-px">
                  Share
                </Button>
              </div>

              <div className="h-[200px] overflow-y-auto border rounded-md p-2">
                {filteredTeams.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">No teams found</div>
                ) : (
                  <ul className="space-y-2">
                    {filteredTeams.map((team) => (
                      <li
                        key={team.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                          selectedTeamId === team.id ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedTeamId(team.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={team.avatar || "/placeholder.svg"} alt={team.name} />
                            <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{team.name}</p>
                            <p className="text-xs text-gray-500">{team.members.length} members</p>
                          </div>
                        </div>
                        {selectedTeamId === team.id && <Check className="h-4 w-4 text-green-500" />}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Shared with</h3>
            <div className="border rounded-md">
              {shares.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Your calendar is not shared with anyone</div>
              ) : (
                <ul className="divide-y">
                  {shares.map((share) => {
                    const isUserShare = share.shareType === "user"
                    const entity = isUserShare
                      ? getUserById(share.sharedWith)
                      : teams.find((t) => t.id === share.sharedWith)

                    if (!entity) return null

                    return (
                      <li key={share.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={entity.avatar || "/placeholder.svg"} alt={entity.name} />
                            <AvatarFallback>{entity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{entity.name}</p>
                            <p className="text-xs text-gray-500">
                              {isUserShare ? entity.email : `${entity.members.length} members`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={share.permission}
                            onValueChange={(value) => handlePermissionChange(share.id, value as CalendarPermission)}
                          >
                            <SelectTrigger className="w-[110px] h-8">
                              <SelectValue placeholder="Permission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="view">View only</SelectItem>
                              <SelectItem value="edit">Can edit</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveShare(share.id)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
