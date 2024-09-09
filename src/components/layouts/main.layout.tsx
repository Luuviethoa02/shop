import discordSound from "@/assets/sounds/discord-notification.mp3"
import { Navigate, Outlet } from "react-router-dom"
import { Footer, Header } from "../sections"
import { useIsAdmin, useNotificationSound } from "@/hooks"
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from "react"
import ProgressBar from "../share/ProgressBar"
import { useAuthStore } from "@/store"
import { toast } from "sonner"
import useSocket from "@/hooks/useSocket"
import { commentsResponse } from "@/types/api"
import { Comments, CommentsNotification } from "@/types/client"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = !!localStorage.getItem("accessToken")
  if (!user) return <Navigate to="/not-found" />
  return children
}

const MainLayout = () => {
  const isAdmin = useIsAdmin()
  if (isAdmin) return <Navigate to="/admin" />
  const currentUser = useAuthStore((state) => state.user)
  const socket = useSocket(currentUser?._id)
  const playNotificationSound = useNotificationSound(discordSound)

  useEffect(() => {
    if (!socket) return

    if (socket) {
      socket.on("newNotification", (notification: CommentsNotification) => {
        toast(
          `${notification.userId.username} cũng đã bình luận về sản phẩm ${notification.productId.name}`
        )
        playNotificationSound()
      })

      return () => {
        socket.off("newNotification")
      }
    }
  }, [socket, currentUser?._id])

  return (
    <>
      <ProgressBar color={"#F97316"} />
      <Header />
      <main>
        <Outlet />
      </main>
      <Toaster />
      <Footer />
    </>
  )
}

export default MainLayout
