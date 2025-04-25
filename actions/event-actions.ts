"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function getEventsByUserId(userId: string) {
  try {
    const events = await executeQuery(
      `SELECT e.*, w.name as "workspaceName"
       FROM "Event" e
       JOIN "Workspace" w ON e."workspaceId" = w.id
       WHERE e."userId" = $1
       ORDER BY e."startTime" ASC`,
      [userId],
    )
    return events
  } catch (error) {
    console.error("Error fetching events:", error)
    throw error
  }
}

export async function getEventsByWorkspaceId(workspaceId: string) {
  try {
    const events = await executeQuery(`SELECT * FROM "Event" WHERE "workspaceId" = $1 ORDER BY "startTime" ASC`, [
      workspaceId,
    ])
    return events
  } catch (error) {
    console.error("Error fetching events by workspace:", error)
    throw error
  }
}

export async function getEventById(id: string) {
  try {
    const event = await executeQuery(`SELECT * FROM "Event" WHERE id = $1`, [id])
    return event[0] || null
  } catch (error) {
    console.error("Error fetching event:", error)
    throw error
  }
}

export async function createEvent(data: {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  allDay: boolean
  userId: string
  workspaceId: string
}) {
  try {
    const id = `evt_${uuidv4().substring(0, 8)}`

    await executeQuery(
      `INSERT INTO "Event" (
        id, title, description, "startTime", "endTime", "allDay", 
        "userId", "workspaceId", "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        id,
        data.title,
        data.description || null,
        data.startTime,
        data.endTime,
        data.allDay,
        data.userId,
        data.workspaceId,
      ],
    )

    revalidatePath("/calendar")
    return { success: true, id }
  } catch (error) {
    console.error("Error creating event:", error)
    return { success: false, error }
  }
}

export async function updateEvent(
  id: string,
  data: {
    title?: string
    description?: string
    startTime?: Date
    endTime?: Date
    allDay?: boolean
  },
) {
  try {
    const updateFields = []
    const params = []
    let paramIndex = 1

    if (data.title !== undefined) {
      updateFields.push(`title = $${paramIndex}`)
      params.push(data.title)
      paramIndex++
    }

    if (data.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`)
      params.push(data.description)
      paramIndex++
    }

    if (data.startTime !== undefined) {
      updateFields.push(`"startTime" = $${paramIndex}`)
      params.push(data.startTime)
      paramIndex++
    }

    if (data.endTime !== undefined) {
      updateFields.push(`"endTime" = $${paramIndex}`)
      params.push(data.endTime)
      paramIndex++
    }

    if (data.allDay !== undefined) {
      updateFields.push(`"allDay" = $${paramIndex}`)
      params.push(data.allDay)
      paramIndex++
    }

    updateFields.push(`"updatedAt" = CURRENT_TIMESTAMP`)

    params.push(id)

    await executeQuery(
      `UPDATE "Event" 
       SET ${updateFields.join(", ")}
       WHERE id = $${paramIndex}`,
      params,
    )

    revalidatePath("/calendar")
    return { success: true }
  } catch (error) {
    console.error("Error updating event:", error)
    return { success: false, error }
  }
}

export async function deleteEvent(id: string) {
  try {
    await executeQuery(`DELETE FROM "Event" WHERE id = $1`, [id])

    revalidatePath("/calendar")
    return { success: true }
  } catch (error) {
    console.error("Error deleting event:", error)
    return { success: false, error }
  }
}
