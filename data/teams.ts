import type { Team, User, TeamActivity, LoginHistory, ActiveSession } from "@/types/team"

// Mock function to simulate password hashing
// In a real app, this would use a secure hashing algorithm like bcrypt
function mockHashPassword(password: string): string {
  return `hashed_${password}_${Date.now()}`
}

export const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john-doe.jpg",
    role: "admin",
    title: "Project Manager",
    department: "Product",
    joinedAt: "2024-01-15",
    lastActive: "2025-04-24T08:30:00Z",
    status: "active",
    twoFactorEnabled: true,
    twoFactorSecret: "JBSWY3DPEHPK3PXP", // This would be encrypted in a real app
    backupCodes: [
      "12345-67890",
      "abcde-fghij",
      "klmno-pqrst",
      "uvwxy-z1234",
      "56789-abcde",
      "fghij-klmno",
      "pqrst-uvwxy",
      "z1234-56789",
    ],
    passwordHistory: [
      {
        hashedPassword: "hashed_previous_password_1",
        changedAt: "2025-03-15T10:30:00Z",
      },
      {
        hashedPassword: "hashed_previous_password_2",
        changedAt: "2025-02-10T14:45:00Z",
      },
      {
        hashedPassword: "hashed_previous_password_3",
        changedAt: "2025-01-05T09:15:00Z",
      },
      {
        hashedPassword: "hashed_previous_password_4",
        changedAt: "2024-12-20T16:30:00Z",
      },
      {
        hashedPassword: "hashed_previous_password_5",
        changedAt: "2024-11-15T11:20:00Z",
      },
    ],
    passwordLastChanged: "2025-03-15T10:30:00Z",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/avatars/jane-smith.jpg",
    role: "member",
    title: "Senior Developer",
    department: "Engineering",
    joinedAt: "2024-02-10",
    lastActive: "2025-04-23T16:45:00Z",
    status: "active",
    twoFactorEnabled: false,
    passwordHistory: [
      {
        hashedPassword: "hashed_previous_password_1",
        changedAt: "2025-02-20T15:10:00Z",
      },
      {
        hashedPassword: "hashed_previous_password_2",
        changedAt: "2025-01-15T09:30:00Z",
      },
    ],
    passwordLastChanged: "2025-02-20T15:10:00Z",
  },
  {
    id: "user-3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    avatar: "/avatars/robert-johnson.jpg",
    role: "member",
    title: "UI/UX Designer",
    department: "Design",
    joinedAt: "2024-03-05",
    lastActive: "2025-04-24T10:15:00Z",
    status: "active",
    twoFactorEnabled: false,
    passwordHistory: [
      {
        hashedPassword: "hashed_previous_password_1",
        changedAt: "2025-03-10T11:45:00Z",
      },
    ],
    passwordLastChanged: "2025-03-10T11:45:00Z",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "/avatars/emily-davis.jpg",
    role: "member",
    title: "Content Strategist",
    department: "Marketing",
    joinedAt: "2024-03-20",
    lastActive: "2025-04-22T14:30:00Z",
    status: "active",
    twoFactorEnabled: true,
    twoFactorSecret: "KRSXG5CTMVRXEZLU",
    passwordHistory: [
      {
        hashedPassword: "hashed_previous_password_1",
        changedAt: "2025-04-01T10:20:00Z",
      },
      {
        hashedPassword: "hashed_previous_password_2",
        changedAt: "2025-02-25T14:30:00Z",
      },
      {
        hashedPassword: "hashed_previous_password_3",
        changedAt: "2025-01-10T09:15:00Z",
      },
    ],
    passwordLastChanged: "2025-04-01T10:20:00Z",
  },
  {
    id: "user-5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    avatar: "/avatars/michael-brown.jpg",
    role: "guest",
    title: "External Consultant",
    joinedAt: "2024-04-10",
    lastActive: "2025-04-20T09:45:00Z",
    status: "active",
    twoFactorEnabled: false,
    passwordHistory: [],
    passwordLastChanged: "2024-04-10T09:45:00Z",
  },
]

export const teams: Team[] = [
  {
    id: "team-1",
    name: "Product Development",
    description: "Team responsible for developing and maintaining the product",
    createdAt: "2024-01-10",
    updatedAt: "2025-04-15",
    ownerId: "user-1",
    avatar: "/team-avatars/product-dev.jpg",
    members: [
      {
        userId: "user-1",
        teamId: "team-1",
        role: "owner",
        joinedAt: "2024-01-10",
      },
      {
        userId: "user-2",
        teamId: "team-1",
        role: "admin",
        joinedAt: "2024-01-15",
      },
      {
        userId: "user-3",
        teamId: "team-1",
        role: "member",
        joinedAt: "2024-02-01",
      },
    ],
  },
  {
    id: "team-2",
    name: "Marketing",
    description: "Team responsible for marketing and promotion",
    createdAt: "2024-02-05",
    updatedAt: "2025-04-10",
    ownerId: "user-4",
    avatar: "/team-avatars/marketing.jpg",
    members: [
      {
        userId: "user-4",
        teamId: "team-2",
        role: "owner",
        joinedAt: "2024-02-05",
      },
      {
        userId: "user-1",
        teamId: "team-2",
        role: "member",
        joinedAt: "2024-02-10",
      },
      {
        userId: "user-5",
        teamId: "team-2",
        role: "guest",
        joinedAt: "2024-04-10",
      },
    ],
  },
]

export const teamActivities: TeamActivity[] = [
  {
    id: "activity-1",
    teamId: "team-1",
    userId: "user-2",
    type: "task_created",
    entityId: "task-1",
    entityType: "task",
    message: "Jane Smith created task 'Create app wireframes'",
    createdAt: "2025-04-15T09:30:00Z",
  },
  {
    id: "activity-2",
    teamId: "team-1",
    userId: "user-1",
    type: "task_assigned",
    entityId: "task-1",
    entityType: "task",
    message: "John Doe assigned task 'Create app wireframes' to Robert Johnson",
    createdAt: "2025-04-15T10:15:00Z",
  },
  {
    id: "activity-3",
    teamId: "team-1",
    userId: "user-3",
    type: "comment_added",
    entityId: "task-1",
    entityType: "comment",
    message: "Robert Johnson commented on task 'Create app wireframes'",
    createdAt: "2025-04-16T11:45:00Z",
    metadata: {
      comment: "I'll start working on this today and should have a draft by tomorrow.",
    },
  },
  {
    id: "activity-4",
    teamId: "team-1",
    userId: "user-3",
    type: "task_updated",
    entityId: "task-1",
    entityType: "task",
    message: "Robert Johnson updated task 'Create app wireframes' status to 'in_progress'",
    createdAt: "2025-04-16T13:20:00Z",
  },
  {
    id: "activity-5",
    teamId: "team-2",
    userId: "user-4",
    type: "task_created",
    entityId: "task-6",
    entityType: "task",
    message: "Emily Davis created task 'Prepare client presentation'",
    createdAt: "2025-04-21T14:30:00Z",
  },
]

// Add login history data
export const loginHistory: LoginHistory[] = [
  {
    id: "login-1",
    userId: "user-1",
    timestamp: "2025-04-24T08:30:00Z",
    ipAddress: "192.168.1.1",
    device: "Desktop",
    browser: "Chrome 112.0.5615.138",
    location: "San Francisco, CA, USA",
    status: "success",
  },
  {
    id: "login-2",
    userId: "user-1",
    timestamp: "2025-04-23T14:15:00Z",
    ipAddress: "192.168.1.1",
    device: "Desktop",
    browser: "Chrome 112.0.5615.138",
    location: "San Francisco, CA, USA",
    status: "success",
  },
  {
    id: "login-3",
    userId: "user-1",
    timestamp: "2025-04-22T09:45:00Z",
    ipAddress: "192.168.1.1",
    device: "Desktop",
    browser: "Chrome 112.0.5615.138",
    location: "San Francisco, CA, USA",
    status: "success",
  },
  {
    id: "login-4",
    userId: "user-1",
    timestamp: "2025-04-21T18:30:00Z",
    ipAddress: "203.0.113.42",
    device: "Mobile",
    browser: "Safari Mobile 15.4",
    location: "San Francisco, CA, USA",
    status: "success",
  },
  {
    id: "login-5",
    userId: "user-1",
    timestamp: "2025-04-20T12:10:00Z",
    ipAddress: "198.51.100.73",
    device: "Tablet",
    browser: "Safari 15.4",
    location: "San Francisco, CA, USA",
    status: "success",
  },
  {
    id: "login-6",
    userId: "user-1",
    timestamp: "2025-04-19T22:05:00Z",
    ipAddress: "87.65.43.21",
    device: "Unknown",
    browser: "Unknown",
    location: "Moscow, Russia",
    status: "failed",
    failureReason: "Invalid password",
  },
  {
    id: "login-7",
    userId: "user-1",
    timestamp: "2025-04-19T22:03:00Z",
    ipAddress: "87.65.43.21",
    device: "Unknown",
    browser: "Unknown",
    location: "Moscow, Russia",
    status: "failed",
    failureReason: "Invalid password",
  },
  {
    id: "login-8",
    userId: "user-1",
    timestamp: "2025-04-18T16:45:00Z",
    ipAddress: "192.168.1.1",
    device: "Desktop",
    browser: "Chrome 112.0.5615.138",
    location: "San Francisco, CA, USA",
    status: "success",
  },
]

// Add active sessions data
export const activeSessions: ActiveSession[] = [
  {
    id: "session-1",
    userId: "user-1",
    deviceName: "MacBook Pro",
    browser: "Chrome 112.0.5615.138",
    operatingSystem: "macOS 12.3.1",
    ipAddress: "192.168.1.1",
    location: "San Francisco, CA, USA",
    lastActive: "2025-04-24T08:30:00Z",
    createdAt: "2025-04-24T08:15:00Z",
  },
  {
    id: "session-2",
    userId: "user-1",
    deviceName: "iPhone 13",
    browser: "Safari Mobile 15.4",
    operatingSystem: "iOS 15.4.1",
    ipAddress: "203.0.113.42",
    location: "San Francisco, CA, USA",
    lastActive: "2025-04-21T18:30:00Z",
    createdAt: "2025-04-21T18:30:00Z",
  },
  {
    id: "session-3",
    userId: "user-1",
    deviceName: "iPad Pro",
    browser: "Safari 15.4",
    operatingSystem: "iPadOS 15.4.1",
    ipAddress: "198.51.100.73",
    location: "San Francisco, CA, USA",
    lastActive: "2025-04-20T12:10:00Z",
    createdAt: "2025-04-20T12:10:00Z",
  },
]

// Helper function to get user by ID
export function getUserById(userId: string): User | undefined {
  return users.find((user) => user.id === userId)
}

// Helper function to get team by ID
export function getTeamById(teamId: string): Team | undefined {
  return teams.find((team) => team.id === teamId)
}

// Helper function to get team members with user details
export function getTeamMembersWithDetails(teamId: string): (User & { teamRole: string })[] {
  const team = getTeamById(teamId)
  if (!team) return []

  return team.members
    .map((member) => {
      const user = getUserById(member.userId)
      if (!user) return null
      return {
        ...user,
        teamRole: member.role,
      }
    })
    .filter((member): member is User & { teamRole: string } => member !== null)
}

// Helper function to get teams for a user
export function getTeamsForUser(userId: string): Team[] {
  return teams.filter((team) => team.members.some((member) => member.userId === userId))
}

// Helper function to get team activities
export function getTeamActivities(teamId: string, limit = 10): TeamActivity[] {
  return teamActivities
    .filter((activity) => activity.teamId === teamId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// Helper function to get login history for a user
export function getLoginHistoryForUser(userId: string, limit = 10): LoginHistory[] {
  return loginHistory
    .filter((login) => login.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

// Helper function to get active sessions for a user
export function getActiveSessionsForUser(userId: string): ActiveSession[] {
  return activeSessions
    .filter((session) => session.userId === userId)
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
}

// Helper function to check if a password has been used before
export function isPasswordPreviouslyUsed(userId: string, password: string): boolean {
  const user = getUserById(userId)
  if (!user) return false

  // In a real app, this would hash the password and compare with stored hashes
  const mockHashedPassword = mockHashPassword(password)

  // Check if the password matches any in the history
  // In a real app, this would use a secure comparison method
  return user.passwordHistory.some((entry) => {
    // Simulate password comparison (in reality, this would use a secure comparison)
    // This is just for demonstration purposes
    return entry.hashedPassword.includes(password)
  })
}

// Helper function to add a password to history
export function addPasswordToHistory(userId: string, password: string, maxHistorySize = 5): void {
  const user = getUserById(userId)
  if (!user) return

  const now = new Date().toISOString()
  const hashedPassword = mockHashPassword(password)

  // Add new password to history
  user.passwordHistory.unshift({
    hashedPassword,
    changedAt: now,
  })

  // Trim history to max size
  if (user.passwordHistory.length > maxHistorySize) {
    user.passwordHistory = user.passwordHistory.slice(0, maxHistorySize)
  }

  // Update last changed timestamp
  user.passwordLastChanged = now
}
