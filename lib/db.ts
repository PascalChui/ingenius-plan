import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Vérifier que l'URL de la base de données est définie
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined")
}

// Créer un client SQL avec l'URL de la base de données Neon
const sql = neon(process.env.DATABASE_URL)

// Créer un client Drizzle
export const db = drizzle(sql)

// Fonction utilitaire pour exécuter des requêtes SQL brutes
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    const result = await sql(query, params)
    return result as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
