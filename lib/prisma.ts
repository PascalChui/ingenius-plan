import { PrismaClient } from "@prisma/client"

// PrismaClient est attaché à l'objet global en développement pour éviter
// d'épuiser la limite de connexions à la base de données pendant le hot-reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Fonction utilitaire pour exécuter des requêtes SQL brutes
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    // Utiliser $queryRawUnsafe pour les requêtes SQL brutes
    const result = await prisma.$queryRawUnsafe<T>(query, ...params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
