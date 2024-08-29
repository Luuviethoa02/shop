import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import {
  BellIcon,
  MenuIcon,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  X,
} from "lucide-react"
import { Link } from "react-router-dom"
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
import { useEffect, useRef, useState } from "react"
import { useAuthStore } from "@/store"
import { Input } from "../ui/input"
import { AnimatePresence, motion } from "framer-motion"
import cartStore from "@/store/cart.store"
import CartItem from "@/features/carts/components/cart"
import { socket } from "@/lib/api-io"
import { CardHeader, CardTitle } from "../ui/card"
import Notification from "@/features/notifications/components/notification"
import { useScroll } from "react-use"

const Header = () => {
  const contentRef = useRef(null)
  const { y } = useScroll(contentRef)

  const [open, setOpen] = useState<boolean>(false)
  const user = useAuthStore((state) => state.user)
  const carts = cartStore((state) => state.carts)
  const [notifications, setNotifications] = useState<
    {
      id: string
      productId: string
      userId: string
    }[]
  >([])

  const [searchHistory, setSearchHistory] = useState([
    "React",
    "Tailwind CSS",
    "Next.js",
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm && !searchHistory.includes(searchTerm)) {
      setSearchHistory([searchTerm, ...searchHistory].slice(0, 5))
    }
    setSearchTerm("")
    setIsHistoryOpen(false)
    // Perform search action here
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsHistoryOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    socket.on("receive_comment", (comment) => {
      setNotifications((prevComments) => [...prevComments, comment])
    })

    // Dọn dẹp kết nối khi component bị hủy
    return () => {
      socket.off("receive_comment")
    }
  }, [])

  return (
    <div
      className={`container bg-white/70 backdrop-blur-md transition-all duration-100 ease-in-out sticky top-0 z-[1000] mx-auto px-4 md:px-6 lg:px-8 overflow-hidden`}
    >
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Logo />
            <div className="grid gap-2 py-6">
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
          <NavigationMenuList>
            <NavigationMenuLink asChild>
              <Link
                to="#"
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
          <div className="backdrop-blur-md">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex-1 min-w-[350px] flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                  <div className="max-w-lg w-full lg:max-w-xs" ref={searchRef}>
                    <form onSubmit={handleSearch} className="relative">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          type="search"
                          placeholder="Search"
                          className="block w-full pl-10 bg-transparent pr-3 py-2 backdrop-blur-md"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={() => setIsHistoryOpen(true)}
                        />
                        <Button
                          type="submit"
                          className="absolute inset-y-0 right-0 flex items-center px-4"
                          variant="ghost"
                        >
                          Search
                        </Button>
                      </div>
                      {isHistoryOpen && searchHistory.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                          <ul className="py-1">
                            {searchHistory.map((item, index) => (
                              <li
                                key={index}
                                className="px-4 py-2 hover:bg-accent cursor-pointer"
                                onClick={() => {
                                  setSearchTerm(item)
                                  setIsHistoryOpen(false)
                                }}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </form>
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
                      {notifications.length}
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
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.img} alt={user.username} />
                  <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={"/profile"}>Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
      <DialogLogout open={open} setOpen={setOpen} />

      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
                  <p>Hiện không có sản phẩm nào</p>
                ) : (
                  <>
                    {Object.entries(carts).map(([id, cartItem]) => (
                      <CartItem key={id} item={cartItem} id={id} />
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNotificationOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
                {Object.keys(carts).length === 0 ? (
                  <p>Hiện không thông báo nào</p>
                ) : (
                  <>
                    {Object.entries(carts).map(([id, cartItem]) => (
                      <Notification key={id} />
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Header
