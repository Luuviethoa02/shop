import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLogout } from "@/lib/auth"
import { useAuthStore, useGlobalStore } from "@/store"
import toast from "react-hot-toast"
import { googleLogout } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
interface Iprops {
  open: boolean
  setOpen(value: boolean): void
}
function DialogLogout({ open, setOpen }: Iprops) {
  const currentUser = useAuthStore((state) => state.user)
  const logout = useLogout()
  const { logout: logoutUsers } = useAuthStore()
  const { setSellerCreated } = useGlobalStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (currentUser?.loginGoogle) {
      googleLogout()
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    } else {
      logout.mutate({})
    }
    logoutUsers()
    setSellerCreated(false)
    toast.success("Đăng xuất thành công")
    setOpen(false)
    navigate("/auth/login")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onOpenAutoFocus={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Đăng Xuất</DialogTitle>
        </DialogHeader>
        <p className="text-slate-500">Xác nhận đăng xuất tài khoản của bạn !</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </DialogClose>
          <Button onClick={handleLogout} type="submit">
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogLogout
