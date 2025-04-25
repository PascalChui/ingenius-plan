export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "member" | "guest"
  title?: string
  department?: string
  joinedAt: string
  lastActive?: string
  status: "active" | "inactive" | "pending"
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  backupCodes?: string[]
  passwordHistory: PasswordHistoryEntry[]
  passwordLastChanged?: string
}

export interface PasswordHistoryEntry {
  // In a real app, this would be a securely hashed password
  hashedPassword: string
  changedAt: string
}

export interface Team {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  ownerId: string
  members: TeamMember[]
  avatar?: string
}

export interface TeamMember {
  userId: string
  teamId: string
  role: "owner" | "admin" | "member" | "guest"
  joinedAt: string
}

export interface TeamInvitation {
  id: string
  teamId: string
  email: string
  role: "admin" | "member" | "guest"
  status: "pending" | "accepted" | "declined"
  invitedBy: string
  invitedAt: string
  expiresAt: string
}

export interface TeamActivity {
  id: string
  teamId: string
  userId: string
  type: "task_created" | "task_updated" | "task_completed" | "task_assigned" | "member_joined" | "comment_added"
  entityId?: string
  entityType?: "task" | "project" | "comment"
  message: string
  createdAt: string
  metadata?: Record<string, any>
}

export interface LoginHistory {
  id: string
  userId: string
  timestamp: string
  ipAddress: string
  device: string
  browser: string
  location: string
  status: "success" | "failed"
  failureReason?: string
}

export interface ActiveSession {
  id: string
  userId: string
  deviceName: string
  browser: string
  operatingSystem: string
  ipAddress: string
  location: string
  lastActive: string
  createdAt: string
}
