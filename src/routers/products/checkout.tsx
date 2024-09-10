import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CreditCardIcon, Plus, WalletCardsIcon } from "lucide-react"
import { useAuthStore, useCartStore } from "@/store"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { useEffect, useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import {
  useFetchDistricts,
  useFetchProvinces,
  useFetchWards,
} from "@/hooks/useProvinces"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { FormLabel } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddressByUserId } from "@/features/address/api/get-address-user"
import { schemaAddress } from "@/features/address/validator"
import DialogAddress from "@/features/address/components/dialog-add"
import DialogList from "@/features/address/components/dialog-list"

export function CheckoutRoute() {
  const carts = useCartStore((state) => state.carts)
  const [open, setOpen] = useState<boolean>(false)
  const user = useAuthStore((state) => state.user)
  const { formatNumberToVND } = useFormatNumberToVND()
  const userAddress = useAddressByUserId({ userId: user?._id })

  const total = useMemo(() => {
    return Object.values(carts).reduce((acc, cartItem) => {
      return acc + Number(cartItem.product.price) * cartItem.quantity
    }, 0)
  }, [carts])

  const methods = useForm({
    resolver: zodResolver(schemaAddress),
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data)
    // Handle form submission
  }

  useEffect(() => {
    if (userAddress?.data?.data) {
      methods.setValue("name", userAddress?.data?.data[0]?.name)
      methods.setValue("phone", userAddress?.data?.data[0]?.phone)
      methods.setValue("city", userAddress?.data?.data[0]?.city)
      methods.setValue("district", userAddress?.data?.data[0]?.district)
      methods.setValue("ward", userAddress?.data?.data[0]?.ward)
      methods.setValue("address", userAddress?.data?.data[0]?.address)
    }
  }, [userAddress?.data?.data])

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto py-8 px-4">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.keys(carts).length === 0 ? (
                <p>Hiện không có sản phẩm nào !</p>
              ) : (
                <>
                  {Object.entries(carts).map(([id, cartItem]) => (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={cartItem.color.image}
                            alt="Product Image"
                            width={64}
                            height={64}
                            className="rounded-md"
                            style={{ aspectRatio: "64/64", objectFit: "cover" }}
                          />
                          <div>
                            <h3 className="font-medium">
                              {cartItem.product.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Kích cỡ:{" "}
                              {`${cartItem.size.name}<${cartItem.size.weight}>`}
                              , Màu: {cartItem.color.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">
                            {formatNumberToVND(cartItem.product.price)}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            x {cartItem.quantity}
                          </p>
                        </div>
                      </div>
                    </>
                  ))}
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p className="text-muted-foreground">Tổng cộng</p>
            <p className="font-medium">{formatNumberToVND(total)}</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="w-full flex items-center justify-between">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  Thông tin vận chuyển
                </h4>
                <p
                  className="cursor-pointer text-base hover:underline hover:text-primary transition-all duration-100"
                  onClick={() => setOpen(true)}
                >
                  Thay đổi
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userAddress.status === "pending" && (
              <div className="min-h-[400px] min-w-full flex items-center justify-center">
                <div className="flex-col gap-4 w-full flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            {userAddress.status === "success" &&
              (userAddress.data.data.length == 0 ? (
                <>
                  <p className="text-destructive">
                    Vui lòng thêm địa chỉ nhận hàng
                  </p>
                </>
              ) : (
                <>
                  <FormProvider {...methods}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid gap-4"
                    >
                      <div className="grid gap-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <Input
                              disabled
                              id="name"
                              placeholder="Nhập tên của bạn"
                              {...field}
                            />
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
                              disabled
                              id="phone"
                              placeholder="Nhập số điện thoại"
                              type="tel"
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Controller
                            name="city"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="city">Thành phố</Label>
                                <Controller
                                  name="city"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      disabled
                                      id="city"
                                      type="text"
                                      {...field}
                                    />
                                  )}
                                />
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
                                <Label htmlFor="district">Quận huyện</Label>
                                <Controller
                                  name="district"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      disabled
                                      id="district"
                                      type="text"
                                      {...field}
                                    />
                                  )}
                                />
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
                                <Label htmlFor="ward">Đường/xã</Label>
                                <Controller
                                  name="ward"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      disabled
                                      id="ward"
                                      type="text"
                                      {...field}
                                    />
                                  )}
                                />
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
                              disabled
                              id="address"
                              placeholder="Nhập số nhà tên đường.v.v..."
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </form>
                  </FormProvider>
                </>
              ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phương thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="card" className="grid gap-4">
              <div>
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex items-center gap-3 rounded-md border border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCardIcon className="h-6 w-6" />
                  <span>Thanh toán momo</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="paypal"
                  id="paypal"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="paypal"
                  className="flex items-center gap-3 rounded-md border border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <WalletCardsIcon className="h-6 w-6" />
                  <span>Thanh toán khi nhận hàng</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Xem lại đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <p>Tổng cộng</p>
                <p className="font-medium">$109.97</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Shipping</p>
                <p className="font-medium">$5.00</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Tax</p>
                <p className="font-medium">$9.00</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="font-medium">Tổng cộng</p>
                <p className="font-medium">$123.97</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled className="w-full">
              Thanh toán
            </Button>
          </CardFooter>
        </Card>
      </div>

      <DialogList open={open} setOpen={setOpen} />
    </div>
  )
}
