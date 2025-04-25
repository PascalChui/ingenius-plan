"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTeam } from "@/contexts/team-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Mail, UserPlus, MoreHorizontal, Shield, Crown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InviteTeamMemberModal } from "@/components/team/invite-team-member-modal"

export function TeamMembers() {
  const { currentTeam, teamMembers, isTeamAdmin, isTeamOwner } = useTeam()
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  if (!currentTeam) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 mb-2">No team selected</h3>
        <p className="text-gray-400 mb-4">Please select a team to view members</p>
      </div>
    )
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.title && member.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Team Members ({teamMembers.length})</h2>
        <div className="flex gap-2">
          {isTeamAdmin && (
            <Button variant="outline" className="gap-1" onClick={() => setIsInviteModalOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search members..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No members found</div>
        ) : (
          filteredMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{member.name}</h3>
                      {member.teamRole === "owner" && <Crown className="h-4 w-4 text-yellow-500" title="Team Owner" />}
                      {member.teamRole === "admin" && <Shield className="h-4 w-4 text-blue-500" title="Team Admin" />}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    {(member.title || member.department) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {member.title}
                        {member.title && member.department && " • "}
                        {member.department}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    {isTeamAdmin && member.id !== currentTeam.ownerId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {isTeamOwner && member.teamRole !== "admin" && (
                            <DropdownMenuItem>Make Admin</DropdownMenuItem>
                          )}
                          {isTeamOwner && member.teamRole === "admin" && (
                            <DropdownMenuItem>Remove Admin</DropdownMenuItem>
                          )}
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Assign Tasks</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Remove from Team</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <InviteTeamMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
    </div>
  )
}
