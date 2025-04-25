"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getUserById(id: string) {
  try {
    const user = await executeQuery(`SELECT * FROM "User" WHERE id = $1`, [id])
    return user[0] || null
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await executeQuery(`SELECT * FROM "User" WHERE email = $1`, [email])
    return user[0] || null
  } catch (error) {
    console.error("Error fetching user by email:", error)
    throw error
  }
}

export async function updateUserSettings(userId: string, settings: any) {
  try {
    await executeQuery(
      `UPDATE "Settings" 
       SET theme = $1, language = $2, "notificationsEnabled" = $3, 
           "pomodoroDuration" = $4, "shortBreakDuration" = $5, 
           "longBreakDuration" = $6, "pomodorosUntilLongBreak" = $7, 
           "updatedAt" = CURRENT_TIMESTAMP
       WHERE "userId" = $8`,
      [
        settings.theme,
        settings.language,
        settings.notificationsEnabled,
        settings.pomodoroDuration,
        settings.shortBreakDuration,
        settings.longBreakDuration,
        settings.pomodorosUntilLongBreak,
        userId,
      ],
    )

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error updating user settings:", error)
    return { success: false, error }
  }
}
