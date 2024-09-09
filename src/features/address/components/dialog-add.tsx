import { useEffect, useState } from "react"
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
import { useCreateAddress } from "../api/create-address"

interface Iprops {
  open: boolean
  setOpen: (open: boolean) => void
}
const DialogAddress = ({ open, setOpen }: Iprops) => {
  const user = useAuthStore()

  const addressAdd = useCreateAddress({
    userId: user.user?._id,
  })
  useEffect(() => {
    if (open) return
  }, [open])

  const [cityId, setCityId] = useState<string>("")
  const [districtId, setDistrictId] = useState<string>("")

  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [ward, setWard] = useState("")

  const { data: dataProvinces, isLoading: loadingProvinces } =
    useFetchProvinces()
  const { data: dataDistrics, isLoading: loadingDistricts } =
    useFetchDistricts(cityId)
  const { data: dataWards, isLoading: loadingWards } = useFetchWards(districtId)

  const handleCityChange = (idCity: string, field: any) => {
    const id = idCity.split("-")[0]
    const value = idCity.split("-")[1]
    field.onChange(value)
    setCityId(id)
    setCity(value)
  }

  const handleDistrictChange = (idDistrict: string, field: any) => {
    const id = idDistrict.split("-")[0]
    const value = idDistrict.split("-")[1]
    field.onChange(value)
    setDistrictId(id)
    setDistrict(value)
  }

  const handleStreetChange = (value: string, field: any) => {
    field.onChange(value)
    setWard(value)
  }

  const methods = useForm({
    resolver: zodResolver(schemaAddress),
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods

  const onSubmit = (data: any) => {
    toast.promise(
      addressAdd.mutateAsync({ data: { ...data, userId: user.user?._id } }),
      {
        loading: "Đang thêm địa chỉ...",
        success: "Thêm địa chỉ thành công",
        error: "Thêm địa chỉ thất bại",
      }
    )
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="min-h-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Thêm địa chỉ nhận hàng mới</AlertDialogTitle>
        </AlertDialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input id="name" placeholder="Nhập tên của bạn" {...field} />
                )}
              />
              {errors.name && (
                <p className="text-red-500">{`${errors.name.message}`}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    type="tel"
                    {...field}
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500">{`${errors.phone.message}`}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-2">
                <Controller
                  name="city"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-2">
                      <FormLabel>Thành Phố</FormLabel>
                      <Select
                        disabled={loadingProvinces}
                        onValueChange={(value) =>
                          handleCityChange(value, field)
                        }
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder={"Thành phố"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {dataProvinces &&
                              dataProvinces?.map((province) => (
                                <SelectItem
                                  key={province?.id}
                                  value={`${province?.id}-${province?.full_name}`}
                                >
                                  {province?.full_name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {error && (
                        <p className="text-red-500">{`${error.message}`}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Controller
                  name="district"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-2">
                      <FormLabel>Quận/Huyện</FormLabel>
                      <Select
                        disabled={loadingDistricts || !cityId}
                        onValueChange={(value) =>
                          handleDistrictChange(value, field)
                        }
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder={"Quận/Huyện"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {dataDistrics &&
                              dataDistrics?.map((dist) => (
                                <SelectItem
                                  key={dist.id}
                                  value={`${dist?.id}-${dist?.full_name}`}
                                >
                                  {dist?.full_name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {error && (
                        <p className="text-red-500">{`${error.message}`}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Controller
                  name="ward"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-2">
                      <FormLabel>Phường/Xã</FormLabel>
                      <Select
                        disabled={loadingWards || !cityId || !districtId}
                        onValueChange={(value) =>
                          handleStreetChange(value, field)
                        }
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder={"Phường/Xã"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {dataWards &&
                              dataWards?.map((ward) => (
                                <SelectItem
                                  key={ward?.id}
                                  value={ward?.full_name}
                                >
                                  {ward?.full_name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {error && (
                        <p className="text-red-500">{`${error.message}`}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Địa chỉ cụ thể</Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="address"
                    placeholder="Nhập số nhà tên đường.v.v..."
                    {...field}
                  />
                )}
              />
              {errors.address && (
                <p className="text-red-500">{`${errors.address.message}`}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Lưu
            </Button>
          </form>
        </FormProvider>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Hủy
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DialogAddress
