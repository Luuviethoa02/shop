import { socketInstance } from "@/lib/api-io"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

const useSocket = (userId: string | undefined) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    socketInstance.connect()

    if (userId) {
      socketInstance.emit("join", { id: userId })
      setSocket(socketInstance)
      console.log("socket connected")
    }

    return () => {
      socketInstance.disconnect()
    }
  }, [userId])

  return socket
}

export default useSocket
