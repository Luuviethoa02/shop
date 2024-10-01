import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"

import toast from "react-hot-toast"
import { useAuthStore } from "@/store"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import DialogAddress from "./dialog-add"
import { Badge } from "@/components/ui/badge"

import { address } from "@/types/client"
import LoadingMain from "@/components/share/LoadingMain"
import { useSetAddress } from "../api/set-address-default"
import { convertToVietnamesePhone } from "@/lib/utils"

interface Iprops {
  open: boolean
  setOpen: (open: boolean) => void
  address: address[] | undefined
  setAddress: Dispatch<SetStateAction<address[] | undefined>>
  addressActive: address | undefined
  setAddressActive: Dispatch<SetStateAction<address | undefined>>
}
const DialogList = ({ setAddressActive, addressActive, open, setOpen, address, setAddress }: Iprops) => {
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [addressEdit, setAddressEdit] = useState<address>()
  const [addressDefault, setAddressDefault] = useState<address>()
  const [loading, setLoading] = useState<boolean>(true)
  const currentUser = useAuthStore((state) => state.user)
  const setDefaultAdrress = useSetAddress({
    userId: currentUser?._id,
  })

  useEffect(() => {
    if (address && addressActive) {
      setAddressDefault(address?.find((item) => item.default === true) || addressActive)
    }
  }, [address, addressActive])


  useEffect(() => {
    const id = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => {
      clearTimeout(id)
    }
  }, [loading])

  const handleAddAddressClick = () => {
    setOpenAdd(true)
  }

  const handleInputchange = (addressId: string) => {
    const newAddress = address?.map((item) => {
      if (item._id === addressId) {
        setAddressActive(item)
      }
    })
    setOpen(false)
  }

  const handleClickUpdate = (address: address) => {
    setOpenAdd(true)
    setAddressEdit(address)
  }

  const handleDefaultClick = (addressId: string) => {
    toast.promise(setDefaultAdrress.mutateAsync({
      data: {
        addressId: addressId
      },
    }, {
      onSuccess: (data) => {
        setOpen(false)
        return data
      },
    }), {
      loading: "Đang xử lý",
      success: "Đặt mặc định thành công",
      error: "Đặt mặc định thất bại",
    })
  }

  if (loading) {
    return (
      <AlertDialog>
        <AlertDialogContent>
          <LoadingMain />
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent onOpenAutoFocus={(e: Event) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center justify-between">
                <h2>Địa chỉ nhận hàng</h2>
                <p
                  className="cursor-pointer hover:underline hover:text-primary transition-all"
                  onClick={handleAddAddressClick}
                >
                  Thêm địa chỉ mới
                </p>
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <RadioGroup onValueChange={handleInputchange}>
            {(address && address.length == 0) && (
              <h1>Hiện chưa có địa chỉ nào</h1>
            )}

            {(address && addressActive && address.length > 0) && (
              <>
                {address.map((item, index) => (
                  <div key={index} className="flex group/item gap-2 hover:bg-black/5 transition-all p-2 py-3 rounded-md items-center space-x-2">
                    <div>
                      <RadioGroupItem checked={item._id === addressActive?._id} className="size-5" value={item._id} id={`r${index}`} />
                    </div>
                    <Label htmlFor={`address-${index}`} className="flex-grow">
                      <div className="flex items-center justify-between min-w-full">
                        <div className="font-medium flex items-center">
                          <h4 className="scroll-m-20 capitalize text-lg border-r-[1px] pr-2 border-gray-500 font-semibold tracking-tight">
                            {item.name}
                          </h4>
                          <p className="text-sm block ml-2 text-slate-500 truncate">{
                            convertToVietnamesePhone(item.phone)
                          }</p>
                        </div>

                      </div>
                      <div className="text-sm capitalize text-gray-500">
                        {item.address}
                      </div>
                      <div className="text-sm text-gray-500">{
                        `${item.ward}, ${item.district.split('-')[1]}, ${item.city.split('-')[1]}`
                      }</div>
                    </Label>
                    {(addressDefault?._id === item._id) && (
                      <div className="flex flex-col items-center justify-between min-h-full">
                        <p onClick={() => handleClickUpdate(item)} className="capitalize hover:underline text-primary cursor-pointer">cập nhật</p>
                        <Badge className="text-center min-w-24 font-medium pb-1 flex items-center justify-center">
                          Mặc định
                        </Badge>
                      </div>
                    )}

                    {(addressDefault?._id !== item._id) && (
                      <div className="flex flex-col items-center justify-between min-h-full">
                        <p onClick={() => handleClickUpdate(item)} className="capitalize hover:underline text-primary cursor-pointer">cập nhật</p>
                        <Badge variant={'outline'} onClick={() => handleDefaultClick(item._id)} className="text-center min-w-24 cursor-pointer mr-3 invisible group-hover/item:visible font-medium pb-1 flex items-center justify-center">
                          Đặt mặc định
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

          </RadioGroup>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Hủy
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
        <DialogAddress
          addressEdit={addressEdit}
          setAddressEdit={setAddressEdit}
          open={openAdd}
          setOpen={setOpenAdd}
        />
      </AlertDialog>
    </>
  )
}

export default DialogList
