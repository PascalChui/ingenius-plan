"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Team, User, TeamActivity } from "@/types/team"
import type { Task } from "@/types/task"
import { teams, users, getUserById, getTeamById, getTeamMembersWithDetails, getTeamActivities } from "@/data/teams"
import { getTasksForTeam } from "@/data/tasks"

interface TeamContextType {
  currentUser: User | null
  currentTeam: Team | null
  teamMembers: (User & { teamRole: string })[]
  teamTasks: Task[]
  teamActivities: TeamActivity[]
  setCurrentUser: (userId: string) => void
  setCurrentTeam: (teamId: string) => void
  userTeams: Team[]
  isTeamAdmin: boolean
  isTeamOwner: boolean
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<(User & { teamRole: string })[]>([])
  const [teamTasks, setTeamTasks] = useState<Task[]>([])
  const [teamActivities, setTeamActivities] = useState<TeamActivity[]>([])
  const [userTeams, setUserTeams] = useState<Team[]>([])

  // Set current user
  const setCurrentUser = (userId: string) => {
    const user = getUserById(userId)
    setCurrentUserState(user || null)
  }

  // Set current team
  const setCurrentTeam = (teamId: string) => {
    const team = getTeamById(teamId)
    setCurrentTeamState(team || null)
  }

  // Initialize with default user
  useEffect(() => {
    if (!currentUser && users.length > 0) {
      setCurrentUser(users[0].id)
    }
  }, [currentUser])

  // Update user teams when current user changes
  useEffect(() => {
    if (currentUser) {
      const userTeams = teams.filter((team) => team.members.some((member) => member.userId === currentUser.id))
      setUserTeams(userTeams)

      // Set default team if none selected
      if (!currentTeam && userTeams.length > 0) {
        setCurrentTeam(userTeams[0].id)
      }
    }
  }, [currentUser, currentTeam])

  // Update team data when current team changes
  useEffect(() => {
    if (currentTeam) {
      // Get team members with user details
      const members = getTeamMembersWithDetails(currentTeam.id)
      setTeamMembers(members)

      // Get team tasks
      const tasks = getTasksForTeam(currentTeam.id)
      setTeamTasks(tasks)

      // Get team activities
      const activities = getTeamActivities(currentTeam.id)
      setTeamActivities(activities)
    }
  }, [currentTeam])

  // Check if current user is team admin
  const isTeamAdmin = !!(
    currentUser &&
    currentTeam &&
    currentTeam.members.some(
      (member) => member.userId === currentUser.id && (member.role === "admin" || member.role === "owner"),
    )
  )

  // Check if current user is team owner
  const isTeamOwner = !!(currentUser && currentTeam && currentTeam.ownerId === currentUser.id)

  return (
    <TeamContext.Provider
      value={{
        currentUser,
        currentTeam,
        teamMembers,
        teamTasks,
        teamActivities,
        setCurrentUser,
        setCurrentTeam,
        userTeams,
        isTeamAdmin,
        isTeamOwner,
      }}
    >
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider")
  }
  return context
}
