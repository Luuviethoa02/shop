import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom"
import { useIsAdmin } from "@/hooks"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import Logo from "../share/Logo"
import { navLinkSeller } from "@/constants"
import SEO from "../seo"
import { useEffect, useState } from "react"
import {
  ArrowRightIcon,
  BellIcon,
  LucideIcon,
  Package2Icon,
  SearchIcon,
} from "lucide-react"
import DialogLogout from "@/features/auth/components/form-logout"
import ProgressBar from "../share/ProgressBar"
import { useAuthStore } from "@/store"
import { Seller } from "@/types/client"

const SellerLayout = () => {
  const currentUser = useAuthStore((state) => state.user)

  if (!currentUser?.sellerId) return <Navigate to="/auth/seller/register" />

  if ((currentUser?.sellerId as Seller).status === "wait")
    return <Navigate to="/auth/seller/waiting" />

  if ((currentUser?.sellerId as Seller).status === "rejected")
    return <Navigate to="/forbidden" />

  const [modalLogout, setModalLogout] = useState<boolean>(false)
  const [navLinkActive, setNavLinkActive] = useState<{
    path: string
    Icon: LucideIcon
    lable: string
  }>()

  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/seller") {
      setNavLinkActive(navLinkSeller[0])
      return
    }
    const navLinkActive = navLinkSeller.find(
      (nav) => location.pathname == nav.path
    )
    setNavLinkActive(navLinkActive)
  }, [location.pathname])

  return (
    <>
      <SEO
        title={`Seller | ${navLinkActive?.lable}`}
        description={`this is page admin shop tab ${navLinkActive?.lable}`}
      />
      <ProgressBar />
      <div className="flex min-h-screen w-full overflow-hidden">
        <aside className="hidden min-h-screen border-r bg-muted/40 lg:block">
          <div className="flex h-[60px] items-center px-6">
            <Link to="/admin" className="flex items-center gap-2 font-semibold">
              <Logo />
            </Link>
          </div>
          <nav className="grid items-start px-4 text-sm font-medium">
            {navLinkSeller.map((item, index) => (
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
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
            <Link to="#" className="lg:hidden">
              <Package2Icon className="h-6 w-6" />
              <span className="sr-only">Trang chủ</span>
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold text-lg">{`${navLinkActive?.lable}`}</h1>
            </div>
            <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  />
                </div>
              </form>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww"
                      width="32"
                      height="32"
                      className="rounded-full"
                      alt="Ảnh đại diện"
                      style={{ aspectRatio: "32/32", objectFit: "cover" }}
                    />
                    <span className="sr-only">Chuyển đổi menu người dùng</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                  <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setModalLogout(true)}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <BellIcon className="h-6 w-6" />
                    <span className="sr-only">Chuyển đổi thông báo</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[400px] overflow-y-auto">
                    <DropdownMenuItem>
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#55efc4] text-3xl flex items-center justify-center w-10 h-10">
                          😁
                        </div>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">Đơn hàng mới</div>
                            <div className="text-sm text-muted-foreground">
                              2 phút trước
                            </div>
                          </div>
                          <p>Bạn có một đơn hàng mới từ John Doe.</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#ffeaa7] text-3xl flex items-center justify-center w-10 h-10">
                          😎
                        </div>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">Đơn hàng đã gửi</div>
                            <div className="text-sm text-muted-foreground">
                              30 phút trước
                            </div>
                          </div>
                          <p>Đơn hàng #1234 đã được gửi đi.</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#fdcb6e] text-3xl flex items-center justify-center w-10 h-10">
                          🤠
                        </div>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">Đánh giá mới</div>
                            <div className="text-sm text-muted-foreground">
                              1 giờ trước
                            </div>
                          </div>
                          <p>Bạn có một đánh giá 5 sao mới từ Sarah.</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between">
                      <span>Xem tất cả</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <DialogLogout open={modalLogout} setOpen={setModalLogout} />
    </>
  )
}

export default SellerLayout
