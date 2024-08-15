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
import toast from "react-hot-toast"
interface Iprops {
  open: boolean
  setOpen(value: boolean): void
}
function DialogLogout({ open, setOpen }: Iprops) {
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate({})
    toast.success("Đăng xuất thành công")
    setOpen(false)
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
