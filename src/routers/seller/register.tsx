import Logo from "@/components/share/Logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DialogLogout from "@/features/auth/components/form-logout"
import RegisterComplete from "@/features/seller/components/registerComplete"
import RegisterShop from "@/features/seller/components/registerShop"
import { getInitials } from "@/lib/utils"
import { useAuthStore, useGlobalStore } from "@/store"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const steps = [
  { id: 1, title: "Thông tin shop", Component: RegisterShop },
  { id: 2, title: "Hoàn tất", Component: RegisterComplete },
]

export const RegisterRoute = () => {
  const [open, setOpen] = useState<boolean>(false)
  const sellerCreated = useGlobalStore((state) => state.sellerCreated)
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const [currentStep, setCurrentStep] = useState(1)

  const CurrentComponent = steps[currentStep - 1].Component

  useEffect(() => {
    if (sellerCreated) {
      setCurrentStep(2)
    }
  }, [sellerCreated])

  const handleClickNext = () => {
    if (sellerCreated) {
      navigate("/seller")
    } else {
      if (currentStep === steps.length) {
        return
      }
      setCurrentStep((value) => value + 1)
    }
  }

  return (
    <div className="min-w-full h-screen">
      <div className="bg-white/70 backdrop-blur-3xl transition-all duration-100 ease-in-out top-0 z-50 sticky shrink-0 mx-auto overflow-hidden">
        <header className="flex bg-white justify-between shadow-lg h-20 w-full items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Logo />
            <h4 className="scroll-m-20 text-xl ml-8 font-normal tracking-tight">
              Đăng ký trở thành Người bán Shopvh
            </h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="size-10 border">
                <AvatarImage src={user?.img} alt={user?.username} />
                <AvatarFallback> {getInitials(user?.username!)}</AvatarFallback>
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
                onClick={() => setOpen(true)}
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </div>
      <main className="px-44 py-6 bg-slate-100">
        <div className="min-h-[700px] px-10 min-w-full rounded-lg bg-white">
          <div className="w-full max-w-3xl mx-auto px-4 py-8">
            <ol
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full"
              aria-label="Progress steps"
            >
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`flex items-center w-full sm:w-auto ${step.id === 2 ? "" : "flex-1"}`}
                >
                  <div className="flex flex-col items-center flex-grow">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step.id <= currentStep ? "bg-primary" : "bg-gray-400"
                      }`}
                    >
                      <span className="text-white text-sm font-medium">
                        {step.id}
                      </span>
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium">{step.title}</div>
                    </div>
                  </div>
                  {step.id < 2 && (
                    <div
                      className="hidden sm:block w-full bg-gray-200 h-0.5 mt-4"
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="max-w-full min-h-[500px] flex justify-center">
            <CurrentComponent />
          </div>

          <footer className="border-t-[1px] flex items-center justify-between mt-16 border-collapse h-20 border-black/20">
            <Button
              disabled={sellerCreated}
              onClick={() => setCurrentStep((value) => value - 1)}
              type="button"
              variant={"outline"}
            >
              Quay lại
            </Button>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleClickNext}
                type="button"
              >{`${sellerCreated ? "Bắt đầu ngay" : "Tiếp theo"}`}</Button>
            </div>
          </footer>
        </div>
      </main>

      <DialogLogout open={open} setOpen={setOpen} />
    </div>
  )
}
