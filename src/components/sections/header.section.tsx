import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { BellIcon, MenuIcon, Search, ShoppingCart, X } from "lucide-react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu"
import Logo from "../share/Logo"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import DialogLogout from "@/features/auth/components/form-logout"
import { useEffect, useState } from "react"
import { useAuthStore, useCartStore } from "@/store"
import { Input } from "../ui/input"
import { AnimatePresence, motion } from "framer-motion"
import CartItem from "@/features/carts/components/cart"
import { CardHeader, CardTitle } from "../ui/card"
import Notification from "@/features/notifications/components/notification"
import useSocket from "@/hooks/useSocket"
import { getInitials } from "@/lib/utils"
import { useNotificationByUserId } from "@/features/notifications/api/get-notifications"
import useDebounce from "@/hooks/useDebounce"
import { useFetchSearchForText } from "@/features/search/api/get-suggest-text-search"
import LoadingMain from "@/components/share/LoadingMain"
import { useCreateHistory } from "@/features/search/api/create-history"
import { useGetTextSearch } from "@/features/search/api/search-by-text"
import nProgress from "nprogress"
import toast from "react-hot-toast"

const Header = () => {
  const [open, setOpen] = useState<boolean>(false)
  const user = useAuthStore((state) => state.user)
  const carts = useCartStore((state) => state.carts)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const params = useParams()

  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTermFinal, setSearchTermFinal] = useState<string | undefined>(undefined);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

  const data = useFetchSearchForText(debouncedSearchTerm)
  const create = useCreateHistory({ page: 1, limit: 10, userId: user?._id })
  const search = useGetTextSearch({ text: searchTermFinal, is_discount: false })
  const navigation = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      setSearchTerm('')
    }
  }, [location])

  useEffect(() => {
    if (searchTermFinal) {
      nProgress.start()
    }
  }, [searchTermFinal])

  useEffect(() => {
    if (search?.data) {
      console.log(search.data, "search.data");

      navigation(`/search/${searchTermFinal}`);
      nProgress.done()
    }

    if (search.error) {
      toast.error('Đã xảy ra lỗi vui lòng thử lại sau!')
      nProgress.done()
    }
  }, [search.data, search.error, searchTermFinal])

  useEffect(() => {
    if (debouncedSearchTerm) {
      data.refetch().then((results) => {
        const { data, statusCode } = results.data as unknown as { data: string[], message: string, statusCode: number }
        if ((statusCode === 200 && data.length > 0) && searchTerm != params?.text) {
          setSearchHistory(data)
          setIsHistoryOpen(true)
        } else {
          setIsHistoryOpen(false)
          setSearchHistory([])
        }
      })
    } else {
      setIsHistoryOpen(false)
      setSearchHistory([])
    }

  }, [debouncedSearchTerm]);

  const handleSuggestClick = (item: string) => {
    setSearchTerm(item);
    setIsHistoryOpen(false);
    setSearchHistory([])
    if (user?._id) {
      create.mutate({ data: { keyWords: item, userId: user?._id } })
    }
    setSearchTermFinal(item)
  }

  const handleKeyUpInputSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputElement = e.currentTarget;

      if (user?._id) {
        create.mutate({ data: { keyWords: searchTerm, userId: user?._id } })
      }
      setSearchTermFinal(searchTerm)
      inputElement.blur();
    }
  }

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const currentUser = useAuthStore((state) => state.user)
  const socket = useSocket(currentUser?._id)
  const notifications = useNotificationByUserId({
    userId: currentUser?._id!,
    limit: 1,
    page: 1,
  })

  useEffect(() => {
    if (!socket) return

    if (socket && currentUser?._id) {
      socket.on("newNotification", () => {
        notifications.refetch()
      })

      return () => {
        socket.off("newNotification")
      }
    }
  }, [socket, currentUser?._id])

  const handleClickCheckout = () => {
    if (currentUser?._id) {
      navigation("/checkout")
    } else {
      navigation("/auth/login")
    }
    setIsCartOpen(false)
  }

  return (
    <>
      <div
        className={`bg-white/70 backdrop-blur-3xl transition-all duration-100 ease-in-out top-0 z-50 sticky shrink-0`}
      >
        <header className="flex h-20 w-full items-center px-4 md:px-16">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Logo />
              <div className="grid gap-2 py-6 left-10">
                <Link
                  to="/"
                  className="flex bg-transparent w-full items-center py-2 text-lg font-semibold"
                >
                  Trang chủ
                </Link>
                <Link
                  to="#"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                >
                  Về chúng tôi
                </Link>
                <Link
                  to="#"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                >
                  Dịch vụ
                </Link>
                <Link
                  to="#"
                  className="flex w-full items-center py-2 text-lg font-semibold"
                >
                  Liên hệ
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <Logo />
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="left-10 ml-14">
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                >
                  Trang chủ
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  to="#"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                >
                  Về chúng tôi
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  to="#"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                >
                  Dịch vụ
                </Link>
              </NavigationMenuLink>

              <NavigationMenuLink asChild>
                <Link
                  to="#"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                >
                  Liên Hệ
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="ml-auto flex gap-2">
            <div className="bg-transparent">
              <div className="mx-auto px-2">
                <div className="flex items-center justify-between h-16">
                  <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                    <div className="relative min-w-[600px]">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        type="search"
                        placeholder="Tìm kiếm ..."
                        className={`block focus:border-1 focus:ring-1 focus:ring-offset-1
                        focus-visible:outline-1 focus-visible:ring-1 focus-visible:ring-slate-50 ring-offset-transparent outline-none ring-offset-0 focus-visible:ring-offset-1
                        relative z-10 focus-within:border-b-transparent overflow-hidden min-w-[600px] focus-within:outline-none focus-within:ring-offset-0 focus-within:border-0
                        pl-10  bg-transparent outline-offset-0 pr-3 py-2 ${isHistoryOpen ? 'rounded-br-none border-b-transparent rounded-bl-none' : ''}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyUp={handleKeyUpInputSearch}
                      />
                      <motion.div
                        className={`absolute border-t-0 -z-10 border-t-transparent rounded-bl-lg -translate-y-1 rounded-br-lg overflow-hidden w-full bg-background shadow-lg outline-1
                          ${isHistoryOpen} ? 'border' : ''`}
                        initial={{ height: 0 }}
                        animate={{ height: isHistoryOpen ? 'auto' : 0 }}
                        transition={{ duration: 0.5, ease: 'linear' }}
                      >
                        {(isHistoryOpen && data.status === 'pending') && (
                          <LoadingMain />
                        )}
                        {data?.data && isHistoryOpen && searchHistory.length > 0 && (
                          <ul className="py-1 space-y-2">
                            {searchHistory?.map((item, index) => (
                              <li
                                key={index}
                                className="px-4 text-base lowercase font-light line-clamp-2 hover:bg-accent cursor-pointer"
                                onClick={() => handleSuggestClick(item)}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center lg:ml-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setIsCartOpen(true)}
                      >
                        <ShoppingCart className="h-6 w-6" />
                        {
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {Object.keys(carts).length}
                          </span>
                        }
                      </Button>
                    </div>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <BellIcon
                          onClick={() => setIsNotificationOpen(true)}
                          className="h-6 w-6"
                        />
                      </Button>
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {notifications?.data?.data?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!user?._id && (
              <div className="flex items-center gap-3">
                <Link to={"/auth/login"}>
                  <Button variant="outline">Đăng nhập</Button>
                </Link>
                <Link to={"/auth/register"}>
                  {" "}
                  <Button>Đăng ký</Button>
                </Link>
              </div>
            )}

            {user?._id && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="size-10 border">
                    <AvatarImage src={user?.img} alt={user?.username} />
                    <AvatarFallback>
                      {" "}
                      {getInitials(user?.username)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  onCloseAutoFocus={(e: Event) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onPointerLeave={(event) => event.preventDefault()}
                    onPointerMove={(event) => event.preventDefault()}
                  >
                    <Link to={"/profile/account"}>Hồ sơ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onPointerLeave={(event) => event.preventDefault()}
                    onPointerMove={(event) => event.preventDefault()}
                  >
                    <Link to={"/seller"}>Kênh người bán</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onPointerLeave={(event) => event.preventDefault()}
                    onPointerMove={(event) => event.preventDefault()}
                    onClick={() => setOpen(true)}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
      </div>

      <DialogLogout open={open} setOpen={setOpen} />

      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Cart Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[300px] md:w-[460px] bg-background shadow-lg z-50 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Giỏ hàng của bạn</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                {Object.keys(carts).length === 0 ? (
                  <p>Hiện không có sản phẩm nào !</p>
                ) : (
                  <>
                    {Object.entries(carts).map(([id, cartItem]) => (
                      <CartItem key={id} item={cartItem} id={id} />
                    ))}
                  </>
                )}
              </div>
              <Button
                disabled={Object.keys(carts).length === 0}
                onClick={handleClickCheckout}
                className="absolute flex items-center justify-center bottom-0 text-lg h-12 rounded-none bg-primary min-w-full"
              >
                Mua hàng
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNotificationOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsNotificationOpen(false)}
            ></div>

            {/* Cart Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[300px] md:w-[460px] bg-background shadow-lg z-50 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center border-b mb-4">
                  <CardHeader className="pb-4 flex-1 pr-0">
                    <div className="flex items-center justify-between">
                      <CardTitle>Thông báo</CardTitle>
                      <Button className="-mr-[10%]" variant="ghost" size="sm">
                        Đánh dấu tất cả đã đọc
                      </Button>
                    </div>
                  </CardHeader>
                  <Button
                    className="-translate-y-3/4"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                {notifications?.data?.data?.length === 0 ? (
                  <p>Hiện không có thông báo nào !</p>
                ) : (
                  <>
                    {notifications?.data?.data?.map((notifi) => (
                      <Notification
                        setIsNotificationOpen={setIsNotificationOpen}
                        notifi={notifi}
                        key={notifi._id}
                      />
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
