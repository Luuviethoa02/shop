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
import { navLinkAdmin } from "@/constants"
import SEO from "../seo"
import { useEffect, useState } from "react"
import { LucideIcon } from "lucide-react"
import Progress from "../share/Progress"
import DialogLogout from "@/features/auth/components/form-logout"

const AdminLayout = () => {
  const [modalLogout, setModalLogout] = useState<boolean>(false)

  const isAdmin = useIsAdmin()
  const [navLinkActive, setNavLinkActive] = useState<{
    path: string
    Icon: LucideIcon
    lable: string
  }>()

  if (!isAdmin || isAdmin === undefined || isAdmin === null)
    return <Navigate to="/forbidden" />

  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/admin") {
      setNavLinkActive(navLinkAdmin[0])
      return
    }
    const navLinkActive = navLinkAdmin.find(
      (nav) => location.pathname == nav.path
    )
    setNavLinkActive(navLinkActive)
  }, [location.pathname])

  return (
    <>
      <Progress />
      <SEO
        title={`admin | ${navLinkActive?.lable}`}
        description={`this is page admin shop tab ${navLinkActive?.lable}`}
      />
      <div className="flex min-h-screen w-full overflow-hidden">
        <aside className="hidden min-h-screen border-r bg-muted/40 lg:block">
          <div className="flex h-[60px] items-center px-6">
            <Link to="/admin" className="flex items-center gap-2 font-semibold">
              <Logo />
              <span>Cửa hàng</span>
            </Link>
          </div>
          <nav className="grid items-start px-4 text-sm font-medium">
            {navLinkAdmin.map((item, index) => (
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

function ArrowRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function BellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function Package2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export default AdminLayout
