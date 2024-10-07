import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useForm, Controller, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore, useGlobalStore } from "@/store"
import {
  useFetchDistricts,
  useFetchProvinces,
  useFetchWards,
} from "@/hooks/useProvinces"
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { schemaSeller } from "../validators"
import { useCreateSeller } from "../api/create.seller"
import toast from "react-hot-toast"
import { SpokeSpinner } from "@/components/ui/spinner"

const RegisterShop = () => {
  const currentUser = useAuthStore((state) => state.user)
  const { setUser } = useAuthStore()
  const { setSellerCreated } = useGlobalStore()

  const seller = useCreateSeller()

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
    resolver: zodResolver(schemaSeller),
    defaultValues: {
      userId: currentUser?._id,
      email: currentUser?.email,
      businessName: currentUser?.username,
      phone: undefined,
      businessType: "personal",
      username: currentUser?.username,
      district: undefined,
      city: undefined,
      ward: undefined,
      addressDetail: undefined,
      express: true,
      fast: true,
      economical: true,
      bulkyGoods: true,
    },
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods

  const onSubmit = (data: any) => {
    const toastId = toast.loading("Đang tạo kênh người bán...")
    seller.mutate(
      { data },
      {
        onSuccess: (data) => {
          toast.success("Tạo kênh người bán thành công", {
            id: toastId,
          })
          setUser(data?.data?.user)
          setTimeout(() => {
            setSellerCreated(true)
          }, 1000)
        },
        onError: () => {
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau!", {
            id: toastId,
          })
        },
      }
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Tên Shop</Label>
                <Controller
                  name="businessName"
                  control={control}
                  render={({ field }) => <Input id="businessName" {...field} />}
                />
                {errors.businessName && (
                  <p className="text-red-500">{`${errors.businessName.message}`}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input disabled id="email" type="email" {...field} />
                )}
              />
              {errors.email && (
                <p className="text-red-500">{`${errors.email.message}`}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="space-y-2">
                <Label htmlFor="username">Họ & Tên</Label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        className="w-full"
                        placeholder="Nhập vào"
                        id="username"
                        {...field}
                      />
                      {error && (
                        <span className="mt-1 block text-red-500">
                          {error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
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
            <div className="space-y-2">
              <Label htmlFor="addressDetail">Địa chỉ chi tiết</Label>
              <Controller
                name="addressDetail"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Textarea
                      id="addressDetail"
                      {...field}
                      placeholder="Nhập số nhà tên đường.v.v..."
                      className="min-h-[100px]"
                    />
                    {error && (
                      <p className="text-red-500">{`${error.message}`}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input id="phone" type="tel" {...field} />
                )}
              />
              {errors.phone && (
                <p className="text-red-500">{`${errors.phone.message}`}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Loại hình kinh doanh</Label>
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value)}
                    className="flex gap-4 items-center justify-between"
                    {...field}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="personal" id="r1" />
                      <Label htmlFor="r1">Cá nhân</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="r2" />
                      <Label htmlFor="r2">Công ty</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="r3" />
                      <Label htmlFor="r3">Hộ kinh doanh</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.businessType && (
                <p className="text-red-500">{`${errors.businessType.message}`}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Phương thức vận chuyển</Label>
              <>
                <Controller
                  name="express"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Hỏa tốc</FormLabel>
                        <FormDescription className="text-primary">
                          [COD đã được kích hoạt]
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {errors.express && (
                  <p className="text-red-500">{`${errors.express.message}`}</p>
                )}
              </>
              <>
                <Controller
                  name="fast"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Nhanh</FormLabel>
                        <FormDescription className="text-primary">
                          [COD đã được kích hoạt]
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {errors.fast && (
                  <p className="text-red-500">{`${errors.fast.message}`}</p>
                )}
              </>
              <>
                <Controller
                  name="economical"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Tiết kiệm</FormLabel>
                        <FormDescription className="text-primary">
                          [COD đã được kích hoạt]
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {errors.economical && (
                  <p className="text-red-500">{`${errors.economical.message}`}</p>
                )}
              </>
              <>
                <Controller
                  name="bulkyGoods"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Hàng cồng kềnh
                        </FormLabel>
                        <FormDescription className="text-primary">
                          [COD đã được kích hoạt]
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {errors.bulkyGoods && (
                  <p className="text-red-500">{`${errors.bulkyGoods.message}`}</p>
                )}
              </>
            </div>

            <Button
              disabled={seller.status == "pending"}
              type="submit"
              className="w-full"
            >
              {seller.status == "pending" && <SpokeSpinner size="lg" />}
              Lưu
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

export default RegisterShop
