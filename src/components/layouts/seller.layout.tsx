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
import { MouseEvent, useEffect, useState } from "react"
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
import { OrderNotification, orderNotification, Seller } from "@/types/client"
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
import { Skeleton } from "../ui/skeleton"
import { useGetOderDetailBySellerIdAndId } from "@/features/oder/api/getOrderDetail-by-id"
import { useDeletesOrderNotification } from "@/features/notifications/api/delete-status-order"

const maxPage = 4

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
  const [hasMore, setHasMore] = useState(true)

  const [allOrderNotifications, setAllOrderNotifications] = useState<
    OrderNotification[]
  >([])

  const allOrderNotificationsApi = useOrderNotificationBySellerId({
    sellerId: (currentUser?.sellerId as Seller)?._id,
    page: page,
    limit: LIMIT_PAGE_ORDER_NOTIFICATION,
  })

  const deleteNotification = useDeletesOrderNotification(
    (currentUser?.sellerId as Seller)?._id,
    page,
    LIMIT_PAGE_ORDER_NOTIFICATION
  )

  const handleBtndeleteNotification = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    id: string
  ) => {
    event.stopPropagation()
    event.preventDefault()
    deleteNotification.mutate(id)
  }

  useEffect(() => {
    if (allOrderNotificationsApi?.data?.data) {
      setAllOrderNotifications((prevNotification) => [
        ...prevNotification,
        ...allOrderNotificationsApi?.data.data.filter(
          (notification) => !prevNotification.includes(notification)
        ),
      ])
      if (page >= maxPage) {
        setHasMore(false)
      }
    }
  }, [allOrderNotificationsApi?.data?.data])

  const loadMoreNotification = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const orderDetailApi = useGetOderDetailBySellerIdAndId({
    sellerId: (currentUser?.sellerId as Seller)?._id,
    orderDetailId: orderDetailId,
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

  const handleClickLinkNotification = (id: string, item: OrderNotification) => {
    if (item.isRead) {
      setOrderDetailId(id)
      return
    }
    updateStatusOrderNotification.mutate({
      notifiId: item._id,
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
    if (orderDetailApi?.data?.data && orderDetailId) {
      navigate(`/seller/orders/${orderDetailId}`)
      nProgress.done()
    }
    if (orderDetailApi.error) {
      console.error("Failed to load product detail:", orderDetailApi.error)
      nProgress.done()
    }
  }, [orderDetailApi?.data?.data, orderDetailApi.error, orderDetailId])

  useEffect(() => {
    if (!sellerSocket) return

    if (sellerSocket) {
      sellerSocket.on("newOrder", (data: orderNotification) => {
        toast(
          `Bạn có một đơn hàng mới từ ${data.user.username} với mã đơn hàng ${data.orderDetail}`
        )
        allOrderNotificationsApi.refetch()
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
                  `flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary ${
                    isActive
                      ? "bg-primary text-primary-foreground hover:text-secondary"
                      : "text-muted-foreground bg-none"
                  }`
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
                        className="object-cover size-full"
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
                      {allOrderNotificationsApi?.data?.data?.filter(
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
                          (allOrderNotificationsApi?.data?.data?.filter(
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
                    <div className="flex flex-wrap gap-y-1">
                      {allOrderNotificationsApi.status === "pending" &&
                        page === 1 &&
                        Array.from({
                          length: LIMIT_PAGE_ORDER_NOTIFICATION,
                        }).map((_, index) => (
                          <Skeleton key={index} className="h-6 w-full" />
                        ))}

                      {allOrderNotifications.map((item, index) => {
                        const uniqueKey = `${item._id}-${index}`
                        if (!item.isRead) {
                          return (
                            <DropdownMenuItem
                              key={uniqueKey}
                              onClick={() =>
                                handleClickLinkNotification(
                                  item?.orderDetailId?._id,
                                  item
                                )
                              }
                              className="bg-slate-100 min-w-full hover:bg-none"
                            >
                              <div className="flex items-center group/item  gap-3 w-full">
                                <div className="h-full flex items-center rounded-full overflow-hidden justify-center">
                                  <img
                                    className="rounded-full object-cover size-10"
                                    src={item?.orderDetailId?.color?.image}
                                    alt={item?.orderDetailId?.color?.name}
                                  />
                                </div>
                                <div className="grid gap-1 flex-1">
                                  <div className="flex items-center min-w-full">
                                    <div className="flex flex-1 items-center gap-2">
                                      <div className="font-medium text-green-500 text-xs">
                                        Đơn hàng mới
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {item?.relativeTime}
                                      </div>
                                    </div>
                                    <Dot size={25} color="#7adeff" />
                                    <div
                                      onClick={(e) =>
                                        handleBtndeleteNotification(e, item._id)
                                      }
                                      className="cursor-pointer w-4 text-xs group-hover/item:visible invisible text-muted-foreground"
                                    >
                                      <X size={14} />
                                    </div>
                                  </div>
                                  <p className="text-xs">
                                    Bạn có một đơn hàng mới từ{" "}
                                    <span className="font-semibold text-xs capitalize">
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
                                item
                              )
                            }
                            key={uniqueKey}
                            className="min-w-full hover:bg-none"
                          >
                            <div className="flex group/item items-center gap-3 w-full">
                              <div className="rounded-full flex items-center justify-center ">
                                <img
                                  className="rounded-full object-cover size-10"
                                  src={item?.orderDetailId?.color?.image}
                                  alt={item?.orderDetailId?.color?.name}
                                />
                              </div>
                              <div className="grid gap-1 flex-1">
                                <div className="flex items-center min-w-full">
                                  <div className="flex flex-1 items-center gap-2">
                                    <div className="font-medium text-xs text-green-500">
                                      Đơn hàng mới
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {item?.relativeTime}
                                    </div>
                                  </div>
                                  <div
                                    onClick={(e) =>
                                      handleBtndeleteNotification(e, item._id)
                                    }
                                    className="cursor-pointer w-4 text-xs group-hover/item:visible invisible text-muted-foreground"
                                  >
                                    <X size={14} />
                                  </div>
                                </div>
                                <p className="text-xs">
                                  Bạn có một đơn hàng mới từ{" "}
                                  <span className="font-semibold text-xs capitalize">
                                    {item?.userId?.username}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>

                    {allOrderNotifications &&
                      allOrderNotifications?.length === 0 && (
                        <div className="flex items-center justify-center w-full min-h-[300px]">
                          <h2>Hiện không có thông báo nào</h2>
                        </div>
                      )}
                  </div>
                  <DropdownMenuSeparator />
                  {hasMore && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={loadMoreNotification}
                        variant="outline"
                        size="sm"
                      >
                        Xem thêm
                      </Button>
                    </div>
                  )}
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
