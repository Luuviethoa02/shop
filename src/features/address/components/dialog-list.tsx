import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  useFetchDistricts,
  useFetchProvinces,
  useFetchWards,
} from "@/hooks/useProvinces"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { schemaAddress } from "../validator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FormLabel } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { useAuthStore } from "@/store"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import DialogAddress from "./dialog-add"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Iprops {
  open: boolean
  setOpen: (open: boolean) => void
}
const DialogList = ({ open, setOpen }: Iprops) => {
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const handleAddAddressClick = () => {
    if (openAdd) return
    setOpenAdd(true)
  }

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center justify-between">
                <h2>Địa chỉ nhận hàng</h2>
                <p onClick={handleAddAddressClick}>Thêm địa chỉ mới</p>
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor={`address-${2}`} className="flex-grow">
                <div className="font-medium">{"hcm"}</div>
                <div className="text-sm text-gray-500">
                  12 quangtr trung thành phố hồ chí minh
                </div>
                <div className="text-sm text-gray-500">{"09876666734"}</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor={`address-${4}`} className="flex-grow">
                <div className="font-medium">{"hcm"}</div>
                <div className="text-sm text-gray-500">
                  12 quangtr trung thành phố hồ chí minh
                </div>
                <div className="text-sm text-gray-500">{"09876666734"}</div>
              </Label>

              <Badge className="text-center font-medium pb-1 flex items-center justify-center">
                Mặc định
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor={`address-${1}`} className="flex-grow">
                <div className="font-medium">{"hcm"}</div>
                <div className="text-sm text-gray-500">
                  12 quangtr trung thành phố hồ chí minh
                </div>
                <div className="text-sm text-gray-500">{"09876666734"}</div>
              </Label>
            </div>
          </RadioGroup>
          <AlertDialogFooter>
            <AlertDialogAction>Thay đổi</AlertDialogAction>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Hủy
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DialogAddress open={openAdd} setOpen={setOpenAdd} />
    </>
  )
}

export default DialogList
