"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function getTasksByUserId(userId: string) {
  try {
    const tasks = await executeQuery(
      `SELECT t.*, w.name as "workspaceName"
       FROM "Task" t
       JOIN "Workspace" w ON t."workspaceId" = w.id
       WHERE t."userId" = $1
       ORDER BY t."updatedAt" DESC`,
      [userId],
    )
    return tasks
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

export async function getTasksByWorkspaceId(workspaceId: string) {
  try {
    const tasks = await executeQuery(`SELECT * FROM "Task" WHERE "workspaceId" = $1 ORDER BY "updatedAt" DESC`, [
      workspaceId,
    ])
    return tasks
  } catch (error) {
    console.error("Error fetching tasks by workspace:", error)
    throw error
  }
}

export async function getTaskById(id: string) {
  try {
    const task = await executeQuery(`SELECT * FROM "Task" WHERE id = $1`, [id])

    if (task[0]) {
      // Get subtasks
      const subtasks = await executeQuery(`SELECT * FROM "Subtask" WHERE "taskId" = $1 ORDER BY "createdAt" ASC`, [id])

      // Get tags
      const tags = await executeQuery(
        `SELECT t.* 
         FROM "Tag" t
         JOIN "_TagToTask" tt ON t.id = tt."A"
         WHERE tt."B" = $1`,
        [id],
      )

      return { ...task[0], subtasks, tags }
    }

    return null
  } catch (error) {
    console.error("Error fetching task:", error)
    throw error
  }
}

export async function createTask(data: {
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: Date
  userId: string
  workspaceId: string
  boardId?: string
}) {
  try {
    const id = `tsk_${uuidv4().substring(0, 8)}`

    await executeQuery(
      `INSERT INTO "Task" (
        id, title, description, status, priority, "dueDate", 
        "userId", "workspaceId", "boardId", "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        id,
        data.title,
        data.description || null,
        data.status,
        data.priority,
        data.dueDate || null,
        data.userId,
        data.workspaceId,
        data.boardId || null,
      ],
    )

    revalidatePath("/tasks")
    return { success: true, id }
  } catch (error) {
    console.error("Error creating task:", error)
    return { success: false, error }
  }
}

export async function updateTask(
  id: string,
  data: {
    title?: string
    description?: string
    status?: string
    priority?: string
    dueDate?: Date
    boardId?: string
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

    if (data.status !== undefined) {
      updateFields.push(`status = $${paramIndex}`)
      params.push(data.status)
      paramIndex++
    }

    if (data.priority !== undefined) {
      updateFields.push(`priority = $${paramIndex}`)
      params.push(data.priority)
      paramIndex++
    }

    if (data.dueDate !== undefined) {
      updateFields.push(`"dueDate" = $${paramIndex}`)
      params.push(data.dueDate)
      paramIndex++
    }

    if (data.boardId !== undefined) {
      updateFields.push(`"boardId" = $${paramIndex}`)
      params.push(data.boardId)
      paramIndex++
    }

    updateFields.push(`"updatedAt" = CURRENT_TIMESTAMP`)

    params.push(id)

    await executeQuery(
      `UPDATE "Task" 
       SET ${updateFields.join(", ")}
       WHERE id = $${paramIndex}`,
      params,
    )

    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Error updating task:", error)
    return { success: false, error }
  }
}

export async function deleteTask(id: string) {
  try {
    await executeQuery(`DELETE FROM "Task" WHERE id = $1`, [id])

    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error }
  }
}

export async function addSubtask(taskId: string, title: string) {
  try {
    const id = `stsk_${uuidv4().substring(0, 8)}`

    await executeQuery(
      `INSERT INTO "Subtask" (id, title, completed, "taskId", "createdAt", "updatedAt")
       VALUES ($1, $2, false, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [id, title, taskId],
    )

    revalidatePath("/tasks")
    return { success: true, id }
  } catch (error) {
    console.error("Error adding subtask:", error)
    return { success: false, error }
  }
}

export async function updateSubtaskStatus(id: string, completed: boolean) {
  try {
    await executeQuery(
      `UPDATE "Subtask" 
       SET completed = $1, "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [completed, id],
    )

    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Error updating subtask status:", error)
    return { success: false, error }
  }
}
