import { neon } from "@neondatabase/serverless"

// Vérifier que l'URL de la base de données est définie
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.warn("DATABASE_URL or POSTGRES_URL environment variable is not defined")
}

// Utiliser DATABASE_URL ou POSTGRES_URL
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || ""

// Créer un client SQL avec l'URL de la base de données Neon
export const sql = neon(databaseUrl)

// Fonction utilitaire pour exécuter des requêtes SQL brutes
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    console.log("Executing query:", query)
    console.log("With params:", params)
    const result = await sql(query, params)
    return result as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
