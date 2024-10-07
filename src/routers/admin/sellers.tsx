import LoadingMain from "@/components/share/LoadingMain"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useGetAllSellers } from "@/features/seller/api/get-all-sellers"
import useFormatDateVN from "@/hooks/useFormatDateVN"
import { getInitials } from "@/lib/utils"
import { Seller, User } from "@/types/client"
import { CheckCircle, Clock, EyeIcon, FilePenIcon, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { schemaSeller } from "@/features/seller/validators"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useCreateSeller } from "@/features/seller/api/create.seller"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SpokeSpinner } from "@/components/ui/spinner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useUpdateStatusSeller } from "@/features/seller/api/update-status"
import toast from "react-hot-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const LIMIT_PAGE_SELLERS = 7

export const SellerRoute = () => {
  const [itemDetail, setItemDetail] = useState<Seller & { user: User }>()
  const [open, setOpen] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  const sellers = useGetAllSellers({ page })
  const updateStatus = useUpdateStatusSeller({ page })

  const { formatDate } = useFormatDateVN()

  const methods = useForm({
    resolver: zodResolver(schemaSeller),
    defaultValues: itemDetail,
  })

  const { handleSubmit, reset, control } = methods

  const onSubmit = (data: any) => {}

  const hanldeClickUpdateStatus = (
    status: "finished" | "rejected",
    id: string
  ) => {
    toast.promise(
      updateStatus.mutateAsync(
        {
          status: status,
          sellerId: id,
        },
        {
          onSuccess(data, variables, context) {
            setOpen(false)
          },
        }
      ),
      {
        loading: "Đang cập nhật trạng thái",
        success: "cập nhật trạng thái kênh bán hàng thành công",
        error: "có lỗi xảy ra vui lòng thử lại sau!",
      }
    )
  }

  const handleClickViewDetail = (seller: Seller & { user: User }) => {
    setItemDetail(seller)
    setOpen(true)
  }

  useEffect(() => {
    if (itemDetail) {
      reset({
        ...itemDetail,
        email: itemDetail.user.email,
      })
    }
  }, [itemDetail])

  useEffect(() => {
    if (!open) {
      setItemDetail(undefined)
    }
  }, [open])

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer">Người dùng</TableHead>
            <TableHead className="cursor-pointer">Tên kênh</TableHead>
            <TableHead className="cursor-pointer">Địa chỉ</TableHead>
            <TableHead className="text-right">Thời gian tạo kênh</TableHead>
            <TableHead className="text-right">Trạng thái kênh</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers?.status === "pending" ? (
            <div className="flex items-center justify-center w-full">
              <LoadingMain />
            </div>
          ) : (
            sellers?.data?.data.map((seller) => (
              <TableRow key={seller?._id}>
                <TableCell className="font-normal flex items-center gap-2">
                  <Avatar className="size-12 border">
                    <AvatarImage
                      src={seller.user.username}
                      alt={seller.user.username}
                    />
                    <AvatarFallback>
                      {" "}
                      {getInitials(seller.user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{seller.user.username}</span>
                </TableCell>
                <TableCell className="font-semibold">
                  {seller.businessName}
                </TableCell>
                <TableCell>{seller.city}</TableCell>
                <TableCell className="text-right">
                  {formatDate(seller.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  {seller.status === "wait" ? (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Chờ xác nhận
                    </Badge>
                  ) : seller.status === "finished" ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Đã xác nhận
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 hover:bg-red-600">
                      <XCircle className="w-4 h-4 mr-2" />
                      Đã từ chối
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleClickViewDetail(seller)}
                    variant="outline"
                    size="icon"
                  >
                    <EyeIcon className="w-5 h-5" />
                    <span className="sr-only">xem chi tiết</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {Math.floor((sellers?.data?.total ?? 0) / (sellers?.data?.limit ?? 1)) >
        0 && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={() => setPage(page - 1)}
                />
              </PaginationItem>
              {Array.from({
                length: Math.ceil(sellers?.data?.total! / LIMIT_PAGE_SELLERS),
              }).map((_, p) => (
                <PaginationItem className="cursor-pointer" key={p}>
                  <PaginationLink
                    isActive={p + 1 === page}
                    onClick={() => setPage(p + 1)}
                  >
                    {p + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className={
                    page ===
                    Math.ceil(sellers?.data?.total! / LIMIT_PAGE_SELLERS)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={() => setPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onOpenAutoFocus={(e: Event) => e.preventDefault()}
          className="max-w-2xl overflow-y-auto scroll-smooth max-h-screen"
        >
          <DialogTitle>Chi tiết kênh bán hàng</DialogTitle>
          {itemDetail && (
            <>
              <Card className="max-w-4xl overflow-y-auto mt-4 mx-auto">
                <CardContent className="grid gap-6 w-full">
                  <FormProvider {...methods}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-2 p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="grid gap-4 w-full">
                          <div className="space-y-2">
                            <Label htmlFor="businessName">Tên Shop</Label>
                            <Controller
                              name="businessName"
                              control={control}
                              render={({ field }) => (
                                <Input disabled id="businessName" {...field} />
                              )}
                            />
                          </div>
                        </div>
                        <div className="space-y-2 w-full">
                          <Label htmlFor="email">Email</Label>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <Input
                                disabled
                                id="email"
                                type="email"
                                {...field}
                              />
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
                                <Input disabled {...field} />
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
                                <Input disabled {...field} />
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
                                <Input disabled {...field} />
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
                                disabled
                                id="addressDetail"
                                {...field}
                                placeholder="Nhập số nhà tên đường.v.v..."
                                className="min-h-[100px]"
                              />
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
                            <Input disabled id="phone" type="tel" {...field} />
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessType">
                          Loại hình kinh doanh
                        </Label>
                        <Controller
                          name="businessType"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              disabled
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessType">
                          Phương thức vận chuyển
                        </Label>
                        <>
                          <Controller
                            name="express"
                            control={control}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Hỏa tốc
                                  </FormLabel>
                                  <FormDescription className="text-primary">
                                    [COD đã được kích hoạt]
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    disabled
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-readonly
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </>
                        <>
                          <Controller
                            name="fast"
                            control={control}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Nhanh
                                  </FormLabel>
                                  <FormDescription className="text-primary">
                                    [COD đã được kích hoạt]
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    disabled
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-readonly
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </>
                        <>
                          <Controller
                            name="economical"
                            control={control}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Tiết kiệm
                                  </FormLabel>
                                  <FormDescription className="text-primary">
                                    [COD đã được kích hoạt]
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    disabled
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-readonly
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
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
                                    disabled
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-readonly
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </>
                      </div>
                    </form>
                  </FormProvider>
                </CardContent>
              </Card>
              {itemDetail.status === "wait" && (
                <>
                  <Button
                    onClick={() =>
                      hanldeClickUpdateStatus("finished", itemDetail._id)
                    }
                    className="bg-green-400 hover:bg-green-300"
                  >
                    Xác nhận
                  </Button>
                  <Button
                    onClick={() =>
                      hanldeClickUpdateStatus("rejected", itemDetail._id)
                    }
                    variant={"destructive"}
                  >
                    Từ chối
                  </Button>
                </>
              )}

              {itemDetail.status === "finished" && (
                <Button
                  onClick={() =>
                    hanldeClickUpdateStatus("rejected", itemDetail._id)
                  }
                  variant={"destructive"}
                >
                  Từ chối
                </Button>
              )}

              {itemDetail.status === "rejected" && (
                <Button
                  onClick={() =>
                    hanldeClickUpdateStatus("finished", itemDetail._id)
                  }
                  variant={"secondary"}
                >
                  Phục hồi
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
