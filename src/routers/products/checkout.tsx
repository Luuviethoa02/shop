import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Smartphone, Tag, Ticket, WalletCardsIcon } from "lucide-react"
import { useAuthStore, useCartStore } from "@/store"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Controller, FormProvider, useForm } from "react-hook-form"
import { useAddressByUserId } from "@/features/address/api/get-address-user"
import { zodResolver } from "@hookform/resolvers/zod"
import { schemaAddress } from "@/features/address/validator"
import LoadingMain from "@/components/share/LoadingMain"
import DialogList from "@/features/address/components/dialog-list"
import { z } from "zod"
import DialogShippingUnit from "@/features/checkout/components/dialog-shipping-unit"
import { SHIPPING_UNIT } from "@/features/checkout/constants"
import { address, OdersProduct, Size, stateOderItemType } from "@/types/client"
import { useCheckInfoCode } from "@/features/checkout/api/check-info-by-code"
import toast from "react-hot-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import DialogAddress from "@/features/address/components/dialog-add"
import { useCreateOder } from "@/features/oder/api/create-oder-product"
import { useCreateOderWithMomo } from "@/features/oder/api/create-oder-with-momo"
import { useNavigate } from "react-router-dom"



const formSchemaVoucher = z.object({
  voucherCode: z
    .string({
      required_error: "Bạn chưa nhập mã voucher",
    })
    .length(8, {
      message: "Mã voucher bao gồm 8 ký tự.",
    }),
})

export function CheckoutRoute() {
  const carts = useCartStore((state) => state.carts)


  const createOder = useCreateOder()
  const createOderWithMomo = useCreateOderWithMomo()
  const [open, setOpen] = useState<boolean>(false)
  const [openAddAdress, setOpenAddAdress] = useState<boolean>(false)
  const [openShipping, setOpenShipping] = useState<boolean>(false)
  const user = useAuthStore((state) => state.user)
  const { formatNumberToVND } = useFormatNumberToVND()
  const [shippingActive, setShippingActive] = useState<string>()
  const [sellerIdActive, setSellerIdActive] = useState<{
    sellerId: string
    cartId: string
  }>()
  const [stateOder, setStateOder] = useState<stateOderItemType>({})
  const [address, setAddress] = useState<address[]>()
  const [addressActive, setAddressActive] = useState<address>()

  const addresses = useAddressByUserId({ userId: user?._id })
  const checkInfoCode = useCheckInfoCode()
  const [addressEdit, setAddressEdit] = useState<address>()
  const [refresh, setRefresh] = useState<boolean>(false)
  const [typePay, setTypePay] = useState<'momo' | 'cash'>('cash')

  const methods = useForm({
    resolver: zodResolver(schemaAddress),
  })

  const methodsVoucher = useForm({
    resolver: zodResolver(formSchemaVoucher),
  })

  const navigation = useNavigate()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data)
    // Handle form submission
  }

  const getPriceByCartId = (
    cartId: string,
    discount_percentage: number | undefined
  ) => {
    if (carts?.[cartId] && discount_percentage) {
      return (
        (+carts[cartId].product.price -
          (+carts[cartId].product.price -
            (+carts[cartId].product.price * discount_percentage) / 100)) *
        carts[cartId].quantity
      )
    }
  }

  const onSubmitVoucher = (data: any) => {
    if (!sellerIdActive) {
      toast.error("Vui lòng chọn shop cần áp dụng mã voucher")
      return
    }
    if (
      Object.keys(stateOder).length > 0 &&
      stateOder[sellerIdActive.cartId]?.vouchers?.find(
        (item) => item.discount_code === data?.voucherCode
      )
    ) {
      toast.error("Mã voucher đã được sử dụng")
      return
    }

    toast.promise(
      checkInfoCode.mutateAsync(
        { data: data, sellerId: sellerIdActive.sellerId },
        {
          onSuccess: (data) => {
            if (data.data) {
              setStateOder({
                ...stateOder,
                [sellerIdActive.cartId]: {
                  vouchers: [
                    ...(stateOder?.[sellerIdActive.cartId]?.vouchers || []),
                    {
                      discount_code: data?.data?.discount_code,
                      discount_percentage: data?.data?.discount_percentage,
                      discount_amount: getPriceByCartId(
                        sellerIdActive.cartId,
                        data?.data?.discount_percentage
                      )!,
                      description: data?.data?.description,
                    },
                  ],
                  type_tranfer:
                    stateOder?.[sellerIdActive.cartId]?.type_tranfer,
                  totalPrice:
                    stateOder[sellerIdActive.cartId]?.totalPrice -
                    getPriceByCartId(
                      sellerIdActive.cartId,
                      data?.data?.discount_percentage
                    )!,
                },
              })
              return data
            }
          },
          onError: (error) => {
            return error
          },
        }
      ),
      {
        loading: "Đang kiểm tra mã voucher...",
        success: (data) => `Success: ${data.message || "Mã voucher hợp lệ"}`,
        error: (error) =>
          `Error: ${error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"}`,
      }
    )
  }

  const handleShippingUnitClick = (id: string) => {
    setOpenShipping(true)
    setShippingActive(id)
  }
  const getTotalPrice = () => {
    return Object.values(carts).reduce(
      (acc, cur) => acc + cur.quantity * +cur.product.price,
      0
    ) +
      Object.values(stateOder).reduce(
        (acc, cur) =>
          acc + SHIPPING_UNIT[cur.type_tranfer].price_shipped,
        0
      ) -
      Object.values(stateOder).reduce(
        (acc, cur) =>
          acc +
          (cur?.vouchers?.reduce(
            (acc, cur) => acc + cur?.discount_amount,
            0
          ) ?? 0),
        0
      )
  }

  const handleOpenchangeVoucher = (
    value: boolean,
    sellerId: string,
    cartId: string
  ) => {
    if (value) {
      setSellerIdActive({
        sellerId,
        cartId,
      })
    } else {
      setSellerIdActive(undefined)
      methodsVoucher.reset()
    }
  }

  const handleCancelApplyDiscount = (cartId: string, discount_code: string) => {
    const newVouchers = stateOder[cartId]?.vouchers?.filter(
      (item) => item.discount_code !== discount_code
    )

    const newTotalPrice =
      stateOder[cartId]?.totalPrice +
      stateOder[cartId]?.vouchers?.find(
        (item) => item.discount_code === discount_code
      )?.discount_amount!

    setStateOder({
      ...stateOder,
      [cartId]: {
        ...stateOder[cartId],
        vouchers: newVouchers,
        totalPrice: newTotalPrice,
      },
    })
  }

  const getProductOderDetai = () => {
    const oderDetail: OdersProduct['oderDetails'][] = []
    if (Object.entries(carts).length > 0) {
      Object.entries(carts).forEach(([id, cartItem]) => {
        const oderDetailItem: OdersProduct['oderDetails'] = {
          product: cartItem.product.name,
          sellerId: cartItem.selelrId._id,
          price: +cartItem.product.price,
          quantity: cartItem.quantity,
          vouchers: stateOder[id].vouchers,
          color: cartItem.color,
          size: cartItem.size,
          type_tranfer: {
            name: stateOder[id]?.type_tranfer,
            fee: SHIPPING_UNIT[stateOder[id]?.type_tranfer]?.price_shipped
          }
        }
        oderDetail.push(oderDetailItem)
      })
    }

    return oderDetail
  }

  const handleClickOder = () => {
    if (user?._id && addressActive) {
      const oder: OdersProduct['oder'] = {
        user_id: user?._id!,
        address_id: { ...addressActive },
        type_pay: typePay,
        totalPrice: getTotalPrice()
      }
      const oderDetails: OdersProduct['oderDetails'][] = getProductOderDetai()

      if (typePay === 'momo') {
        toast.promise(createOderWithMomo.mutateAsync({
          data: { oder, oderDetails }
        }, {
          onSuccess(data, variables, context) {
            history.replaceState(null, '', '/order-summary');
            location.href = data.payUrl;
          },
          onError(error, variables, context) {
            console.log("Error momo", error);
            toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại")
            return;
          }
        }
        ), {
          loading: "Đang chuyển hướng đến thanh toán...",
          success: "Chuyển hướng thanh toán thành công",
          error: "Có lỗi xảy ra, vui lòng thử lại"
        })
      } else {
        toast.promise(createOder.mutateAsync({
          data: { oder, oderDetails }
        },{
        onSuccess(data, variables, context) {
          navigation('/order-successfully')
        },
        }), {
          loading: "Đang xử lý đơn hàng...",
          success: "Đặt hàng thành công",
          error: "Có lỗi xảy ra, vui lòng thử lại"
        })
      }
    }
  }

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


  useEffect(() => {
    if (addressActive) {
      methods.setValue("name", addressActive?.name)
      methods.setValue("phone", addressActive?.phone)
      methods.setValue("city", addressActive?.city.split('-')[1])
      methods.setValue("district", addressActive?.district.split('-')[1])
      methods.setValue("ward", addressActive?.ward)
      methods.setValue("address", addressActive?.address)
    }

  }, [addressActive])

  useEffect(() => {
    if (carts) {
      let result: stateOderItemType = {}
      Object.entries(carts).forEach(([id, cartItem]) => {
        result[id] = {
          type_tranfer: "fast",
          totalPrice:
            cartItem.quantity * +cartItem.product.price +
            SHIPPING_UNIT["fast"].price_shipped,
          vouchers: [],
        }
      })
      setStateOder(result)
    }
  }, [carts])

  useEffect(() => {
    if (refresh) {
      addresses.refetch()
    }
  }, [refresh])

  return (
    <div className="grid md:grid-cols-1 gap-8 max-w-6xl mx-auto py-8 px-4">
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
                    <div className="border-b-2 pb-5 border-collapse">
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
                            <p className="text-muted-foreground capitalize text-sm">
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
                      <div className="w-full space-y-2">
                        {/* voucher shop */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <Ticket color="#878787" />
                            <blockquote className="border-l-2 italic pl-2">
                              {cartItem.selelrId.businessName}
                            </blockquote>
                          </div>
                          <div>
                            <DropdownMenu
                              onOpenChange={(value) =>
                                handleOpenchangeVoucher(
                                  value,
                                  cartItem.selelrId._id,
                                  id
                                )
                              }
                            >
                              <DropdownMenuTrigger asChild>
                                <p className="block font-normal cursor-pointer text-lg text-destructive">
                                  Chọn Voucher
                                </p>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <Card className="w-full max-w-md mx-auto">
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <Avatar className="size-10 border">
                                        <AvatarImage
                                          src={cartItem.selelrId.logo}
                                          alt={cartItem.selelrId.businessName}
                                        />
                                        <AvatarFallback className="font-semibold">
                                          {getInitials(
                                            cartItem.selelrId.businessName
                                          )}{" "}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="font-normal">
                                        {cartItem.selelrId.businessName}
                                      </span>
                                    </CardTitle>
                                    <CardDescription>
                                      Nhập mã phiếu giảm giá của bạn để được
                                      giảm giá
                                    </CardDescription>
                                  </CardHeader>
                                  <form
                                    onSubmit={methodsVoucher.handleSubmit(
                                      onSubmitVoucher
                                    )}
                                  >
                                    <CardContent>
                                      <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-2">
                                          <Label htmlFor="voucherCode">
                                            Mã Voucher
                                          </Label>
                                          <div className="flex items-center w-full max-w-sm border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                                            <div className="pl-3 py-2">
                                              <Tag className="size-5 text-gray-500" />
                                            </div>
                                            <Controller
                                              name="voucherCode"
                                              control={methodsVoucher.control}
                                              render={({ field }) => (
                                                <Input
                                                  type="text"
                                                  placeholder="Nhập mã voucher"
                                                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                  {...field}
                                                />
                                              )}
                                            />
                                          </div>
                                          {methodsVoucher.formState.errors
                                            .voucherCode && (
                                              <p className="text-red-500">{`${methodsVoucher.formState.errors.voucherCode.message}`}</p>
                                            )}
                                        </div>
                                      </div>
                                    </CardContent>
                                    <CardFooter>
                                      <Button
                                        type="submit"
                                        className="w-full capitalize"
                                      >
                                        áp dụng
                                      </Button>
                                    </CardFooter>
                                  </form>
                                </Card>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        {/* voucher info */}

                        {Object.keys(stateOder).length > 0 &&
                          stateOder[id]?.vouchers?.map((voucher) => (
                            <div className="flex items-center justify-between">
                              <div className="basis-1/3">
                                Voucher:{" "}
                                <span className="uppercase font-semibold">
                                  {voucher.discount_code}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-destructive">
                                  -{voucher.discount_percentage}%
                                </h3>
                                <span className="capitalize">
                                  {voucher.description}
                                </span>
                              </div>

                              <div className="font-normal">
                                <p>
                                  - {formatNumberToVND(voucher.discount_amount)}
                                </p>
                                <p
                                  onClick={() =>
                                    handleCancelApplyDiscount(
                                      id,
                                      voucher.discount_code
                                    )
                                  }
                                  className="text-destructive cursor-pointer hover:underline text-sm normal-case"
                                >
                                  Hủy áp dụng
                                </p>
                              </div>
                            </div>
                          ))}

                        <div className="flex items-center justify-between">
                          <div className="basis-1/3">
                            Đơn vị vận chuyển:{" "}
                            <p
                              onClick={() => handleShippingUnitClick(id)}
                              className="block font-normal cursor-pointer text-lg text-destructive"
                            >
                              Thay đổi
                            </p>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium capitalize">
                              {`${SHIPPING_UNIT[stateOder[id]?.type_tranfer]?.lable}`}
                            </h3>
                            <span className="font-semibold">
                              Nhận hàng vào{" "}
                              {`${SHIPPING_UNIT[stateOder[id]?.type_tranfer]?.day.join(" - ")}`}
                            </span>
                          </div>
                          <div className="font-normal">{`${formatNumberToVND(SHIPPING_UNIT[stateOder[id]?.type_tranfer]?.price_shipped)}`}</div>
                        </div>
                        <div className="float-right flex items-center gap-7">
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            Tổng số tiền ({cartItem.quantity} sản phẩm):
                          </p>
                          <div className="font-semibold text-xl text-destructive">
                            {formatNumberToVND(stateOder[id]?.totalPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="w-full flex items-center justify-between">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  Thông tin vận chuyển
                </h4>

                {(addresses.data?.data && addresses.data.data.length > 0) ? (<p
                  className="cursor-pointer text-base hover:underline hover:text-primary transition-all duration-100"
                  onClick={() => setOpen(true)}
                >
                  Thay đổi
                </p>) : (<p
                  className="cursor-pointer text-base hover:underline hover:text-primary transition-all duration-100"
                  onClick={() => setOpenAddAdress(true)}
                >
                  Thêm địa chỉ
                </p>)
                }

              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(addresses.status === "pending" || addresses.isFetching) && <LoadingMain />}
            {(addresses.status === "success" && !addresses.isFetching) &&
              (addresses.data.data.length == 0 ? (
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
            <RadioGroup defaultValue={typePay} onValueChange={(value: 'cash' | 'momo') => setTypePay(value)} className="grid gap-4">
              <div>
                <RadioGroupItem
                  value="cash"
                  id="cash"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="cash"
                  className="flex items-center gap-3 rounded-md border border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <WalletCardsIcon className="h-6 w-6" />
                  <span>Thanh toán khi nhận hàng</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="momo"
                  id="momo"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="momo"
                  className="flex items-center gap-3 rounded-md border border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Smartphone className="h-6 w-6" />
                  <span>Thanh toán momo</span>
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
                <p>Tổng đơn hàng</p>
                <p className="font-medium">
                  {Object.keys(carts).length +
                    ` Đơn hàng(${Object.values(carts).reduce((acc, cur) => acc + cur.quantity, 0)} sản phẩm)`}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>Tổng Tiền hàng</p>
                <p className="font-medium">
                  {formatNumberToVND(
                    Object.values(carts).reduce(
                      (acc, cur) => acc + cur.quantity * +cur.product.price,
                      0
                    )
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>Phí vận chuyển</p>
                <p className="font-medium">
                  {formatNumberToVND(
                    Object.values(stateOder).reduce(
                      (acc, cur) =>
                        acc + SHIPPING_UNIT[cur.type_tranfer].price_shipped,
                      0
                    )
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>Voucher giảm</p>
                <p className="font-medium text-destructive">
                  {Object.values(stateOder).reduce(
                    (acc, cur) =>
                      acc +
                      (cur?.vouchers?.reduce(
                        (acc, cur) => acc + cur?.discount_amount,
                        0
                      ) ?? 0),
                    0
                  ) == 0
                    ? "0 đ"
                    : "- " +
                    formatNumberToVND(
                      Object.values(stateOder).reduce(
                        (acc, cur) =>
                          acc +
                          (cur?.vouchers?.reduce(
                            (acc, cur) => acc + cur?.discount_amount,
                            0
                          ) ?? 0),
                        0
                      )
                    )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>Thuế</p>
                <p className="font-medium">{0 + " đ"}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="font-medium">Tổng cộng</p>
                <p className="text-primary font-bold">
                  {formatNumberToVND(
                    Object.values(carts).reduce(
                      (acc, cur) => acc + cur.quantity * +cur.product.price,
                      0
                    ) +
                    Object.values(stateOder).reduce(
                      (acc, cur) =>
                        acc + SHIPPING_UNIT[cur.type_tranfer].price_shipped,
                      0
                    ) -
                    Object.values(stateOder).reduce(
                      (acc, cur) =>
                        acc +
                        (cur?.vouchers?.reduce(
                          (acc, cur) => acc + cur?.discount_amount,
                          0
                        ) ?? 0),
                      0
                    )
                  )}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleClickOder} disabled={(addresses?.data?.data?.length ?? 0) === 0} className="w-full">
              Đặt hàng
            </Button>
          </CardFooter>
        </Card>
      </div>

      <DialogList
        addressActive={addressActive}
        setAddressActive={setAddressActive}
        address={address}
        setAddress={setAddress}
        open={open} setOpen={setOpen} />

      <DialogShippingUnit
        open={openShipping}
        setOpen={setOpenShipping}
        shippingActive={shippingActive}
        stateOder={stateOder}
        setStateOder={setStateOder}
      />

      <DialogAddress
        refresh={refresh}
        setRefresh={setRefresh}
        addressEdit={addressEdit}
        setAddressEdit={setAddressEdit}
        open={openAddAdress}
        setOpen={setOpenAddAdress}
      />
    </div>
  )
}
