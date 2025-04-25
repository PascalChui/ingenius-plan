"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function getWorkspacesByUserId(userId: string) {
  try {
    const workspaces = await executeQuery(`SELECT * FROM "Workspace" WHERE "userId" = $1 ORDER BY "updatedAt" DESC`, [
      userId,
    ])
    return workspaces
  } catch (error) {
    console.error("Error fetching workspaces:", error)
    throw error
  }
}

export async function getWorkspaceById(id: string) {
  try {
    const workspace = await executeQuery(`SELECT * FROM "Workspace" WHERE id = $1`, [id])
    return workspace[0] || null
  } catch (error) {
    console.error("Error fetching workspace:", error)
    throw error
  }
}

export async function createWorkspace(data: { name: string; description?: string; userId: string }) {
  try {
    const id = `wsp_${uuidv4().substring(0, 8)}`

    await executeQuery(
      `INSERT INTO "Workspace" (id, name, description, "userId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [id, data.name, data.description || null, data.userId],
    )

    revalidatePath("/dashboard")
    return { success: true, id }
  } catch (error) {
    console.error("Error creating workspace:", error)
    return { success: false, error }
  }
}

export async function updateWorkspace(id: string, data: { name: string; description?: string }) {
  try {
    await executeQuery(
      `UPDATE "Workspace" 
       SET name = $1, description = $2, "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [data.name, data.description || null, id],
    )

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating workspace:", error)
    return { success: false, error }
  }
}

export async function deleteWorkspace(id: string) {
  try {
    await executeQuery(`DELETE FROM "Workspace" WHERE id = $1`, [id])

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting workspace:", error)
    return { success: false, error }
  }
}
