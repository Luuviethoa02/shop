import discordSound from "@/assets/sounds/discord-notification.mp3"
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom"
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
  BellIcon,
  Dot,
  LucideIcon,
  Package2Icon,
  SearchIcon,
  X,
} from "lucide-react"
import DialogLogout from "@/features/auth/components/form-logout"
import ProgressBar from "../share/ProgressBar"
import { useAuthStore } from "@/store"
import { orderNotification, Seller } from "@/types/client"
import useSellerSocket from "@/hooks/useSellerSocket"
import { useNotificationSound } from "@/hooks"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useOrderNotificationBySellerId } from "@/features/notifications/api/order-notification"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { getInitials } from "@/lib/utils"
import { useUpdateManyStatusOrder } from "@/features/notifications/api/updateMany-status-order"
import { LIMIT_PAGE_ORDER_NOTIFICATION } from "@/features/oder/constants"
import { useGetOderDetailBySellerId } from "@/features/oder/api/get-orderDetailBySellerId"
import nProgress from "nprogress"
import { useUpdateStatusOrder } from "@/features/notifications/api/update-status-order"
import { env } from "@/config/env"

const SellerLayout = () => {
  const currentUser = useAuthStore((state) => state.user)

  if (!currentUser?._id) return <Navigate to="/" />

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
  const navigate = useNavigate()

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

  const sellerSocket = useSellerSocket((currentUser?.sellerId as Seller)?._id)
  const playNotificationSound = useNotificationSound(discordSound)
  const [page, setPage] = useState<number>(1)
  const [orderDetailId, setOrderDetailId] = useState<string>()

  const allOrderNotifications = useOrderNotificationBySellerId({
    sellerId: (currentUser?.sellerId as Seller)?._id,
    page: page,
    limit: LIMIT_PAGE_ORDER_NOTIFICATION,
  })

  const orderDetail = useGetOderDetailBySellerId({
    sellerId: (currentUser?.sellerId as Seller)?._id,
  })

  const updateManyStatus = useUpdateManyStatusOrder({
    sellerId: (currentUser?.sellerId as Seller)?._id,
    page,
    limit: LIMIT_PAGE_ORDER_NOTIFICATION,
  })

  const updateStatusOrderNotification = useUpdateStatusOrder({
    sellerId: (currentUser?.sellerId as Seller)?._id!,
    page,
    limit: LIMIT_PAGE_ORDER_NOTIFICATION,
  })

  const handleClickUpdateManyStatus = () => {
    toast.promise(
      updateManyStatus.mutateAsync({
        sellerId: (currentUser?.sellerId as Seller)?._id!,
      }),
      {
        loading: "Đang xử lý...",
        success: "Đã đánh dấu tất cả đã đọc",
        error: "Đã xảy ra lỗi",
      }
    )
  }

  const handleBackHome = () => {
    navigate("/")
  }

  const handleClickLinkNotification = (id: string, notifiId: string) => {
    console.log(notifiId)

    setOrderDetailId(id)
    updateStatusOrderNotification.mutate({
      notifiId: notifiId,
    })
  }

  useEffect(() => {
    if (orderDetailId) {
      nProgress.start()
    }
  }, [orderDetailId])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (orderDetail?.data?.data && orderDetailId) {
      navigate(`/seller/orders/${orderDetailId}`)
      nProgress.done()
    }
    if (orderDetail.error) {
      console.error("Failed to load product detail:", orderDetail.error)
      nProgress.done()
    }
  }, [orderDetail?.data?.data, orderDetail.error, orderDetailId])

  useEffect(() => {
    if (!sellerSocket) return

    if (sellerSocket) {
      sellerSocket.on("newOrder", (data: orderNotification) => {
        toast(
          `Bạn có một đơn hàng mới từ ${data.user.username} với mã đơn hàng ${data.orderDetail}`
        )
        allOrderNotifications.refetch()
        playNotificationSound()
      })

      return () => {
        sellerSocket.off("newOrder")
      }
    }
  }, [sellerSocket, currentUser?.sellerId])

  return (
    <>
      <SEO
        title={`Kênh bán hàng | ${navLinkActive?.lable || "Chi tiết đơn hàng"} `}
        description={`this is page Seller shop tab ${navLinkActive?.lable}`}
      />
      <ProgressBar />
      <Toaster />
      <div className="flex min-h-screen w-full overflow-hidden">
        <aside className="hidden min-h-screen border-r bg-muted/40 lg:block">
          <div className="flex h-[60px] items-center px-6">
            <Link
              to="/seller"
              className="flex items-center gap-2 font-semibold"
            >
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
              <h1 className="font-semibold text-lg">{`${navLinkActive?.lable || "Chi tiết đơn hàng"} `}</h1>
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
                    <Avatar className="size-8 border">
                      <AvatarImage
                        src={(currentUser.sellerId as Seller).logo}
                        alt={(currentUser.sellerId as Seller).businessName}
                      />
                      <AvatarFallback>
                        {" "}
                        {getInitials(
                          (currentUser.sellerId as Seller).businessName
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleBackHome}>
                    Trang mua hàng
                  </DropdownMenuItem>
                  <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setModalLogout(true)}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <BellIcon className="h-6 w-6" />
                      <span className="sr-only">Chuyển đổi thông báo</span>
                    </Button>
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {allOrderNotifications?.data?.data?.filter(
                        (item) => !item.isRead
                      ).length || 0}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[350px]">
                  <DropdownMenuLabel>
                    <div className="w-full flex items-center justify-between">
                      <h2>Thông báo</h2>
                      <Button
                        className={
                          (allOrderNotifications?.data?.data?.filter(
                            (item) => !item.isRead
                          ).length ?? 0) > 0
                            ? "opacity-100"
                            : "opacity-50 pointer-events-none cursor-default"
                        }
                        onClick={handleClickUpdateManyStatus}
                        variant="ghost"
                        size="sm"
                      >
                        Đánh dấu tất cả đã đọc
                      </Button>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[500px] min-h-[300px] space-y-1 overflow-y-auto">
                    {allOrderNotifications?.data?.data &&
                      allOrderNotifications?.data?.data?.length > 0 &&
                      allOrderNotifications?.data?.data.map((item) => {
                        if (!item.isRead) {
                          return (
                            <DropdownMenuItem
                              key={item._id}
                              onClick={() =>
                                handleClickLinkNotification(
                                  item?.orderDetailId?._id,
                                  item._id
                                )
                              }
                              className="bg-slate-100 hover:bg-none"
                            >
                              <div className="flex group/item items-start gap-3 w-full">
                                <div className="rounded-lg bg-[#55efc4] text-3xl flex items-center justify-center w-10 h-10">
                                  <img
                                    className="rounded-lg object-cover size-full"
                                    src={item?.orderDetailId?.color?.image}
                                    alt={item?.orderDetailId?.color?.name}
                                  />
                                </div>
                                <div className="grid gap-1 flex-1">
                                  <div className="flex items-center min-w-full">
                                    <div className="flex flex-1 items-center gap-2">
                                      <div className="font-medium text-green-500">
                                        Đơn hàng mới
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {item?.relativeTime}
                                      </div>
                                    </div>
                                    <div className="cursor-pointer w-4 text-sm group-hover/item:visible invisible text-muted-foreground">
                                      <X size={14} />
                                    </div>
                                    <Dot size={25} color="#7adeff" />
                                  </div>
                                  <p>
                                    Bạn có một đơn hàng mới từ{" "}
                                    <span className="font-semibold capitalize">
                                      {item?.userId?.username}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          )
                        }
                        return (
                          <DropdownMenuItem
                            onClick={() =>
                              handleClickLinkNotification(
                                item?.orderDetailId?._id,
                                item._id
                              )
                            }
                            key={item._id}
                          >
                            <div className="flex group/item items-start gap-3 w-full">
                              <div className="rounded-lg bg-[#55efc4] text-3xl flex items-center justify-center w-10 h-10">
                                <img
                                  className="rounded-lg object-cover size-full"
                                  src={item?.orderDetailId?.color?.image}
                                  alt={item?.orderDetailId?.color?.name}
                                />
                              </div>
                              <div className="grid gap-1 flex-1">
                                <div className="flex items-center min-w-full">
                                  <div className="flex flex-1 items-center gap-2">
                                    <div className="font-medium text-green-500">
                                      Đơn hàng mới
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {item?.relativeTime}
                                    </div>
                                  </div>
                                  <div className="cursor-pointer w-4 text-sm group-hover/item:visible invisible text-muted-foreground">
                                    <X size={14} />
                                  </div>
                                </div>
                                <p>
                                  Bạn có một đơn hàng mới từ{" "}
                                  <span className="font-semibold capitalize">
                                    {item?.userId?.username}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}

                    {allOrderNotifications?.data?.data &&
                      allOrderNotifications?.data?.data?.length === 0 && (
                        <div className="flex items-center justify-center w-full min-h-[300px]">
                          <h2>Hiện không có thông báo nào</h2>
                        </div>
                      )}
                  </div>
                  <DropdownMenuSeparator />
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
