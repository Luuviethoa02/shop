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
import { Switch } from "@/components/ui/switch"
import { useProductSellerId } from "@/features/products/api/get-sellerIdProduct"
import DialogDetail from "@/features/products/components/dialog-detail"
import { ProductDialog } from "@/features/products/components/product-dialog"
import { LIMIT_PAE_PRODUCT_LIST } from "@/features/products/constants"
import { useUpdateStatusDiscount } from "@/features/saleProduct/api/discount-dispath-active"
import { useDiscountSellerId } from "@/features/saleProduct/api/get-discount-sellerId"
import DialogAddDiscount from "@/features/saleProduct/components/dialog-add-discount"
import DialogAddProductDiscount from "@/features/saleProduct/components/dialog-add-product"
import DialogDetailDiscount from "@/features/saleProduct/components/dialog-detail-discount"
import { ObjectStatusDiscount } from "@/features/saleProduct/constants"
import useFormatDateVN from "@/hooks/useFormatDateVN"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { getInitials } from "@/lib/utils"
import { useAuthStore } from "@/store"
import { productRespose } from "@/types/api"
import { Discount, QueryKey, Seller } from "@/types/client"
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import Countdown from "react-countdown"
import toast from "react-hot-toast"

export const SaleRoute = () => {
  const currentUser = useAuthStore((state) => state.user)
  const [queryKey, setQueryKey] = useState<QueryKey>()
  const [currentDiscount, setCurrentDistcount] = useState<Discount>()
  const [discountIdCheck, setDiscountIdCheck] = useState<string>()
  const { formatDate } = useFormatDateVN()

  const [page, setPage] = useState(1)

  const [productApply, setProductApply] = useState<productRespose[]>()
  const [productAdd, setProductAdd] = useState<productRespose[]>()
  const [discountDetail, setDiscountDetail] = useState<Discount>()

  const { data: discountApi, status: statusGet } = useDiscountSellerId({
    page,
    limit: LIMIT_PAE_PRODUCT_LIST,
    sellerId: (currentUser?.sellerId as Seller)._id,
  })

  const updateStatusDiscount = useUpdateStatusDiscount({
    page,
    limit: LIMIT_PAE_PRODUCT_LIST,
    sellerId: (currentUser?.sellerId as Seller)._id,
  })

  const products = useProductSellerId({
    page,
    limit: 10,
    sellerId: (currentUser?.sellerId as Seller)._id,
  })

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
    if (!showModal || !showModalDetail) {
      setCurrentDistcount(undefined)
    }
  }, [showModal, showModalDetail])

  useEffect(() => {
    setQueryKey({
      page,
      limit: LIMIT_PAE_PRODUCT_LIST,
      sellerId: (currentUser?.sellerId as Seller)._id,
    })
  }, [page, LIMIT_PAE_PRODUCT_LIST, (currentUser?.sellerId as Seller)._id])

  const handleCLickUpdateStatus = () => {
    if (discountIdCheck) {
      toast.promise(
        updateStatusDiscount.mutateAsync({ discountId: discountIdCheck }),
        {
          loading: "Đang kích hoạt mã giảm giá...",
          success: "Kích hoạt mã giảm giá thành công",
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

  const Completionist = () => <span>You are good to go!</span>

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }:{
    hours: number,
    minutes: number,
    seconds: number,
    completed: boolean
  }) => {
    if (completed) {
      return <Completionist />
    } else {
      // Render a countdown
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      )
    }
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

  const handleCheckedChange = (discountId: string) => {
    setDiscountIdCheck(discountId)
    setDialog(true)
  }

  const handleViewDetail = (discount: Discount) => {
    setDiscountDetail(discount)
    setViewdetail(true)
  }

  return (
    <div className="container mx-auto px-4 py-8 flex min-h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
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
                        ObjectStatusDiscount[discount.is_active].variant as
                          | "default"
                          | "secondary"
                          | "destructive"
                          | "outline"
                      }
                      className={ObjectStatusDiscount[discount.is_active].cn}
                    >
                      {React.createElement(
                        ObjectStatusDiscount[discount.is_active].Icon,
                        {
                          className: "w-4 h-4 mr-1",
                        }
                      )}
                      {ObjectStatusDiscount[discount.is_active].text}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {["expried", "inactive"].includes(discount.is_active) ? (
                      0
                    ) : (
                      <Countdown
                        date={Date.now() + 360000}
                        renderer={renderer}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-3 justify-end">
                      {!["expried", "inactive"].includes(
                        discount.is_active
                      ) && (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleClickDetail(discount)}
                          >
                            Sản phẩm áp dụng
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleClickAdd(discount)}
                          >
                            Thêm Sản phẩm
                          </Button>
                          <div className="flex items-center space-x-2">
                            <Switch disabled checked id="airplane-mode" />
                            <Label htmlFor="airplane-mode">Kích hoạt</Label>
                          </div>
                        </>
                      )}

                      {["inactive"].includes(discount.is_active) && (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={false}
                              onCheckedChange={() =>
                                handleCheckedChange(discount._id)
                              }
                              id="airplane-mode"
                            />
                            <Label className="mr-5" htmlFor="airplane-mode">
                              Kích hoạt
                            </Label>
                          </div>
                          <Button
                            onClick={() => handleViewDetail(discount)}
                            variant={"outline"}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      )}

                      {["expried"].includes(discount.is_active) && (
                        <div className="flex items-center space-x-2">
                          <Switch disabled id="airplane-mode" />
                          <Label htmlFor="airplane-mode">Kích hoạt</Label>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium"></td>
                  <td className="px-4 py-3 text-right font-medium"></td>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kích hoạt mã giảm giá ?</AlertDialogTitle>
            <AlertDialogDescription>
              Sau khi kích hoạt mã giảm giá sẽ không thể hủy. Bạn có chắc chắn
              muốn kích hoạt mã giảm giá này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <Button onClick={handleCLickUpdateStatus}>Kích hoạt</Button>
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
              <Card className="w-full max-w-2xl mt-4 mx-auto">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold">
                      Mã giảm giá: {discountDetail?.discount_code}
                    </CardTitle>
                    <Badge
                      className="py-1"
                      variant={
                        discountDetail?.is_active == "active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {discountDetail?.is_active == "active" ? (
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 mr-1" />
                      )}
                      {discountDetail?.is_active &&
                        ObjectStatusDiscount[discountDetail.is_active].text}
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
                      <h3 className="font-semibold mb-2">Thời gian bắt đầu</h3>
                      <p className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {discountDetail?.start_date}
                      </p>
                    </div>
                    <div className="flex items-end justify-end flex-col">
                      <h3 className="font-semibold mb-2">Thời gian kết thúc</h3>
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
                                (currentUser?.sellerId as Seller)?.businessName
                              }
                            />
                            <AvatarFallback>
                              {" "}
                              {getInitials(
                                (currentUser?.sellerId as Seller)?.businessName
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
                    <h3 className="font-semibold mb-2">Chi tiết mã giảm giá</h3>
                    <p className="text-sm text-muted-foreground">
                      {discountDetail?.description || ""}
                    </p>
                  </div>
                </CardFooter>
              </Card>
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
