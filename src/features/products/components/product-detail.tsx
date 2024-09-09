import commentSound from "@/assets/sounds/comments-notification.mp3"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ColorIpi, productDetailResponse } from "@/types/api"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { CartItem, Size } from "@/types/client"
import cartStore from "@/store/global.store"
import toast from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup } from "@radix-ui/react-toggle-group"
import { ToggleGroupItem } from "@/components/ui/toggle-group"
import { generRateCartdId, getInitials } from "@/lib/utils"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore, useCartStore } from "@/store"
import { commentSchema } from "@/features/comments/validators"
import { useCreateComment } from "@/features/comments/api/create-comment"
import { useNotificationSound } from "@/hooks"
import { EllipsisVertical, MinusIcon, PlusIcon, StarIcon } from "lucide-react"
import { useCommentsByProductId } from "@/features/comments/api/get-comments"
import { SpokeSpinner } from "@/components/ui/spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteComment } from "@/features/comments/api/delete-comment"
import { useLocation } from "react-router-dom"
import useSocket from "@/hooks/useSocket"
import { Skeleton } from "@/components/ui/skeleton"

interface Iprops {
  data: productDetailResponse | undefined
  status: "error" | "success" | "pending"
}

type ReviewFormValues = z.infer<typeof commentSchema>

export const ProductDetail = ({ data, status }: Iprops) => {
  const auth = useAuthStore()
  const userId = auth?.user?._id!
  const location = useLocation()
  const socket = useSocket(userId)
  const createComment = useCreateComment()
  const deleteComents = useDeleteComment({
    productId: data?.data?.productDetail?._id!,
    page: 1,
    limit: 5,
  })
  const playCommentSound = useNotificationSound(commentSound)
  const commentsRessponse = useCommentsByProductId({
    productId: data?.data?.productDetail?._id!,
    page: 1,
    limit: 5,
  })

  const [selectedColor, setSelectedColor] = useState<string>()
  const [selectedSize, setSelectedSize] = useState<string>()
  const [avatar, setAvatar] = useState<string>()
  const [quantity, setQuantity] = useState<number>(1)
  const { setCart, updateQuantity } = useCartStore()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (data?.data) {
      setSelectedColor(data.data.productDetail.colors[0]._id)
      setAvatar(data.data.productDetail.colors[0].image)
      setSelectedSize(data.data.productDetail.sizes[0].name)
    }
  }, [data?.data])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const commentId = params.get("commentId")
    if (commentId) {
      const element = document.getElementById(commentId)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [location])

  const handleColorChange = (id: string) => {
    setSelectedColor(id)
    const color = data?.data?.productDetail.colors.find(
      (color) => color._id === id
    )
    if (color) {
      setAvatar(color.image)
    }
  }
  const handleSizeChange = (name: string) => {
    setSelectedSize(name)
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      commentText: "",
      rating: "3",
    },
  })

  const onSubmit = (values: ReviewFormValues) => {
    const productId = data?.data?.productDetail._id!
    const userId = auth?.user?._id!

    createComment.mutate(
      { data: { ...values, productId, userId } },
      {
        onSuccess: () => {
          playCommentSound()
          toast.success("Đã gửi đánh giá!")
          reset()
        },
        onError: () => {
          toast.error("Có lỗi xảy ra! vui lòng thử lại.")
        },
      }
    )
  }

  const handleBtnClickDeleteComment = (commentId: string) => {
    deleteComents.mutate(
      { commentId: commentId },
      {
        onSuccess: () => {
          playCommentSound()
          toast.success("Đã xóa bình luận!")
        },
        onError: () => {
          toast.error("Có lỗi xảy ra!")
        },
      }
    )
  }

  const handleAddToCart = () => {
    if (data?.data?.productDetail) {
      const { name, price, colors, _id, brand_id, sizes } =
        data?.data?.productDetail
      const Cart: CartItem = {
        product: {
          name,
          price,
          brand: brand_id.name,
        },
        color: colors.find((color) => color._id === selectedColor) as ColorIpi,
        size: sizes.find((size) => size.name === selectedSize) as Size,
        quantity: quantity,
      }

      const cartId = generRateCartdId(
        _id,
        selectedSize as string,
        selectedColor as string
      )
      if (useCartStore.getState().carts[cartId]) {
        updateQuantity(
          cartId,
          quantity + useCartStore.getState().carts[cartId].quantity
        )
      } else {
        setCart(Cart, cartId)
      }
      toast.success("Sản phẩm đã đươc thêm vào giỏ hàng!")
    }
  }

  useEffect(() => {
    if (!socket) return

    if (socket) {
      socket.on("newNotification", (notification) => {
        toast(`${notification.fromUserId} has liked your product`)
      })
    }

    return () => {
      socket.off("newNotification")
    }
  }, [socket, userId, data?.data?.productDetail?._id])

  if (status === "pending") {
    return (
      <LayoutWapper>
        <div className="flex min-w-full gap-5 py-12 pb-6">
          <div className="basis-1/2">
            <Skeleton className="basis-1/2 min-h-[500px] rounded-xl"></Skeleton>
            <Skeleton className="w-8/12 min-h-12 mt-12 rounded-xl"></Skeleton>
          </div>
          <div className="basis-1/2 min-h-[500px]">
            <Skeleton className="h-10 min-w-full" />
            <Skeleton className="h-6 mt-4 w-10/12" />
            <Skeleton className="h-6 mt-4 w-1/3" />
            <Skeleton className="h-72 mt-4 w-10/12" />
            <Skeleton className="h-14 mt-4 w-10/12" />
          </div>
        </div>
        <Skeleton className="min-w-full h-40"></Skeleton>
      </LayoutWapper>
    )
  }

  if (data?.data) {
    const { formatNumberToVND } = useFormatNumberToVND()

    const {
      productDetail: { colors, brand_id, des, name, price, sizes },
    } = data?.data

    return (
      <LayoutWapper>
        <div className="mx-auto min-h-lvh max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-2 lg:grid-cols-2 lg:gap-x-8">
            <div className="grid grid-cols-1 ">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={avatar}
                  alt="Product image"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out hover:scale-105"
                  style={{ aspectRatio: "800/600", objectFit: "cover" }}
                />
              </div>
              <div className="grid grid-cols-4 gap-5 mt-5">
                {colors?.map((color) => (
                  <button
                    key={color._id}
                    className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100"
                  >
                    <img
                      src={color.image}
                      alt={color.name}
                      onClick={() => handleColorChange(color._id)}
                      width={200}
                      height={150}
                      className={`h-full w-full rounded-lg object-cover object-center transition-opacity duration-300 ease-in-out hover:opacity-80 ${avatar === color.image ? "border-2 border-primary border-collapse opacity-60" : ""}`}
                      style={{ aspectRatio: "200/150", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid">
              <h4 className="scroll-m-20 h-0 text-xl font-semibold tracking-tight">
                {name}
              </h4>
              <p className="text-xl h-0 text-muted-foreground">
                Danh mục: {brand_id.name}
              </p>
              <div className="grid gap-2">
                <div className="h-auto">
                  <span className="text-2xl font-bold h-0">
                    {formatNumberToVND(price)}
                  </span>
                  <span className="ml-2 text-gray-500 line-through">
                    $59.99
                  </span>
                  <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    20% off
                  </span>
                </div>

                <form className="grid gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="color" className="text-base">
                      Màu sắc
                    </Label>
                    <RadioGroup
                      id="color"
                      value={selectedColor}
                      onValueChange={(id) => handleColorChange(id)}
                      className="flex items-center gap-2 flex-wrap"
                    >
                      {colors?.map((color) => (
                        <Label
                          key={color._id}
                          htmlFor={color._id}
                          className="border cursor-pointer rounded-md p-1 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        >
                          <RadioGroupItem id={color._id} value={color._id} />
                          <div className="size-11">
                            <img
                              src={color.image}
                              alt={color.name}
                              className="h-full w-full object-cover rounded"
                            />
                          </div>
                          {color.name}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="size" className="text-base">
                      Kích thước
                    </Label>
                    <RadioGroup
                      id="size"
                      value={selectedSize}
                      className="flex items-center gap-2"
                      onValueChange={(name) => handleSizeChange(name)}
                    >
                      {sizes?.map((size) => (
                        <Label
                          key={size.name}
                          htmlFor={`size-${size}`}
                          className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        >
                          <RadioGroupItem
                            id={`size-${size}`}
                            value={size.name}
                          />
                          {`${size.name.toUpperCase()}<${size.weight}kg>`}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                </form>

                <div>
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity - 1)}
                      disabled={quantity === 1}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="text-base font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => handleAddToCart()}
                  size="lg"
                  className="w-full"
                >
                  Thêm giỏ hàng
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Tabs defaultValue="reviews">
              <TabsList className="mb-5">
                <TabsTrigger value="reviews">Bài đánh giá</TabsTrigger>
                <TabsTrigger value="details">Chi tiết sản phẩm</TabsTrigger>
                <TabsTrigger value="comments">Bình luận</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews">
                <div className="space-y-8">
                  {commentsRessponse?.data?.data?.length == 0 && (
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      Hiện chưa có bài đánh giá nào về sản phẩm !
                    </p>
                  )}
                  {commentsRessponse?.data?.data &&
                    commentsRessponse?.data?.data?.map((comment) => (
                      <div
                        id={comment._id}
                        key={comment._id}
                        className="flex justify-between"
                      >
                        <div className="flex gap-4 ">
                          <Avatar className="size-10 border">
                            <AvatarImage
                              src={comment.userId.img}
                              alt={comment.userId.username}
                            />
                            <AvatarFallback>
                              {" "}
                              {getInitials(comment.userId.username)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-medium">
                                {comment.userId.username}
                              </h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, index) => (
                                  <StarIcon
                                    key={index}
                                    className={`h-5 w-5 ${index < comment.rating ? "fill-primary" : "fill-muted stroke-muted-foreground"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <EllipsisVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {comment.userId._id === auth.user?._id && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleBtnClickDeleteComment(comment._id)
                                  }
                                >
                                  Xóa
                                </DropdownMenuItem>
                              )}
                              {comment.userId._id !== auth.user?._id && (
                                <DropdownMenuItem>Báo cáo</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <time>{comment.relativeTime}</time>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="prose max-w-none">
                  <h2>Thông tin chi tiết về sản phảm</h2>
                  <p>{des}</p>
                </div>
              </TabsContent>
              <TabsContent value="comments">
                {!auth.user?._id && <p>đăng nhập để sử dụng tính năng này</p>}

                {auth.user?._id && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
                    </div>
                    <form
                      className="grid gap-4"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="flex gap-3">
                        <Avatar className="size-10 border">
                          <AvatarImage
                            src={auth?.user?.img}
                            alt={auth?.user?.username}
                          />
                          <AvatarFallback>
                            {" "}
                            {getInitials(auth.user?.username)}
                          </AvatarFallback>
                        </Avatar>
                        <Controller
                          name="commentText"
                          control={control}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder="Nhập đánh giá của bạn..."
                              className="min-h-[100px]"
                            />
                          )}
                        />
                      </div>
                      {errors.commentText && (
                        <span>{errors.commentText.message}</span>
                      )}

                      <div className="flex items-center gap-2">
                        <Label htmlFor="rating">Đánh giá của bạn:</Label>
                        <Controller
                          name="rating"
                          control={control}
                          render={({ field }) => (
                            <ToggleGroup
                              type="single"
                              {...field}
                              aria-label="Rating"
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <ToggleGroupItem value="1" className="px-2">
                                <StarIcon className="w-5 h-5 fill-primary" />
                              </ToggleGroupItem>
                              <ToggleGroupItem value="2" className="px-2">
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                              </ToggleGroupItem>
                              <ToggleGroupItem value="3" className="px-2">
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                              </ToggleGroupItem>
                              <ToggleGroupItem value="4" className="px-2">
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                              </ToggleGroupItem>
                              <ToggleGroupItem value="5" className="px-2">
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                                <StarIcon className="w-5 h-5 fill-primary" />
                              </ToggleGroupItem>
                            </ToggleGroup>
                          )}
                        />
                      </div>
                      {errors.rating && <span>{errors.rating.message}</span>}

                      <Button
                        disabled={createComment.status === "pending"}
                        type="submit"
                      >
                        {createComment.status === "pending" && (
                          <SpokeSpinner size="lg" />
                        )}
                        Gửi
                      </Button>
                    </form>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </LayoutWapper>
    )
  }

  return null
}
