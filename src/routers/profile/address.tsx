import { ProfileLayout } from '@/components/layouts'
import LoadingMain from '@/components/share/LoadingMain'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import LayoutWapper from '@/components/warper/layout.wrapper'
import { useDeleteAddress } from '@/features/address/api/delete-address'
import { useAddressByUserId } from '@/features/address/api/get-address-user'
import { useSetAddress } from '@/features/address/api/set-address-default'
import DialogAddress from '@/features/address/components/dialog-add'
import { convertToVietnamesePhone } from '@/lib/utils'
import { useAuthStore } from '@/store'
import { address } from '@/types/client'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export const AddressRounte = () => {
  const { user } = useAuthStore()
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const addresses = useAddressByUserId({ userId: user?._id })
  const [addressActive, setAddressActive] = useState<address>()
  const [address, setAddress] = useState<address[]>()
  const setDefaultAdrress = useSetAddress({
    userId: user?._id,
  })

  const deleteAddress = useDeleteAddress({ userId: user?._id! })

  const [addressDefault, setAddressDefault] = useState<address>()
  const [addressEdit, setAddressEdit] = useState<address>()
  const [addressDelete, setAddressDelete] = useState<address>()
  const [refresh, setRefresh] = useState<boolean>(false)

  useEffect(() => {
    if ((addresses?.data?.data?.length ?? 0) > 0) {
      const addressDefault = addresses?.data?.data.find(address => address.default) || addresses?.data?.data[0]

      const updatedAddress = addresses?.data?.data ? [...addresses.data.data] : [];

      // Kiểm tra nếu không có item nào có default: true
      const hasDefault = addresses?.data?.data?.some(item => item.default);
      if (!hasDefault && (addresses?.data?.data?.length ?? 0) > 0) {
        updatedAddress[0].default = true;
      }
      setAddress(updatedAddress)
      setAddressActive(addressDefault)
    }
  }, [addresses?.data?.data])

  const handleAddAddressClick = () => {
    setOpenAdd(true)
  }

  const handleInputchange = (addressId: string) => {
    const newAddress = address?.map((item) => {
      if (item._id === addressId) {
        setAddressActive(item)
      }
    })
  }

  const handleClickUpdate = (address: address) => {
    setOpenAdd(true)
    setAddressEdit(address)
  }
  const handleClickDelete = (address: address) => {
    setOpenDelete(true)
    setAddressDelete(address)
  }

  useEffect(() => {
    if (!openAdd && addressEdit) {
      setAddressEdit(undefined)
      if (refresh) setRefresh(false)
    }
  }, [openAdd])

  useEffect(() => {
    if (!openDelete && addressDelete) {
      setAddressDelete(undefined)
    }
  }, [openDelete])

  useEffect(() => {
    if (refresh) {
      addresses.refetch()
    }

  }, [refresh])

  const handleDefaultClick = (addressId: string) => {
    toast.promise(setDefaultAdrress.mutateAsync({
      data: {
        addressId: addressId
      },
    }, {
      onSuccess: (data) => {
        return data
      },
    }), {
      loading: "Đang xử lý",
      success: "Đặt mặc định thành công",
      error: "Đặt mặc định thất bại",
    })
  }

  const handleClickConfirmDelete = () => {
    if (!addressDelete) {
      toast.error('Có lỗi xảy ra vui lòng thủ lại!')
      return
    }

    toast.promise(deleteAddress.mutateAsync({
      addressId: addressDelete._id
    }, {
      onSuccess: (data) => {
        setOpenDelete(false)
        return data
      },
    }), {
      loading: "Đang xử lý",
      success: "Xóa địa chỉ thành công",
      error: "Xóa thất bại",
    })
  }

  return (
    <LayoutWapper size='small'>
      <ProfileLayout>
        <div className='max-h-screen overflow-y-auto'>
          {addresses?.status === 'success' && (
            <div className='flex items-center justify-between'>
              <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                Hiện chưa có địa chỉ nào
              </h2>
              <div className='flex items-end justify-end mb-10'>
                <Button onClick={handleAddAddressClick} variant={'outline'} size={'icon'}>
                  <Plus />
                </Button>
              </div>
            </div>
          )}

          {addresses?.status === 'pending' ? (<LoadingMain />) : (
            <RadioGroup onValueChange={handleInputchange}>
              {(address && address?.length == 0) && (
                <h1>Hiện chưa có địa chỉ nào</h1>
              )}

              {(address && address?.length > 0) && (
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
                          <div className='flex items-center gap-3'>
                            <p onClick={() => handleClickUpdate(item)} className="capitalize hover:underline text-primary cursor-pointer">cập nhật</p>
                            <p onClick={() => handleClickUpdate(item)} className="capitalize hover:underline text-destructive cursor-pointer">Xóa</p>
                          </div>
                          <Badge className="text-center min-w-24 font-medium pb-1 flex items-center justify-center">
                            Mặc định
                          </Badge>
                        </div>
                      )}

                      {(addressDefault?._id !== item._id) && (
                        <div className="flex flex-col items-center justify-between min-h-full">
                          <div className='flex items-center gap-3'>
                            <p onClick={() => handleClickUpdate(item)} className="capitalize hover:underline text-primary cursor-pointer">cập nhật</p>
                            <p onClick={() => handleClickDelete(item)} className="capitalize hover:underline text-destructive cursor-pointer">Xóa</p>
                          </div>
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
          )}
          <DialogAddress
            refresh={refresh}
            setRefresh={setRefresh}
            addressEdit={addressEdit}
            setAddressEdit={setAddressEdit}
            open={openAdd}
            setOpen={setOpenAdd}
          />


          <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
            <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {'Xóa địa chỉ nhận hàng này?'}
                </AlertDialogTitle>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <Button onClick={handleClickConfirmDelete} variant={'destructive'}>Xóa</Button>
                <AlertDialogCancel onClick={() => setOpenDelete(false)}>
                  Hủy
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </ProfileLayout>
    </LayoutWapper>
  )
}
