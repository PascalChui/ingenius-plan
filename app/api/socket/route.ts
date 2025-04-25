import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  // Cette route est juste pour initialiser la connexion WebSocket
  // L'initialisation réelle se fait dans le middleware ou dans les pages
  return NextResponse.json({ success: true, message: "Socket server ready" })
}
