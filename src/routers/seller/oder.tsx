import LoadingMain from "@/components/share/LoadingMain"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetOderDetailBySellerId } from "@/features/oder/api/get-orderDetailBySellerId"
import useFormatDateVN from "@/hooks/useFormatDateVN"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { useAuthStore } from "@/store"
import { oderDetail, orderNotification, Seller } from "@/types/client"
import { BookText, BookX, CheckCircle, Clock, EyeIcon, FilePenIcon, LucideProps, Receipt, SquareCheckBig, XCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from 'react'
import { Package, Truck, CreditCard, User } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useUpdateStatusOrderDetail } from "@/features/oder/api/update-status-oderDetail"
import toast from "react-hot-toast"
import useSellerSocket from "@/hooks/useSellerSocket"
import { useNavigate, useParams } from "react-router-dom"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface stepTypes {
  id: number;
  status: string;
  time?: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  title: string;
  preview: 'hidden' | 'obvious'
}

const steps: stepTypes[] = [
  { id: 1, status: 'pending', Icon: BookText, title: "Thời gian đặt hàng", preview: 'hidden' },
  { id: 2, status: 'shipping', Icon: Receipt, title: "Xác nhận đơn hàng", preview: 'hidden' },
  { id: 3, status: 'shipping', Icon: Truck, title: "Đang vận chuyển", preview: 'hidden' },
  { id: 4, status: 'success', Icon: SquareCheckBig, title: "Hoàn tất", preview: 'hidden' },
]

const stepsCancels: stepTypes[] = [
  { id: 1, status: 'pending', Icon: BookText, title: "Thời gian đặt hàng", preview: 'hidden' },
  { id: 2, status: 'canceled', Icon: BookX, title: "Đã hủy đơn hàng", preview: 'hidden' },
]


const listReasons = [
  { id: 3, title: 'Sản phẩm đã hết hàng', status: false },
  { id: 4, title: 'Thông tin giao hàng sai', status: false },
  { id: 5, title: 'Khách hàng yêu cầu hủy', status: false },
  { id: 6, title: 'Thanh toán không thành công', status: false },
  { id: 7, title: 'Lỗi giá hoặc mô tả sản phẩm', status: false },
  { id: 8, title: 'Sản phẩm bị lỗi hoặc hư hỏng', status: false },
  { id: 9, title: 'Vượt quá hạn mức mua hàng', status: false },
  { id: 10, title: 'Sự cố vận chuyển', status: false },
  { id: 11, title: 'Phát hiện gian lận hoặc lừa đảo', status: false },
  { id: 12, title: 'Quá thời gian xử lý đơn hàng', status: false },
  { id: 13, title: 'Khác', status: false },
];

export const OderRoute = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [oderDetail, setOderDetail] = useState<oderDetail>()
  const [currentStep, setCurrentStep] = useState<stepTypes[]>(steps)
  const [openListReason, setOpenListReason] = useState<boolean>(false)
  const [reason, setReason] = useState<string>()


  const navigate = useNavigate()

  const [statusUpdate, setStatusUpdate] = useState<{
    status: 'success' | 'canceled' | 'shipping' | null,
    data: {
      messager: string,
      create_by: string,
      shopper: string
    } | null
  }>()

  const { user } = useAuthStore()
  const { formatDate } = useFormatDateVN()
  const { formatNumberToVND } = useFormatNumberToVND()

  const updateStatusOrder = useUpdateStatusOrderDetail({
    sellerId: (user?.sellerId as Seller)?._id!
  })

  const sellerSocket = useSellerSocket((user?.sellerId as Seller)?._id)

  const orders = useGetOderDetailBySellerId({ sellerId: (user?.sellerId as Seller)?._id })

  const params = useParams()

  useEffect(() => {
    if (params.oderDetailId && orders?.data?.data) {
      setOderDetail(orders?.data?.data?.find((order) => order._id === params.oderDetailId))
      setIsOpen(true)
    }
  }, [params.oderDetailId])


  useEffect(() => {
    if (!sellerSocket) return

    if (sellerSocket) {
      sellerSocket.on("newOrder", (data: orderNotification) => {
        orders.refetch()
      })

      return () => {
        sellerSocket.off("newOrder")
      }
    }
  }, [sellerSocket, user?.sellerId])


  const handleClickEditDetail = (order: oderDetail) => {

    for (const key in order.status_oder) {
      const element = order.status_oder[key as keyof typeof order.status_oder] as { status: boolean; created_at?: string };
      if (element.status) {
        if (key === 'canceled') {
          setCurrentStep(stepsCancels.map((step) => ({
            ...step,
            time: formatDate(order?.status_oder[step.status as keyof typeof order.status_oder].created_at),
            preview: 'obvious'
          })))
        } else {
          const stepCoppy = [...currentStep]
          const date = new Date()
          const day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
          const month = ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : (date.getDate() + 1)
          const fullDate = day + '/' + month + '/' + date.getFullYear()
          const stepId = stepCoppy.reverse().find((step) => step.status === key)?.id
          if (stepId) {
            setCurrentStep((prev) => prev.map((step) => step.id <= stepId ? { ...step, preview: 'obvious', time: (step.status === 'shipping' && step.title.startsWith('Đang')) ? fullDate : formatDate(order?.status_oder[step.status as keyof typeof order.status_oder].created_at) } : { ...step, preview: 'hidden' }))
          }
        }
      }
    }
    setOderDetail(order)
    setIsOpen(true)
  }

  useEffect(() => {
    if (!isOpen && oderDetail) {
      setOderDetail(undefined)
      setCurrentStep(steps)
      navigate('/seller/orders')
    }
    if (isOpen && oderDetail) {
      navigate(`/seller/orders/${oderDetail._id}`)
    }
  }, [isOpen])

  const handleUpdateStatusOrder = (status: | 'success' | 'canceled' | 'shipping') => {
    // messager,create_by,shopper
    if (status === 'canceled') {
      setOpenListReason(true)
    } else {
      setStatusUpdate({
        status: status,
        data: null
      })
    }
  }

  const handleUpdateCancelOrderStatus = () => {
    const data = {
      messager: reason,
      create_by: (user?.sellerId as Seller)._id!,
      shopper: 'seller'
    }
    toast.promise(updateStatusOrder.mutateAsync({
      orderDetailId: oderDetail?._id!,
      data: {
        status: 'canceled',
        ...data
      }
    }), {
      loading: 'Đang cập nhật trạng thái đơn hàng...',
      success: 'Cập nhật trạng thái đơn hàng thành công!',
      error: 'Cập nhật trạng thái đơn hàng thất bại!'
    })
    navigate('/seller/orders')
    setStatusUpdate({ status: null, data: null })
    setOpenListReason(false)
    setIsOpen(false)
    setOderDetail(undefined)
  }


  const handleConfirmUpdateStatus = () => {
    if (statusUpdate?.status) {
      toast.promise(updateStatusOrder.mutateAsync({
        orderDetailId: oderDetail?._id!,
        data: {
          status: statusUpdate.status,
          ...statusUpdate.data
        }
      }), {
        loading: 'Đang cập nhật trạng thái đơn hàng...',
        success: 'Cập nhật trạng thái đơn hàng thành công!',
        error: 'Cập nhật trạng thái đơn hàng thất bại!'
      })
      navigate('/seller/orders')
      setStatusUpdate({ status: null, data: null })
      setIsOpen(false)
      setOderDetail(undefined)
    }
  }

  if (orders.status === 'pending') {
    return (
      <div className="flex items-center justify-center w-full">
        <LoadingMain />
      </div>
    )
  }

  if (orders.data?.data && orders.data?.data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Hiện Không có đơn hàng nào!
        </h2>
      </div>
    )
  }

  return (
    <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trạng thái đơn hàng" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Trạng thái đơn hàng</SelectLabel>
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="shipping">Đang giao</SelectItem>
            <SelectItem value="success">Đã giao</SelectItem>
            <SelectItem value="canceld">Đã hủy</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
            >
              Mã đơn hàng
            </TableHead>
            <TableHead
              className="cursor-pointer"
            >
              Khách hàng

            </TableHead>
            <TableHead
              className="cursor-pointer"
            >
              Thời gian đặt hàng
            </TableHead>
            <TableHead className="text-right">Tổng cộng</TableHead>
            <TableHead className="text-right">Trạng thái đơn hàng</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {orders?.data && orders?.data?.data?.map((order) => (
            <TableRow key={order?._id}>
              <TableCell className="font-medium">{order?._id}</TableCell>
              <TableCell className="capitalize font-semibold">{order?.oder_id?.user_id?.username}</TableCell>
              <TableCell>{formatDate(order?.status_oder?.pending.created_at)}</TableCell>
              <TableCell className="text-right">
                {formatNumberToVND(order?.price * order?.quantity)}
              </TableCell>
              <TableCell className="text-right">
                {order?.status_oder?.pending?.status
                  ? (<Badge className="bg-yellow-500 hover:bg-yellow-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Chờ xác nhận
                  </Badge>)
                  : order?.status_oder?.shipping?.status
                    ? (<Badge className="bg-blue-500 hover:bg-blue-600">
                      <Truck className="w-4 h-4 mr-2" />
                      Đang vận chuyển
                    </Badge>)
                    : order?.status_oder?.success?.status
                      ? (<Badge className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Đã giao hàng
                      </Badge>)
                      : (<Badge className="bg-red-500 hover:bg-red-600">
                        <XCircle className="w-4 h-4 mr-2" />
                        Đã hủy
                      </Badge>)
                }
              </TableCell>
              <TableCell className="text-right">
                <Button onClick={() => handleClickEditDetail(order)} variant="outline" size="icon">
                  <EyeIcon className="w-5 h-5" />
                  <span className="sr-only">Xem chi tiết</span>
                </Button>
                <Button variant="outline" size="icon" className="ml-2">
                  <FilePenIcon className="w-5 h-5" />
                  <span className="sr-only">Cập nhật đơn hàng</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between pr-5 items-center">
              <span>Chi tiết đơn hàng #{oderDetail?._id}</span>
              {oderDetail?.status_oder?.pending?.status
                ? (<Badge className="bg-yellow-500 hover:bg-yellow-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Chờ xác nhận
                </Badge>)
                : oderDetail?.status_oder?.shipping?.status
                  ? (<Badge className="bg-blue-500 hover:bg-blue-600">
                    <Truck className="w-4 h-4 mr-2" />
                    Đang vận chuyển
                  </Badge>)
                  : oderDetail?.status_oder?.success?.status
                    ? (<Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Đã giao hàng
                    </Badge>)
                    : (<Badge className="bg-red-500 hover:bg-red-600">
                      <XCircle className="w-4 h-4 mr-2" />
                      Đã hủy
                    </Badge>)
              }
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="w-full mx-auto">
                {currentStep.length > 3 && (
                  <ol
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full"
                    aria-label="Progress steps"
                  >
                    {currentStep?.map((step, index) => (
                      <li
                        key={index}
                        className={`flex w-full min-h-[105px] sm:w-auto ${step.id === 4 ? "ml-7" : "flex-1"} ${step.preview === 'hidden' ? 'opacity-60' : 'opacity-100'}`}
                      >
                        <div className="flex flex-col items-center flex-grow ">
                          <div className={`flex items-center justify-center p-2 rounded-full border-[3px] ${step.preview === 'hidden' ? 'border-[#9ca3af]' : 'border-[#4ade80]'}`}>
                            <step.Icon color={`${step.preview === 'hidden' ? '#9ca3af' : '#4ade80'}`} />
                          </div>
                          <div className="mt-4 text-center">
                            <div className="text-sm font-medium text-nowrap">{step.title}</div>
                            <time className="text-xs text-nowrap font-normal">{step?.time || ''}</time>
                          </div>
                        </div>
                        {step.id <= 3 && (
                          <div
                            className={`hidden sm:block w-full ${step.preview === 'hidden' ? 'bg-[#f1f5f9]' : 'bg-[#4ade80]'} h-[3px] mt-4`}
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    ))}
                  </ol>)}

                {currentStep.length < 3 && (
                  <>
                    <ol
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-20"
                      aria-label="Progress steps"
                    >
                      {currentStep?.map((step, index) => (
                        <li
                          key={index}
                          className={`flex w-full min-h-[105px] sm:w-auto ${step.id === 2 ? " " : "flex-1"} ${step.preview === 'hidden' ? 'opacity-60' : 'opacity-100'}`}
                        >
                          <div className="flex flex-col items-center flex-grow ">
                            <div className={`flex items-center justify-center p-2 rounded-full border-[3px] ${step.preview === 'hidden' ? 'border-[#9ca3af]' : 'border-[#f87171]'}`}>
                              <step.Icon color={`${step.preview === 'hidden' ? '#9ca3af' : '#f87171'}`} />
                            </div>
                            <div className="mt-4 text-center">
                              <div className="text-sm font-medium text-nowrap">{step.title}</div>
                              <time className="text-xs text-nowrap font-normal">{step?.time || ''}</time>
                            </div>
                          </div>
                          {step.id <= 1 && (
                            <div
                              className={`hidden sm:block w-full ${step.preview === 'hidden' ? 'bg-[#f1f5f9]' : 'bg-[#f87171]'} h-[3px] mt-4`}
                              aria-hidden="true"
                            />
                          )}
                        </li>
                      ))}
                    </ol>

                  <div className="flex items-center justify-between font-light my-[2px]">
                      <div className="flex items-center gap-2">
                        <span>Hủy bởi:</span>
                        <span className="text-destructive">{oderDetail?.status_oder?.canceled.created_by?.shopper == 'seller' ? oderDetail.sellerId.businessName : oderDetail?.oder_id.user_id.username}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Lý do hủy đơn:</span>
                        <span className="text-destructive">{oderDetail?.status_oder?.canceled?.message}</span>
                      </div>
                  </div>
                  </>
                )}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Sản phẩm đặt hàng</h3>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12">
                    <img
                      src={oderDetail?.color.image}
                      alt={oderDetail?.color.name}
                      className="min-w-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="block font-medium">
                      {oderDetail?.product}
                    </span>
                    <span className="capitalize block">{oderDetail?.color?.name} (x{oderDetail?.quantity})</span>
                  </div>
                </div>
                <span>{formatNumberToVND((oderDetail?.price ?? 0) * (oderDetail?.quantity ?? 0))}</span>
              </div>
              <div className="flex justify-between items-center font-semibold mt-2">
                <span>Tổng cộng:</span>
                <span className="text-primary">{formatNumberToVND((oderDetail?.price ?? 0) * (oderDetail?.quantity ?? 0))}</span>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Thông tin khách hàng
              </h3>
              <div className="flex items-center gap-2">
                <p>
                  Họ tên:
                </p>
                <p className="font-medium">{oderDetail?.oder_id.user_id.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <p>
                  Email:
                </p>
                <p className="font-medium"> {oderDetail?.oder_id.user_id.email}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CreditCard className="h-4 w-4" />
                Phương thức thanh toán
              </h3>
              <div className='capitalize flex items-center gap-2'>
                <p className="font-medium"> {
                  oderDetail?.oder_id?.type_pay == 'cash' ? 'Thanh toán khi nhận hàng' : oderDetail?.oder_id?.type_pay
                }</p>
                {
                  oderDetail?.oder_id?.type_pay == 'momo' && (
                    oderDetail?.oder_id?.status_pay.status == 'wait' ?
                      (<Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-nowrap">
                        <Clock className="w-4 h-4 mr-2" />
                        {oderDetail?.oder_id?.status_pay.messages}
                      </Badge>)
                      : oderDetail?.oder_id?.status_pay.status == 'success' ?
                        (<Badge className="bg-green-500 text-nowrap text-white hover:bg-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {`Đã thanh toán`}
                        </Badge>) : (<Badge variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-100 text-nowrap">
                          <Package className="w-4 h-4 mr-2" />
                          {oderDetail?.oder_id?.status_pay.messages}

                        </Badge>)
                  )
                }
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Thông tin vận chuyển
              </h3>
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold border-r-2 pr-2 capitalize">{oderDetail?.oder_id.address_id.name}</p>
                  <p className="font-semibold">{oderDetail?.oder_id?.address_id?.phone}</p>
                </div>
                <p className="capitalize">{oderDetail?.oder_id?.address_id?.address + ' ,'}</p>
                <p>{oderDetail?.oder_id?.address_id?.ward}, {(oderDetail?.oder_id.address_id?.district)?.split('-')[1]}, {(oderDetail?.oder_id?.address_id?.city)?.split('-')[1]}</p>
              </div>
            </div>
          </div>

          {oderDetail?.status_oder?.pending?.status
            ? (
              <div className="flex items-center gap-5">
                <Button className="bg-yellow-500 hover:bg-yellow-600 hover:opacity-90" onClick={() => handleUpdateStatusOrder('shipping')}>Xác nhận đơn hàng</Button>
                <Button variant='destructive' onClick={() => handleUpdateStatusOrder('canceled')}>Hủy đơn hàng</Button>
              </div>
            )
            : oderDetail?.status_oder?.shipping?.status
              ? (<Button className="bg-green-500 hover:bg-green-600 hover:opacity-90" onClick={() => handleUpdateStatusOrder('success')}>Xác nhận hoàn tất</Button>)
              : oderDetail?.status_oder?.success?.status
                ? (<Button variant={'outline'} onClick={() => setIsOpen(false)}>Đóng</Button>)
                : (<Button variant={'outline'} onClick={() => setIsOpen(false)}>Đóng</Button>)}
        </DialogContent>
      </Dialog>
      <Dialog open={openListReason} onOpenChange={setOpenListReason}>
        <DialogContent>
          <DialogTitle>Lý do hủy đơn hàng</DialogTitle>
          <div>
            <RadioGroup onValueChange={(value) => setReason(value)} defaultValue={listReasons[0].title}>
              {listReasons.map((reason) => (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.title} id={reason.id.toString()} />
                  <Label htmlFor={reason.id.toString()}>{reason.title}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={() => setOpenListReason(false)} className="mt-5 float-right" variant={'outline'}>Hủy</Button>
            <Button onClick={handleUpdateCancelOrderStatus} className="mt-5 mr-2 float-right" variant={'destructive'}>Xác nhận</Button>

          </div>
        </DialogContent>

      </Dialog>

      <AlertDialog open={['shipping', 'success', 'canceled'].includes(statusUpdate?.status!)} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusUpdate?.status === 'shipping' ? 'Xác nhận đơn hàng' : statusUpdate?.status === 'success' ? 'Xác nhận giao hàng' : 'Hủy đơn hàng'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusUpdate?.status === 'shipping' ? 'Bạn có chắc chắn muốn xác nhận đơn hàng này không?' : statusUpdate?.status === 'success' ? 'Bạn có chắc chắn muốn xác nhận giao hàng không?' : 'Bạn có chắc chắn muốn hủy đơn hàng này không'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStatusUpdate({ status: null, data: null })}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdateStatus}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
