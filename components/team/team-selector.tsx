"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTeam } from "@/contexts/team-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TeamSelector() {
  const { currentTeam, userTeams, setCurrentTeam } = useTeam()
  const [selectedTeamId, setSelectedTeamId] = useState<string>("")

  useEffect(() => {
    if (currentTeam) {
      setSelectedTeamId(currentTeam.id)
    }
  }, [currentTeam])

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId)
    setCurrentTeam(teamId)
  }

  if (!currentTeam || userTeams.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedTeamId} onValueChange={handleTeamChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select team" />
        </SelectTrigger>
        <SelectContent>
          {userTeams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={team.avatar || "/placeholder.svg"} alt={team.name} />
                  <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{team.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
