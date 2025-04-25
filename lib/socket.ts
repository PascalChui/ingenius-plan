import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

// Singleton pour le serveur Socket.IO
let io: SocketIOServer | undefined

export const getSocketServer = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!io) {
    console.log("Initializing Socket.IO server...")
    io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`)

      // Join a workspace room
      socket.on("join-workspace", (workspaceId: string) => {
        socket.join(`workspace-${workspaceId}`)
        console.log(`Socket ${socket.id} joined workspace-${workspaceId}`)
      })

      // Leave a workspace room
      socket.on("leave-workspace", (workspaceId: string) => {
        socket.leave(`workspace-${workspaceId}`)
        console.log(`Socket ${socket.id} left workspace-${workspaceId}`)
      })

      // Task updates
      socket.on("task-update", (data) => {
        socket.to(`workspace-${data.workspaceId}`).emit("task-updated", data)
      })

      // Task creation
      socket.on("task-create", (data) => {
        socket.to(`workspace-${data.workspaceId}`).emit("task-created", data)
      })

      // Task deletion
      socket.on("task-delete", (data) => {
        socket.to(`workspace-${data.workspaceId}`).emit("task-deleted", data)
      })

      // Real-time collaboration on documents
      socket.on("document-update", (data) => {
        socket.to(`workspace-${data.workspaceId}`).emit("document-updated", data)
      })

      // User presence
      socket.on("user-active", (data) => {
        socket.to(`workspace-${data.workspaceId}`).emit("user-active", {
          userId: data.userId,
          userName: data.userName,
          userImage: data.userImage,
        })
      })

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`)
      })
    })

    res.socket.server.io = io
  }

  return io
}
