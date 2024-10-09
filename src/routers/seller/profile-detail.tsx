import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Phone, Mail, ShoppingBag, User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { useParams } from 'react-router-dom'
import { useGetShopBySlug } from '@/features/seller/api/get-shop-by-slug'
import { Skeleton } from '@/components/ui/skeleton'
import SekeletonList from '@/features/products/components/sekeleton-list'
import { convertToVietnamesePhone, getInitials } from '@/lib/utils'
import Product from '@/features/products/components/product'

export const ProfileDetailRoute = () => {
  const params = useParams()
  const data = useGetShopBySlug({ slug: params.slug! })
  console.log(data);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  if (data?.status === 'pending') {
    return (
      <div>
        <Skeleton className='h-64 md:h-80' />
        <div className='px-4 py-8 items-center grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <div className='h-40 col-span-full flex gap-8 md:h-80 px-20' >
            <Skeleton className='w-3/4 h-full' />
            <Skeleton className='w-1/4 h-full' />
          </div>
          <div className='h-64 px-20 col-span-full md:h-80 flex'>
            {Array.from({ length: 4 }).map((_, index) => (
              <SekeletonList key={index} />
            ))}
          </div>
          <div className='h-64 px-20 col-span-full md:h-80 flex flex-col gap-4' >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='h-24 w-full' />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (data?.data?.data) {
    console.log(data?.data?.data);

    const { img_cover, user, logo, businessName, district, ward, phone, productDiscountRecents, followers, totalComments, totalProducts, addressDetail, averageRating, commentRecents, city, createdAt } = data?.data?.data

    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-64 md:h-80">
          {img_cover && (<img
            src={img_cover}
            className="brightness-50 min-h-72 bg-slate-500 object-cover"
          />)}
          {!img_cover && (<div className='w-full min-h-full bg-slate-500' />)}
          <div className="absolute top-20 inset-0 flex  items-center justify-center">
            <div className="text-center flex flex-col items-center">
              <Avatar className="size-14 border">
                <AvatarImage src={logo} alt={businessName} />
                <AvatarFallback>
                  {" "}
                  {getInitials(businessName)}
                </AvatarFallback>
              </Avatar>
              <h1 className="mt-4 text-3xl font-bold text-white">{businessName}</h1>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full lg:col-span-2">
              <CardHeader>
                <CardTitle>Thông tin cửa hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {addressDetail + ', ' + ward + ', ' + district + ', ' + city}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{convertToVietnamesePhone(phone)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className='lowercase'>{followers.length + ' người theo dõi'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê cửa hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng sản phẩm đăng bán</span>
                    <span className="font-semibold">{totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Đánh giá trung bình</span>
                    <span className="font-semibold flex items-center">
                      {(`(${averageRating}) ${' '}`)}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={"#fde047"}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng số lượt đánh giá</span>
                    <span className="font-semibold">{totalComments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Sản phẩm nổi bật</CardTitle>
              </CardHeader>
              <CardContent>
                {productDiscountRecents.length === 0 && (<h2 className='font-semibold text-lg capitalize'>hiện chưa có sản phẩm nào!</h2>)}

                {productDiscountRecents.length > 0 && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {productDiscountRecents.map((product) => (
                        <Product key={product?._id} product={product} />
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Button>
                        <ShoppingBag className="mr-2 h-4 w-4" /> Xem thêm
                      </Button>
                    </div>
                  </>
                )}

              </CardContent>
            </Card>

            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Đánh giá gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                {commentRecents.length === 0 && (<h2 className='font-semibold text-lg capitalize'>hiện chưa có đánh giá nào!</h2>)}

                {commentRecents.length > 0 && (
                  <>
                    <div className="space-y-4">
                      {commentRecents.map((review) => (
                        <div key={review._id} className="flex space-x-4">
                          <Avatar className="border">
                            <AvatarImage src={review.userId.img} alt={review.userId.username} />
                            <AvatarFallback>
                              {getInitials(review.userId.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{review.userId.username}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={`${(i + 1) <= review.rating ? '#fde047' : 'transparent'}`}
                                    stroke="currentColor"
                                    className="size-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <div className='flex items-center justify-between'>
                              <p className="text-sm text-muted-foreground mt-1">
                                {review.comment}
                              </p>
                              <span className="text-xs font-light text-muted-foreground">
                                {review.relativeTime}
                              </span>

                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Button variant="outline">Xem tất cả</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

}
