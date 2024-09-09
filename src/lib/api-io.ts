import { env } from "@/config/env"
import { io } from "socket.io-client"

export const socketInstance = io(env.API_IO_URL)
