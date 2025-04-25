import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Gérer les requêtes WebSocket
  if (request.nextUrl.pathname.startsWith("/api/socket")) {
    // Permettre les connexions WebSocket
    return NextResponse.next()
  }

  return NextResponse.next()
}
