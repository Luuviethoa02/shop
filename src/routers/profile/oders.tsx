import { ProfileLayout } from '@/components/layouts'
import LayoutWapper from '@/components/warper/layout.wrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, Clock, Package, Search, Truck, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store'
import { useGetOderByUserId } from '@/features/oder/api/get-oder'
import LoadingMain from '@/components/share/LoadingMain'
import { Button } from '@/components/ui/button'

import { Card, CardContent } from "@/components/ui/card"
import { convertToVietnamesePhone, getInitials } from '@/lib/utils'
import useFormatDateVN from '@/hooks/useFormatDateVN'
import useFormatNumberToVND from '@/hooks/useFormatNumberToVND'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useGetOderDetailByUserId } from '@/features/oder/api/get-detailOder'
import nProgress from 'nprogress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'


export const OdersRoute = () => {
  const { user } = useAuthStore()
  const { formatDate } = useFormatDateVN()
  const { formatNumberToVND } = useFormatNumberToVND()
  const [oderId, setOderId] = useState<string>()
  const params = useParams()

  const orders = useGetOderByUserId({
    userId: user?._id!,
    page: 1,
    limit: 10,
    status_pay: undefined
  })

  const orderDetails = useGetOderDetailByUserId({
    oderId: oderId
  })

  const navigate = useNavigate()

  const handleOnclickViewDetail = (orderId: string) => {
    setOderId(orderId)
  }

  useEffect(() => {
    if (oderId) {
      nProgress.start()
    }
  }, [oderId])

  const handleClickBack = () => {
    navigate('/profile/purchase')
    setOderId(undefined)
  }

  useEffect(() => {
    if (orderDetails?.data?.data) {
      navigate(`/profile/purchase/${oderId}`)
      nProgress.done()
    }
    if (orderDetails?.error) {
      console.error("Failed to load product detail:", orderDetails?.error)
      nProgress.done()
    }
  }, [orderDetails?.data?.data, orderDetails?.error, oderId])


  return (
    <LayoutWapper size='small'>
      <ProfileLayout>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className='bg-transparent'>
            <TabsTrigger className='bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary pb-4 px-8' value="all">Tất cả</TabsTrigger>

            <TabsTrigger className='bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary pb-4 px-8' value="wait-pay">Chờ thanh toán</TabsTrigger>

            <TabsTrigger className='bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary pb-4 px-8' value="complete">Hoàn thành</TabsTrigger>

            <TabsTrigger className='bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary pb-4 px-8' value="cancel">Đã hủy</TabsTrigger>


          </TabsList>
          <div className="relative my-5">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 pr-4"
            />
          </div>
          <TabsContent value="all">
            {orders.status === 'pending' && (<>
              <LoadingMain />
            </>)}

            {(!params.oderId && orders.status === 'success') && (
              <>
                <Card className="w-full max-w-full mx-auto">
                  <CardContent className="p-0">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ maxHeight: "500px", minHeight: "500px" }}>
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                          <tr>
                            <th scope="col" className="px-6 py-3 sticky left-0 bg-gray-50 dark:bg-gray-700">Mã đơn hàng</th>
                            <th scope="col" className="px-6 py-3 text-nowrap">Địa chỉ</th>
                            <th scope="col" className="px-6 py-3 text-nowrap">Phương thức thanh toán</th>
                            <th scope="col" className="px-6 py-3 text-nowrap">Tổng tiền</th>
                            <th scope="col" className="px-6 py-3 text-nowrap">Thời gian đặt hàng</th>
                            <th scope="col" className="px-6 py-3 text-nowrap">Hàng động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders?.data?.data && orders?.data?.data.length === 0 && (
                            <div className='flex items-center p-4 pt-10 justify-center min-w-full'>
                              <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                                Hiện chưa có đơn hàng nào
                              </h2>
                            </div>
                          )}
                          {orders?.data?.data && orders?.data?.data.map((order) => (
                            <tr key={order._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white sticky left-0 overflow-hidden bg-white dark:bg-gray-800">
                                {order._id}
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between min-w-full">
                                    <div className="font-medium flex items-center">
                                      <h4 className="scroll-m-20 capitalize text-lg border-r-[1px] pr-2 border-gray-500 font-semibold tracking-tight">
                                        {order?.address_id?.name}
                                      </h4>
                                      <p className="text-sm block ml-2 text-slate-500 truncate">{
                                        convertToVietnamesePhone(order?.address_id?.phone)
                                      }</p>
                                    </div>

                                  </div>
                                  <div className="text-sm capitalize text-gray-500">
                                    {order?.address_id?.address}
                                  </div>
                                  <div className="text-sm text-gray-500 line-clamp-2">
                                    <p className='line-clamp-1'>{order?.address_id?.ward}, {order?.address_id?.district.split('-')[1]}, {order?.address_id?.city.split('-')[1]}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className='h-full capitalize flex items-center gap-2'>
                                  <p> {
                                    order?.type_pay == 'cash' ? 'Thanh toán khi nhận hàng' : order?.type_pay
                                  }</p>

                                  {
                                    order?.type_pay == 'momo' && (
                                      order.status_pay.status == 'wait' ?
                                        (<Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-nowrap">
                                          <Clock className="w-4 h-4 mr-2" />
                                          {order.status_pay.messages}
                                        </Badge>)
                                        : order.status_pay.status == 'success' ?
                                          (<Badge className="bg-green-500 text-nowrap text-white hover:bg-green-600">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            {`Đã thanh toán`}
                                          </Badge>) : (<Badge variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-100 text-nowrap">
                                            <Package className="w-4 h-4 mr-2" />
                                            {order.status_pay.messages}

                                          </Badge>)
                                    )
                                  }
                                </div>
                              </td>
                              <td className="px-6 py-4">{formatNumberToVND(order?.totalPrice)}</td>
                              <td className="px-6 py-4">{formatDate(order?.createdAt)}</td>
                              <td className="px-6 py-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOnclickViewDetail(order._id)}
                                >
                                  Chi tiết
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>)}

            {(params.oderId && orderDetails.status === 'success') && (
              <div className='py-1 min-w-full mb-2'>
                <Button
                  variant="outline"
                  onClick={handleClickBack}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại</span>
                </Button>
              </div>

            )}

            {(params.oderId && orderDetails.status === 'success') && (
              orderDetails?.data?.data.map((oderDetail) => (
                <div className='bg-[#f5f5f5] p-4 px-7 rounded-md my-5'>
                  <div className='flex items-center justify-between border-b-[1px] pb-5'>
                    <div className='flex items-center gap-3 '>
                      <Avatar className="size-10 border">
                        <AvatarImage src={oderDetail.sellerId.logo} alt={oderDetail.sellerId.businessName} />
                        <AvatarFallback>
                          {" "}
                          {getInitials(oderDetail.sellerId.businessName)}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        {oderDetail.sellerId.businessName}
                      </h4>
                      <Button variant={'outline'}>Xem shop</Button>
                    </div>
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
                  </div>
                  <div className='flex items-center py-3 border-b-[1px]'>
                    <div className='basis-3/4 flex items-center gap-3'>
                      <div className='size-20 min-w-20 max-w-20'>
                        <img className='size-full object-cover rounded' src={oderDetail.color.image} alt={oderDetail.product + oderDetail.color.name} />
                      </div>
                      <div>
                        <p className="[&:not(:first-child)]:mt-6">
                          {oderDetail.product}
                        </p>
                        <blockquote className="italic">
                          {'Màu: ' + oderDetail.color.name + ' - ' + oderDetail?.size?.name}
                        </blockquote>
                        <h3 className='font-semibold'>x{oderDetail.quantity}</h3>
                      </div>
                    </div>
                    <div className='flex-1 flex items-center justify-end'>
                      <div className='flex items-center gap-2'>

                        {oderDetail?.vouchers?.length > 0 && (
                          <div className='flex items-center gap-2'>
                            <p className='text-destructive line-through'>{
                              formatNumberToVND(oderDetail.price)
                            }</p>
                            <p className='font-light min-w-52 max-w-52 text-right'>
                              {formatNumberToVND((oderDetail.price) - (oderDetail?.vouchers?.reduce((acc, v) => acc + v.discount_amount, 0)))}
                            </p>
                          </div>
                        )}
                        <p>{formatNumberToVND(oderDetail.price)}</p>
                      </div>
                    </div>

                  </div>
                  <div className='flex flex-col py-5'>
                    <div className='flex items-end gap-16 justify-end py-2 border-b-[0.5px]'>
                      <p className='font-light'>Tổng tiền hàng: </p>
                      <p className='font-light text-right min-w-52 max-w-52'>{
                        formatNumberToVND(oderDetail.price * oderDetail.quantity)
                      }</p>
                    </div>
                    <div className='flex items-end gap-16 justify-end py-2 border-b-[0.5px]'>
                      <p className='font-light'>Phí vận chuyển: </p>
                      <p className='font-light text-right min-w-52 max-w-52'>
                        {formatNumberToVND(oderDetail?.type_tranfer.fee)}
                      </p>
                    </div>
                    {oderDetail?.vouchers?.length > 0 && (
                      <div className='flex items-end gap-16 justify-end py-2 border-b-[0.5px]'>
                        <p className='font-light'>Voucher: </p>
                        <p className='font-light min-w-52 max-w-52 text-right'>
                          {formatNumberToVND(oderDetail?.vouchers?.reduce((acc, v) => acc + v.discount_amount, 0))}
                        </p>
                      </div>
                    )}

                    <div className='flex items-end gap-16 justify-end py-2 border-b-[0.5px]'>
                      <p className='font-light'>Thành tiền: </p>
                      <h4 className='font-medium min-w-52 max-w-52 text-xl text-destructive text-right'>
                        {formatNumberToVND(oderDetail.price * oderDetail.quantity + oderDetail?.type_tranfer.fee - (oderDetail?.vouchers?.reduce((acc, v) => acc + v.discount_amount, 0) || 0))}
                      </h4>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    {oderDetail.status_oder.canceled?.status && (
                      <>
                        <div className="flex items-center gap-5 font-light">
                          <div className="flex items-center gap-2">
                            <span>Hủy bởi:</span>
                            <span className="text-destructive">{oderDetail?.status_oder?.canceled.created_by?.shopper == 'seller' ? oderDetail.sellerId.businessName : oderDetail?.oder_id.user_id.username}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Lý do hủy đơn:</span>
                            <span className="text-destructive">{oderDetail?.status_oder?.canceled?.message}</span>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Button variant={'default'}>Mua lại</Button>
                        </div>
                      </>
                    )}

                    {oderDetail.status_oder.success?.status && (
                      <>
                        <div>
                          <p>Đã giao thành công lúc: {formatDate(oderDetail.status_oder.success.created_at)}</p>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Button variant={'default'}>Mua lại</Button>
                        </div>
                      </>
                    )}

                    {oderDetail.status_oder.shipping?.status && (
                      <>
                        <div className='flex flex-col items-start gap-2'>
                          <span className='capitalize'>
                            đơn hàng đã được xác nhận vào lúc: {formatDate(oderDetail.status_oder.shipping?.created_at)}
                          </span>

                        </div>
                        <div className='flex items-center gap-3'>
                          <Button variant={'outline'}>Liên hệ người bán</Button>
                        </div>
                      </>
                    )}

                    {oderDetail.status_oder.pending?.status && (
                      <>
                        <div>
                          <p className='text-[#57534e] capitalize'>
                            đặt hàng lúc: {formatDate(oderDetail.status_oder.pending?.created_at)}
                          </p>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Button variant={'outline'}>Liên hệ người bán</Button>
                        </div>
                      </>
                    )}

                  </div>
                </div>
              ))
            )}


          </TabsContent>
          <TabsContent value="wait-pay">Change your password here.</TabsContent>
          <TabsContent value="complete">Change your password here.</TabsContent>
          <TabsContent value="cancel">Change your password here.</TabsContent>
        </Tabs>
      </ProfileLayout>
    </LayoutWapper>
  )
}
