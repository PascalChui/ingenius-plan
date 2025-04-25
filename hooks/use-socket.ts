"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

export function useSocket(workspaceId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    // Initialiser la connexion socket
    const socketInit = async () => {
      try {
        // S'assurer que le serveur socket est prêt
        await fetch("/api/socket")

        // Créer une instance socket avec le bon chemin
        const socketInstance = io({
          path: "/api/socket",
          addTrailingSlash: false,
        })

        socketInstance.on("connect", () => {
          console.log("Socket connected")
          setIsConnected(true)

          // Rejoindre la salle de l'espace de travail si workspaceId est fourni
          if (workspaceId) {
            socketInstance.emit("join-workspace", workspaceId)

            // Envoyer les informations de présence de l'utilisateur
            if (session?.user) {
              socketInstance.emit("user-active", {
                workspaceId,
                userId: session.user.id,
                userName: session.user.name,
                userImage: session.user.image,
              })
            }
          }
        })

        socketInstance.on("disconnect", () => {
          console.log("Socket disconnected")
          setIsConnected(false)
        })

        socketInstance.on("connect_error", (err) => {
          console.error("Socket connection error:", err)
          setIsConnected(false)
        })

        setSocket(socketInstance)

        return () => {
          if (workspaceId) {
            socketInstance.emit("leave-workspace", workspaceId)
          }
          socketInstance.disconnect()
        }
      } catch (error) {
        console.error("Error initializing socket:", error)
        return null
      }
    }

    socketInit()

    return () => {
      if (socket) {
        if (workspaceId) {
          socket.emit("leave-workspace", workspaceId)
        }
        socket.disconnect()
      }
    }
  }, [workspaceId, session])

  return { socket, isConnected }
}
