import { addDays, subDays } from "date-fns"
import type { CalendarEvent } from "@/types/calendar-event"

// Base date for sample events (April 24, 2025)
const baseDate = new Date("2025-04-24T12:00:00")

export const sampleCalendarEvents: CalendarEvent[] = [
  // Regular events
  {
    id: "event-1",
    title: "Team Meeting",
    description: "Weekly team sync to discuss project progress",
    startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 10, 0),
    endTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 11, 0),
    category: "meeting",
    location: "Conference Room A",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 7),
    // Weekly recurring meeting
    recurrence: {
      frequency: "weekly",
      interval: 1,
      weekDays: ["TH"], // Thursday
      count: 10,
    },
  },
  {
    id: "event-2",
    title: "Lunch with Client",
    description: "Discuss new project requirements",
    startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 12, 30),
    endTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 13, 30),
    category: "appointment",
    location: "Downtown Cafe",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 3),
  },
  {
    id: "event-3",
    title: "Project Deadline",
    description: "Final submission for the Q2 project",
    startTime: addDays(baseDate, 2),
    endTime: addDays(baseDate, 2),
    allDay: true,
    category: "work",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 14),
  },
  {
    id: "event-4",
    title: "Dentist Appointment",
    description: "Regular checkup",
    startTime: addDays(baseDate, -1),
    endTime: addDays(baseDate, -1),
    category: "appointment",
    location: "Dental Clinic",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 10),
  },
  {
    id: "event-5",
    title: "Team Building",
    description: "Outdoor activities with the team",
    startTime: addDays(baseDate, 5),
    endTime: addDays(baseDate, 5),
    allDay: true,
    category: "work",
    location: "City Park",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 20),
  },
  {
    id: "event-6",
    title: "Product Demo",
    description: "Showcase new features to stakeholders",
    startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 3, 14, 0),
    endTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 3, 15, 30),
    category: "meeting",
    location: "Main Conference Room",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 5),
  },
  {
    id: "event-7",
    title: "Daily Standup",
    description: "Quick team sync",
    startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 9, 0),
    endTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 9, 15),
    category: "meeting",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 30),
    // Daily recurring meeting (weekdays only)
    recurrence: {
      frequency: "weekly",
      interval: 1,
      weekDays: ["MO", "TU", "WE", "TH", "FR"],
      endDate: addDays(baseDate, 30),
    },
  },
  {
    id: "event-8",
    title: "Gym Session",
    description: "Personal training",
    startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 18, 0),
    endTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 19, 0),
    category: "personal",
    location: "Fitness Center",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 15),
    // Weekly recurring on Monday, Wednesday, Friday
    recurrence: {
      frequency: "weekly",
      interval: 1,
      weekDays: ["MO", "WE", "FR"],
      endDate: addDays(baseDate, 60),
    },
  },
  {
    id: "event-9",
    title: "Monthly Review",
    description: "Review team performance and metrics",
    startTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), 28, 11, 0),
    endTime: new Date(baseDate.getFullYear(), baseDate.getMonth(), 28, 12, 30),
    category: "meeting",
    location: "Executive Room",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 60),
    // Monthly recurring on the last Friday
    recurrence: {
      frequency: "monthly",
      interval: 1,
      monthWeek: 5, // Last
      monthWeekDay: "FR", // Friday
      count: 6,
    },
  },
  {
    id: "event-10",
    title: "Birthday",
    description: "Annual celebration",
    startTime: new Date(baseDate.getFullYear(), 7, 15), // August 15
    endTime: new Date(baseDate.getFullYear(), 7, 15),
    allDay: true,
    category: "personal",
    createdBy: "user-1",
    createdAt: subDays(baseDate, 90),
    // Yearly recurring
    recurrence: {
      frequency: "yearly",
      interval: 1,
    },
  },
]
