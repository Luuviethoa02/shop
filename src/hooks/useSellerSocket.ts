import { socketInstance } from "@/lib/api-io"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

const useSellerSocket = (sellerId: string | undefined | null) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    socketInstance.connect()

    if (sellerId) {
      socketInstance.emit("sellerJoin", { id: sellerId })
      setSocket(socketInstance)
      console.log("socket user connected")
    }

    return () => {
      socketInstance.disconnect()
    }
  }, [sellerId])

  return socket
}

export default useSellerSocket
