import { ChangeEvent, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, Mail, User, Pencil } from "lucide-react"
import { useImageSize } from "react-image-size"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetShopBySlug } from "@/features/seller/api/get-shop-by-slug"
import { Skeleton } from "@/components/ui/skeleton"
import SekeletonList from "@/features/products/components/sekeleton-list"
import {
  convertToVietnamesePhone,
  formatDate,
  getImageUrl,
  getInitials,
} from "@/lib/utils"
import Product from "@/features/products/components/product"
import { useAuthStore } from "@/store"
import { Seller } from "@/types/client"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useUpdateImageSeller } from "@/features/seller/api/update-image"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useFetchDistricts,
  useFetchProvinces,
  useFetchWards,
} from "@/hooks/useProvinces"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
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
import { schemaSeller } from "@/features/seller/validators"
import { z } from "zod"
import { useUpdateInfoSeller } from "@/features/seller/api/updateInfo-shop"

export const ProfileRoute = () => {
  const { user, setUser } = useAuthStore((state) => state)
  const data = useGetShopBySlug({ slug: (user?.sellerId as Seller).slug! })
  const updateImageCover = useUpdateImageSeller({})
  const updateInfo = useUpdateInfoSeller({})

  const [dialog, setDialog] = useState(false)

  const [cityId, setCityId] = useState<string>("")
  const [districtId, setDistrictId] = useState<string>("")

  const [cityApi, setCity] = useState("")
  const [districtApi, setDistrict] = useState("")
  const [wardApi, setWard] = useState("")

  const { data: dataProvinces, isLoading: loadingProvinces } =
    useFetchProvinces()
  const { data: dataDistrics, isLoading: loadingDistricts } =
    useFetchDistricts(cityId)
  const { data: dataWards, isLoading: loadingWards } = useFetchWards(districtId)

  const [image, setImage] = useState<{
    img: string
    imgFile: FileList | null
  }>({ img: "", imgFile: null })

  const [avatar, setAvatar] = useState<{
    img: string
    imgFile: FileList | null
  }>({ img: "", imgFile: null })

  const methods = useForm<z.infer<typeof schemaSeller>>({
    resolver: zodResolver(schemaSeller),
  })

  useEffect(() => {
    if (data?.data?.data) {
      const cityId = data?.data?.data.city.split("-")[0]
      const districtId = data?.data?.data.district.split("-")[0]
      setCityId(cityId)
      setDistrictId(districtId)
      methods.reset({ ...data?.data?.data, email: user?.email })
    }
  }, [data?.data?.data])

  const [dimensions] = useImageSize(image.img)

  useEffect(() => {
    if (dimensions) {
      if (dimensions.width < 1297 || dimensions.height < 320) {
        toast.error("Vui lòng chọn kích thước ảnh phù hợp")
      }
    }
  }, [dimensions])

  useEffect(() => {
    if (data?.data?.data?.img_cover) {
      setImage({
        img: data.data?.data.img_cover,
        imgFile: null,
      })
    }
    if (data.data?.data.logo) {
      setAvatar({
        img: data.data?.data.logo,
        imgFile: null,
      })
    }
  }, [data.data?.data])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (data?.status === "pending") {
    return (
      <>
        <Skeleton className="h-64 md:h-80" />
        <div className="px-4 py-8 items-center grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-40 col-span-full flex gap-8 md:h-80 px-2">
            <Skeleton className="w-3/4 h-full" />
            <Skeleton className="w-1/4 h-full" />
          </div>
          <div className="h-64 px-20 col-span-full md:h-80 flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <SekeletonList key={index} />
            ))}
          </div>
          <div className="h-64 px-20 col-span-full md:h-80 flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </>
    )
  }

  if (data?.data?.data) {
    const {
      _id,
      user,
      businessName,
      district,
      ward,
      phone,
      followers,
      totalComments,
      totalProducts,
      addressDetail,
      averageRating,
      commentRecents,
      city,
      createdAt,
      topSellingProducts,
    } = data?.data?.data

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const img = getImageUrl(event.target.files)!
        setImage({
          img,
          imgFile: event.target.files!,
        })
      }
    }

    const handleInputAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const img = getImageUrl(event.target.files)!
        setAvatar({
          img,
          imgFile: event.target.files!,
        })
      }
    }

    const handleClickUpdateImageCover = () => {
      if (image?.imgFile) {
        const formData = new FormData()
        formData.append("img_cover", image.imgFile[0])
        toast.promise(
          updateImageCover.mutateAsync(
            {
              data: formData,
              sellerId: _id!,
            },
            {
              onSuccess() {
                data.refetch()
              },
            }
          ),
          {
            loading: "Đang cập nhật ảnh bìa",
            success: "Cập nhật ảnh bìa thành công",
            error: "Có lỗi xảy ra, vui lòng thử lại sau!",
          }
        )
      } else {
        toast.error("Có lỗi xảy ra vui lòng thủ lại!")
      }
    }

    const handleClickUpdateImageAvatar = () => {
      if (avatar?.imgFile) {
        const formData = new FormData()
        formData.append("logo", avatar.imgFile[0])
        toast.promise(
          updateImageCover.mutateAsync(
            {
              data: formData,
              sellerId: _id!,
            },
            {
              onSuccess() {
                data.refetch()
              },
            }
          ),
          {
            loading: "Đang cập nhật ảnh đại diện",
            success: "Cập nhật ảnh đại diện thành công",
            error: "Có lỗi xảy ra, vui lòng thử lại sau!",
          }
        )
      } else {
        toast.error("Có lỗi xảy ra vui lòng thủ lại!")
      }
    }

    const handleCityChange = (idCity: string, field: any) => {
      const id = idCity.split("-")[0]
      const value = idCity.split("-")[1]
      field.onChange(idCity)
      setCityId(id)
      setCity(value)
    }

    const handleDistrictChange = (idDistrict: string, field: any) => {
      const id = idDistrict.split("-")[0]
      const value = idDistrict.split("-")[1]
      field.onChange(idDistrict)
      setDistrictId(id)
      setDistrict(value)
    }

    const handleStreetChange = (value: string, field: any) => {
      field.onChange(value)
      setWard(value)
    }

    const {
      handleSubmit,
      control,
      formState: { errors },
    } = methods

    const onSubmit = (values: z.infer<typeof schemaSeller>) => {
      const formData = new FormData()
      for (const key in values) {
        formData.append(
          key,
          values[
            key as keyof z.infer<typeof schemaSeller>
          ]?.toString() as string
        )
      }
      toast.promise(
        updateInfo.mutateAsync(
          {
            data: formData,
            sellerId: _id!,
          },
          {
            onSuccess() {
              data.refetch().then((response) => {
                setUser({
                  ...user,
                  sellerId: {
                    ...(user?.sellerId as Seller),
                    ...response?.data?.data,
                  },
                })
              })
              setDialog(false)
            },
          }
        ),
        {
          loading: "Đang cập nhật thông tin",
          success: "Cập nhật thông tin thành công",
          error: "Có lỗi xảy ra, vui lòng thử lại sau!",
        }
      )
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="relative group h-64 w-full md:h-80">
          {image.img && (
            <img
              src={image.img}
              className="brightness-50 min-w-full min-h-full max-h-full object-cover"
            />
          )}
          {!image.img && (
            <div className="w-full min-h-full max-h-full bg-slate-500" />
          )}
          <div className="absolute top-44 inset-0 flex  items-center justify-center">
            <div className="text-center flex flex-col items-center">
              <Avatar className="size-14 border object-cover">
                <AvatarImage
                  className="object-cover"
                  src={avatar.img}
                  alt={businessName}
                />
                <AvatarFallback> {getInitials(businessName)}</AvatarFallback>
              </Avatar>
              <h1 className="mt-4 text-3xl font-bold text-white">
                {businessName}
              </h1>
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2">
          <div className="flex">
            <label
              htmlFor="file-input"
              className="inline-flex items-center rounded-md  px-4 py-2 text-sm font-medium text-secondary-foreground outline-1 border-[1px]"
            >
              {"Thay đổi ảnh bìa"}
            </label>
            <input
              onChange={handleInputChange}
              id="file-input"
              type="file"
              className="sr-only"
            />
          </div>
          <div className="flex">
            <label
              htmlFor="file-input-avatar"
              className="inline-flex items-center rounded-md  px-4 py-2 text-sm font-medium text-secondary-foreground outline-1 border-[1px]"
            >
              {"Thay đổi ảnh đại diện"}
            </label>
            <input
              onChange={handleInputAvatarChange}
              id="file-input-avatar"
              type="file"
              className="sr-only"
            />
          </div>
        </div>
        <div className="mt-5">
          {image?.imgFile &&
            (dimensions?.height ?? 0) >= 320 &&
            (dimensions?.width ?? 0) >= 1297 && (
              <Button onClick={handleClickUpdateImageCover}>
                Cập nhật ảnh bìa
              </Button>
            )}
          {avatar?.imgFile && (
            <Button onClick={handleClickUpdateImageAvatar}>
              Cập nhật đại diện
            </Button>
          )}
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <h2>Thông tin cửa hàng</h2>
                    <p
                      onClick={() => setDialog(true)}
                      className="font-medium text-sm cursor-pointer text-primary"
                    >
                      Cập nhật thông tin
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="capitalize">
                      {addressDetail +
                        ", " +
                        ward +
                        ", " +
                        district.split("-")[1] +
                        ", " +
                        city.split("-")[1]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{convertToVietnamesePhone(phone)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="lowercase">
                      {followers.length + " người theo dõi"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Pencil className="h-5 w-5 text-muted-foreground" />
                    <span>Thành lập: {formatDate(createdAt)}</span>
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
                    <span className="text-muted-foreground">
                      Tổng sản phẩm đăng bán
                    </span>
                    <span className="font-semibold">{totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Đánh giá trung bình
                    </span>
                    <span className="font-semibold flex items-center">
                      {`(${averageRating.toFixed(1)}) ${" "}`}
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
                    <span className="text-muted-foreground">
                      Tổng số lượt đánh giá
                    </span>
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
                {topSellingProducts.length === 0 && (
                  <h2 className="font-semibold text-lg capitalize">
                    hiện chưa có sản phẩm nào!
                  </h2>
                )}

                {topSellingProducts.length > 0 && (
                  <>
                    <div className="flex flex-wrap">
                      {topSellingProducts.map((product) => (
                        <Product
                          key={product?._id}
                          product={{
                            ...product.product,
                            total: product.quantity,
                            sellerId: {
                              _id: data?.data?.data?._id,
                              city: data?.data?.data?.city,
                            },
                          }}
                        />
                      ))}
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
                {commentRecents.length === 0 && (
                  <h2 className="font-semibold text-lg capitalize">
                    hiện chưa có đánh giá nào!
                  </h2>
                )}

                {commentRecents.length > 0 && (
                  <>
                    <div className="space-y-4">
                      {commentRecents.map((review) => (
                        <div key={review._id} className="flex space-x-4">
                          <Avatar className="border">
                            <AvatarImage
                              src={review?.userId?.img}
                              alt={review?.userId?.username}
                            />
                            <AvatarFallback>
                              {getInitials(review?.userId?.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">
                                {review?.userId?.username}
                              </h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={`${i + 1 <= review.rating ? "#fde047" : "transparent"}`}
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
                            <div className="flex items-center justify-between">
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
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <AlertDialog open={dialog} onOpenChange={setDialog}>
          <AlertDialogContent
            onOpenAutoFocus={(e: Event) => e.preventDefault()}
            className="max-w-4xl p-5 overflow-y-auto"
          >
            <AlertDialogTitle>Cập nhật thông tin cửa hàng</AlertDialogTitle>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex justify-between gap-2">
                    <div className="space-y-2 w-1/4">
                      <Label htmlFor="businessName">Tên Shop</Label>
                      <Controller
                        name="businessName"
                        control={control}
                        render={({ field }) => (
                          <Input id="businessName" {...field} />
                        )}
                      />
                      {errors.businessName && (
                        <p className="text-red-500">{`${errors.businessName.message}`}</p>
                      )}
                    </div>
                    <div className="space-y-2 w-1/4">
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
                    <div className="space-y-2 w-1/4">
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
                    <div className="space-y-2 w-1/4">
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
                              value={
                                data?.data?.data?.city ? field.value : undefined
                              }
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
                              value={
                                data?.data?.data?.district
                                  ? field.value
                                  : undefined
                              }
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
                              value={
                                data?.data?.data?.ward ? field.value : undefined
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
                    <div className="flex items-center justify-between gap-5">
                      <div className="w-1/4">
                        <Controller
                          name="express"
                          control={control}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Hỏa tốc
                                </FormLabel>
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
                      </div>
                      <div className="w-1/4">
                        <Controller
                          name="fast"
                          control={control}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Nhanh
                                </FormLabel>
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
                      </div>
                      <div className="w-1/4">
                        <Controller
                          name="economical"
                          control={control}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Tiết kiệm
                                </FormLabel>
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
                      </div>
                      <div className="w-1/4">
                        <Controller
                          name="bulkyGoods"
                          control={control}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Cồng kềnh
                                </FormLabel>
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
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="submit" className="mt-5 w-full">
                      Cập nhật
                    </Button>
                    <Button
                      onClick={() => setDialog(false)}
                      type="button"
                      variant={"outline"}
                      className="mt-5 w-full"
                    >
                      Đóng
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }
}
