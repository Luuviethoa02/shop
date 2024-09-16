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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductSellerId } from "@/features/products/api/get-sellerIdProduct"
import { LIMIT_PAE_PRODUCT_LIST } from "@/features/products/constants"
import { useDiscountSellerId } from "@/features/saleProduct/api/get-discount-sellerId"
import DialogAddDiscount from "@/features/saleProduct/components/dialog-add-discount"
import DialogAddProductDiscount from "@/features/saleProduct/components/dialog-add-product"
import DialogDetailDiscount from "@/features/saleProduct/components/dialog-detail-discount"
import { ObjectStatusDiscount } from "@/features/saleProduct/constants"
import useFormatDateVN from "@/hooks/useFormatDateVN"
import {
  checkDateStatus,
  getInitials,
} from "@/lib/utils"
import { useAuthStore } from "@/store"
import { productRespose } from "@/types/api"
import { Discount, queryKeyProducts, Seller } from "@/types/client"
import { CalendarIcon, MoreHorizontal } from "lucide-react"
import React, { useEffect, useState } from "react"
import Countdown from "react-countdown"
import toast from "react-hot-toast"
import { isBefore, parse } from "date-fns"
import LoadingMain from "@/components/share/LoadingMain"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteDiscount } from "@/features/saleProduct/api/delete-discount"

export const SaleRoute = () => {
  const currentUser = useAuthStore((state) => state.user)
  const [page, setPage] = useState(1)
  const [currentDiscount, setCurrentDistcount] = useState<Discount>()
  const [discountIdCheck, setDiscountIdCheck] = useState<string>()
  const { formatDate } = useFormatDateVN()

  const [queryKey, setQueryKey] = useState<queryKeyProducts>({
    page,
    limit: LIMIT_PAE_PRODUCT_LIST,
    sellerId: (currentUser?.sellerId as Seller)._id,
    status: "active",
  })

  const [productApply, setProductApply] = useState<productRespose[]>()
  const [productAdd, setProductAdd] = useState<productRespose[]>()
  const [discountDetail, setDiscountDetail] = useState<Discount>()

  const { data: discountApi, status: statusGet } = useDiscountSellerId(queryKey)

  const deleteDiscount = useDeleteDiscount(queryKey)

  const products = useProductSellerId(queryKey)

  const [showModal, setShowModalAdd] = useState(false)
  const [showModalDetail, setShowModaDetail] = useState(false)
  const [viewDetail, setViewdetail] = useState(false)
  const [showModalAddproduct, setShowModalAddproduct] = useState(false)
  const [dialog, setDialog] = useState(false)

  const handleClickDetail = (discount: Discount) => {
    setShowModaDetail(true)
    setCurrentDistcount(discount)
  }

  const handleClickAdd = (discount: Discount) => {
    setShowModalAddproduct(true)
    setCurrentDistcount(discount)
  }

  useEffect(() => {
    if (products.data?.data && discountApi?.data && currentDiscount) {
      const productApply = products.data.data.filter((product) => {
        return currentDiscount?.productIds.find(
          (discount) => discount._id === product._id
        )
      })
      const productAdd = products.data.data.filter((product) => {
        return !currentDiscount?.productIds.find(
          (discount) => discount._id === product._id
        )
      })
      setProductAdd(productAdd)
      setProductApply(productApply)
    }
  }, [currentDiscount, products.data?.data, discountApi?.data])

  useEffect(() => {
    if (!showModal) {
      setCurrentDistcount(undefined)
    }
  }, [showModal])

  useEffect(() => {
    if (!showModalDetail) {
      setCurrentDistcount(undefined)
    }
  }, [showModalDetail])

  useEffect(() => {
    setQueryKey({
      page,
      limit: LIMIT_PAE_PRODUCT_LIST,
      sellerId: (currentUser?.sellerId as Seller)._id,
      status: "active",
    })
  }, [page, LIMIT_PAE_PRODUCT_LIST, (currentUser?.sellerId as Seller)._id])

  const handleCLicConfirmkDelete = () => {
    if (discountIdCheck) {
      toast.promise(
        deleteDiscount.mutateAsync({ discountId: discountIdCheck }),
        {
          loading: "Đang Xóa mã giảm giá...",
          success: "Xóa mã giảm giá thành công",
          error: "Có lỗi xảy ra, vui lòng thử lại sau",
        }
      )
      setDialog(false)
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
      setDialog(false)
    }
  }

  if (statusGet == "success" && (discountApi?.data?.length ?? 0) === 0) {
    return (
      <div className="flex items-center flex-col min-h-full gap-7 justify-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Hiện chưa có mã giảm giá nào!
        </h2>
        <Button size="sm" onClick={() => setShowModalAdd(true)}>
          Thêm mới mã giảm giá
        </Button>
        <DialogAddDiscount
          queryKey={queryKey}
          open={showModal}
          setOpen={setShowModalAdd}
        />
      </div>
    )
  }

  const handleClickRemove = (discount: Discount) => {
    setDialog(true)
    setDiscountIdCheck(discount._id)
  }

  const handleClickViewDetail = (discount: Discount) => {
    setViewdetail(true)
    setDiscountDetail(discount)
  }

  useEffect(() => {
    if (!dialog) {
      setDiscountIdCheck(undefined)
    }
  }, [dialog])

  useEffect(() => {
    if (!viewDetail) {
      setDiscountDetail(undefined)
    }
  }, [viewDetail])

  const DiscountTimer = ({
    startDate,
    endDate,
  }: {
    startDate: string
    endDate: string
  }) => {
    const dateFormat = "MMMM do, yyyy HH:mm:ss"
    const now = new Date()

    const parsedStartDay = parse(startDate, dateFormat, new Date())
    const parsedEndDay = parse(endDate, dateFormat, new Date())

    // Renderer để tùy chỉnh hiển thị cho react-countdown
    const renderer = ({
      days,
      hours,
      minutes,
      seconds,
      completed,
    }: {
      days: number
      hours: number
      minutes: number
      seconds: number
      completed: boolean
    }) => {
      if (completed) {
        return <span>0</span>
      } else {
        let reuslt = ""
        if (days > 0) {
          reuslt = `${days} ngày `
        }
        if (hours > 0) {
          reuslt = `${reuslt} ${hours} giờ `
        }
        if (minutes > 0) {
          reuslt = `${reuslt} ${minutes} phút `
        }
        if (seconds > 0) {
          reuslt = `${reuslt} ${seconds} giây `
        }
        return <span>{reuslt}</span>
      }
    }

    return (
      <div>
        {/* Nếu hiện tại nhỏ hơn start_date, đếm ngược đến khi kích hoạt */}
        {isBefore(now, parsedStartDay) ? (
          <>
            {"Áp dụng sau"} :{" "}
            <Countdown date={parsedStartDay.getTime()} renderer={renderer} />
          </>
        ) : isBefore(now, parsedEndDay) ? (
          <>
            {/* Nếu đã kích hoạt, đếm ngược thời gian còn lại đến end_date */}
            <Countdown date={parsedEndDay.getTime()} renderer={renderer} />
          </>
        ) : (
          <p>0</p>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-0 flex min-h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        {(discountApi?.data?.length ?? 0) > 0 && (
          <Button size="sm" onClick={() => setShowModalAdd(true)}>
            Thêm mới mã giảm giá
          </Button>
        )}
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left">Mã giảm giá</th>
              <th className="px-4 py-3 text-left">Phần trăm giảm</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thời hạn</th>
              <th className="px-4 py-3 text-right">Hành động</th>
              <th className="px-4 py-3 text-right"></th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {statusGet === "pending" &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div>
                        <Skeleton className="h-5 w-40" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-4 py-5">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-4 py-5">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-4 ml-10 py-5 text-right">
                    <Skeleton className="h-5 w-16 ml-3" />
                  </td>
                  <td className="px-4 py-5 text-right">
                    <Skeleton className="h-5 w-16" />
                  </td>
                </tr>
              ))}

            {statusGet === "success" &&
              discountApi?.data?.map((discount) => (
                <tr
                  key={discount._id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium flex items-center gap-4 max-w-80">
                    <p className="line-clamp-2">{discount.discount_code}</p>
                  </td>
                  <td className="px-7 py-3">
                    <div className="flex items-center gap-4">
                      <p className="capitalize">
                        {discount.discount_percentage + "%"}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center font-medium">
                    <Badge
                      variant={
                        ObjectStatusDiscount[
                          checkDateStatus(
                            discount.start_date,
                            discount.end_date
                          )
                        ].variant as
                          | "default"
                          | "secondary"
                          | "destructive"
                          | "outline"
                      }
                      className={
                        ObjectStatusDiscount[
                          checkDateStatus(
                            discount.start_date,
                            discount.end_date
                          )
                        ].cn
                      }
                    >
                      {React.createElement(
                        ObjectStatusDiscount[
                          checkDateStatus(
                            discount.start_date,
                            discount.end_date
                          )
                        ].Icon,
                        {
                          className: "w-4 h-4 mr-1",
                        }
                      )}
                      {
                        ObjectStatusDiscount[
                          checkDateStatus(
                            discount.start_date,
                            discount.end_date
                          )
                        ].text
                      }
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {
                      <DiscountTimer
                        startDate={discount.start_date}
                        endDate={discount.end_date}
                      />
                    }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-3 justify-end">
                      {checkDateStatus(
                        discount.start_date,
                        discount.end_date
                      ) == "active" ? (
                        <>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleClickDetail(discount)}
                              >
                                Sản phẩm áp dụng
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleClickAdd(discount)}
                              >
                                Thêm sản phẩm
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleClickViewDetail(discount)}
                              >
                                chi tiết
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleClickViewDetail(discount)}
                              >
                                Xem chi tiết
                              </DropdownMenuItem>
                              {checkDateStatus(
                                discount.start_date,
                                discount.end_date
                              ) == "expired" && (
                                <DropdownMenuItem
                                  onClick={() => handleClickRemove(discount)}
                                >
                                  Xóa
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        {(discountApi?.data?.length ?? 0) > 0 && (
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
                length: Math.ceil(discountApi?.total! / LIMIT_PAE_PRODUCT_LIST),
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
                    Math.ceil(discountApi?.total! / LIMIT_PAE_PRODUCT_LIST)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={() => setPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <AlertDialog open={dialog} onOpenChange={setDialog}>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa mã giảm giá ?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mã giảm giá này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <Button variant={"destructive"} onClick={handleCLicConfirmkDelete}>
              Xác nhận
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={viewDetail} onOpenChange={setViewdetail}>
        <DialogContent
          className="max-w-3xl "
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Chi tiết mã giảm giá</DialogTitle>
            <DialogDescription>
              {!discountDetail && (
                <Card className="w-full max-w-2xl mt-4 mx-auto">
                  <LoadingMain />
                </Card>
              )}
              {discountDetail && (
                <Card className="w-full max-w-2xl mt-4 mx-auto">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-bold">
                        Mã giảm giá: {discountDetail?.discount_code}
                      </CardTitle>
                      <Badge
                        variant={
                          ObjectStatusDiscount[
                            checkDateStatus(
                              discountDetail?.start_date!,
                              discountDetail?.end_date!
                            )
                          ].variant as
                            | "default"
                            | "secondary"
                            | "destructive"
                            | "outline"
                        }
                        className={
                          ObjectStatusDiscount[
                            checkDateStatus(
                              discountDetail?.start_date!,
                              discountDetail?.end_date!
                            )
                          ].cn
                        }
                      >
                        {React.createElement(
                          ObjectStatusDiscount[
                            checkDateStatus(
                              discountDetail?.start_date!,
                              discountDetail?.end_date!
                            )
                          ].Icon,
                          {
                            className: "w-4 h-4 mr-1",
                          }
                        )}
                        {
                          ObjectStatusDiscount[
                            checkDateStatus(
                              discountDetail?.start_date!,
                              discountDetail?.end_date!
                            )
                          ].text
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 capitalize">giảm</h3>
                      <p className="text-3xl text-primary font-bold">
                        {discountDetail?.discount_percentage}%
                      </p>
                    </div>
                    <div className="grid grid-cols-2 w-full gap-4">
                      <div className="w-1/2">
                        <h3 className="font-semibold mb-2">
                          Thời gian bắt đầu
                        </h3>
                        <p className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {discountDetail?.start_date}
                        </p>
                      </div>
                      <div className="flex items-end justify-end flex-col">
                        <h3 className="font-semibold mb-2">
                          Thời gian kết thúc
                        </h3>
                        <p className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {discountDetail?.end_date}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-semibold mb-2">Tạo Bởi</h3>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10 border">
                              <AvatarImage
                                src={(currentUser?.sellerId as Seller)?.logo}
                                alt={
                                  (currentUser?.sellerId as Seller)
                                    ?.businessName
                                }
                              />
                              <AvatarFallback>
                                {" "}
                                {getInitials(
                                  (currentUser?.sellerId as Seller)
                                    ?.businessName
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {(currentUser?.sellerId as Seller)?.businessName}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-semibold mb-2">Thời gian tạo</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(discountDetail?.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div>
                      <h3 className="font-semibold mb-2">
                        Chi tiết mã giảm giá
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {discountDetail?.description || ""}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <DialogAddDiscount
        queryKey={queryKey}
        open={showModal}
        setOpen={setShowModalAdd}
      />

      <DialogDetailDiscount
        queryKey={queryKey}
        open={showModalDetail}
        currentDiscount={currentDiscount}
        setOpen={setShowModaDetail}
        productApply={productApply}
      />

      <DialogAddProductDiscount
        queryKey={queryKey}
        open={showModalAddproduct}
        setOpen={setShowModalAddproduct}
        productAdd={productAdd}
        currentDiscount={currentDiscount}
      />
    </div>
  )
}
