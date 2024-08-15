import { Navigate, Outlet } from "react-router-dom"
import { Footer, Header } from "../sections"
import Progress from "../share/Progress"
import { useIsAdmin } from "@/hooks"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = !!localStorage.getItem("accessToken")
  if (!user) return <Navigate to="/not-found" />
  return children
}

const MainLayout = () => {
  const isAdmin = useIsAdmin()
  if (isAdmin) return <Navigate to="/admin" />
  return (
    <>
      <Header />
      <Progress />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
