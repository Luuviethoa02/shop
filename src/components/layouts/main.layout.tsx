import { Navigate, Outlet } from "react-router-dom"
import { Footer, Header } from "../sections"
import { useIsAdmin } from "@/hooks"
import { Toaster } from "@/components/ui/sonner"
import { useEffect, useRef, useState } from "react"
import ProgressBar from "../share/ProgressBar"
import { socket } from "@/lib/api-io"
import { toast } from "sonner"
import { useAuthStore } from "@/store"
import { useScroll } from "react-use"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = !!localStorage.getItem("accessToken")
  if (!user) return <Navigate to="/not-found" />
  return children
}

const MainLayout = () => {
  const isAdmin = useIsAdmin()
  const currentUser = useAuthStore((state) => state.user)
  const user = !!localStorage.getItem("accessToken")

  const contentRef = useRef(null)
  const { y } = useScroll(contentRef)
  const [isBlurred, setIsBlurred] = useState(false)
  console.log(isBlurred)

  if (isAdmin) return <Navigate to="/admin" />

  useEffect(() => {
    socket.connect()

    if (currentUser?._id !== "") {
      // Tham gia vào phòng với ID người dùng
      console.log("đã join", currentUser?._id)

      socket.emit("join", { id: currentUser?._id, name: currentUser?.username })
    }
    socket.on("newNotification", (notification) => {
      console.log(notification)

      // Hiển thị toast thông báo
      toast(`Bạn có thông báo mới từ sản phẩm ${notification.productId}`)
    })

    return () => {
      socket.off("newNotification")
      socket.disconnect()
    }
  }, [user, currentUser?._id])

  useEffect(() => {
    const handleScroll = () => {
      if (y > 80) {
        setIsBlurred(true)
      } else {
        setIsBlurred(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <ProgressBar color={"#F97316"} />
      <Header />
      <main
        ref={contentRef}
        className={`transition-all filter duration-100 ease-in-out ${isBlurred ? "blur-lg" : ""}`}
      >
        <Outlet />
      </main>
      <Toaster />
      <Footer />
    </>
  )
}

export default MainLayout
