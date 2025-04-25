export type EventCategory =
  | "work"
  | "personal"
  | "meeting"
  | "appointment"
  | "holiday"
  | "reminder"
  | "booking"
  | "other"

export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly"

export type WeekDay = "SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA"

export interface RecurrencePattern {
  frequency: RecurrenceFrequency
  interval: number
  weekDays?: WeekDay[]
  monthDay?: number
  monthWeek?: number
  monthWeekDay?: WeekDay
  endDate?: Date
  count?: number
  exceptions?: Date[]
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  allDay?: boolean
  location?: string
  category: EventCategory
  recurrence?: RecurrencePattern
  recurrenceId?: string
  isException?: boolean
  createdBy: string
  createdAt: Date
  updatedAt?: Date
  calendarId: string
}

export type CalendarPermission = "view" | "edit" | "admin"

export interface CalendarShare {
  id: string
  calendarId: string
  sharedWith: string
  shareType: "user" | "team"
  permission: CalendarPermission
  sharedBy: string
  sharedAt: Date
  updatedAt?: Date
}

export interface Calendar {
  id: string
  name: string
  ownerId: string
  color: string
  isDefault: boolean
  isShared: boolean
  visibility: "private" | "shared"
  createdAt: Date
  ownerName?: string
}
