import {
  Link,
  Navigate,
  NavLink,
  useLocation,
  useParams,
} from "react-router-dom"

import { navLinkProfiles } from "@/constants"
import SEO from "../seo"
import { useEffect, useState } from "react"
import { LucideIcon, PencilLine } from "lucide-react"
import ProgressBar from "../share/ProgressBar"
import { useAuthStore } from "@/store"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { getInitials } from "@/lib/utils"

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useAuthStore((state) => state.user)

  if (!currentUser?._id) return <Navigate to="/" />

  const [navLinkActive, setNavLinkActive] = useState<{
    path: string
    Icon: LucideIcon
    lable: string
  }>()

  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/profile") {
      setNavLinkActive(navLinkProfiles[0])
      return
    }
    const navLinkActive = navLinkProfiles.find(
      (nav) => location.pathname == nav.path
    )
    setNavLinkActive(navLinkActive)
  }, [location.pathname])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO
        title={`Thông tin | ${navLinkActive?.lable || "Chi tiết đơn hàng"}`}
        description={`this is page profile shop tab ${navLinkActive?.lable}`}
      />
      <ProgressBar />
      <div className="flex min-h-screen w-full overflow-hidden mt-10">
        <aside className="hidden min-h-screen lg:block">
          <div className="flex items-center gap-3 mb-10 border-b-[1px] pb-4">
            <Avatar className="size-11 border">
              <AvatarImage src={currentUser?.img} alt={currentUser?.username} />
              <AvatarFallback>
                {" "}
                {getInitials(currentUser?.username)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h4 className="scroll-m-20 text-base font-semibold tracking-tight">
                {currentUser.username}
              </h4>
              <div className="flex items-center gap-2">
                <PencilLine color="#757575" size={14} />
                <Link
                  to={"/profile/account"}
                  className="text-base font-normal text-muted-foreground"
                >
                  Sửa hồ sơ
                </Link>
              </div>
            </div>
          </div>
          <nav className="grid items-start px-4 text-sm font-medium">
            {navLinkProfiles.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary ${isActive ? "bg-primary text-primary-foreground hover:text-secondary" : "text-muted-foreground bg-none"}`
                }
              >
                {<item.Icon className="h-4 w-4" />}
                {item.lable}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex flex-1 flex-col">
          <main className="flex-1 max-sm:ml-0 ml-10">{children}</main>
        </div>
      </div>
    </>
  )
}

export default ProfileLayout
