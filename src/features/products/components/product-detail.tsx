import commentSound from "@/assets/sounds/comments-notification.mp3"
import { ChangeEvent, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ColorIpi } from "@/types/api"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { CartItem, Seller, Size } from "@/types/client"
import toast from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup } from "@radix-ui/react-toggle-group"
import { ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  calculatePercentage,
  formatDate,
  generRateCartdId,
  getImageUrlOnly,
  getInitials,
} from "@/lib/utils"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore, useCartStore } from "@/store"
import { commentSchema } from "@/features/comments/validators"
import { useCreateComment } from "@/features/comments/api/create-comment"
import { useNotificationSound } from "@/hooks"
import {
  Check,
  ChevronRight,
  EllipsisVertical,
  MapPin,
  MinusIcon,
  Package,
  Plus,
  PlusIcon,
  Star,
  Users,
  X,
} from "lucide-react"
import { useCommentsByProductId } from "@/features/comments/api/get-comments"
import { SpokeSpinner } from "@/components/ui/spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteComment } from "@/features/comments/api/delete-comment"
import { useLocation, useNavigate } from "react-router-dom"
import useSocket from "@/hooks/useSocket"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { useCreateFollower } from "@/features/seller/api/follower-seller"
import { useUnCreateFollower } from "@/features/seller/api/unfollower-seller"
import nProgress from "nprogress"
import { useGetShopBySlug } from "@/features/seller/api/get-shop-by-slug"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Product from "./product"
import SekeletonList from "./sekeleton-list"
import { useDetailProduct } from "../api/get-detailProduct"

interface Iprops {
  slug: string | undefined
}

type ReviewFormValues = z.infer<typeof commentSchema>

const limitComment = 3
const limitProductSimilar = 3
const limitProductCurrentShop = 3

const optionsFilterComments = ["5", "4", "3", "2", "1"]

export const ProductDetail = ({ slug }: Iprops) => {
  const [query, setQuery] = useState<{
    pageSimilar: number
    pageCurrentShop: number
  }>({
    pageSimilar: 1,
    pageCurrentShop: 1,
  })
  const {
    data,
    isPending: status,
    refetch,
  } = useDetailProduct({ slug: slug!, params: query })

  const auth = useAuthStore()
  const userId = auth?.user?._id!
  const location = useLocation()
  const socket = useSocket(userId)
  const createComment = useCreateComment()
  const navigate = useNavigate()
  const playCommentSound = useNotificationSound(commentSound)
  const [pageComment, setPageComment] = useState<number>(1)
  const [pageProductSimilar, setPageProductSimilar] = useState<number>(1)
  const [pageProductCrrentShop, setPageProductCurrentShop] = useState<number>(1)

  const [open, setOpen] = useState<boolean>(false)

  const [imgs, setImgs] = useState<
    {
      img: string
      imgFile: File | null
    }[]
  >()

  const [queryKeyComment, setQueryKeyComments] = useState<{
    page: number
    productId?: string
    rating?: string
    limit: number
  }>({
    page: pageComment,
    limit: limitComment,
    productId: data?.data?.productDetail?._id,
  })

  const deleteComents = useDeleteComment(queryKeyComment)
  const commentsRessponse = useCommentsByProductId(queryKeyComment)

  useEffect(() => {
    setQueryKeyComments({
      page: pageComment,
      limit: limitComment,
      productId: data?.data?.productDetail?._id!,
    })
  }, [pageComment, limitComment, data?.data?.productDetail?._id!])

  useEffect(() => {
    setQuery({
      pageSimilar: pageProductSimilar,
      pageCurrentShop: pageProductCrrentShop,
    })
  }, [
    pageProductSimilar,
    pageProductCrrentShop,
    data?.data?.productDetail?._id!,
  ])

  const createFlower = useCreateFollower()
  const unCreateFlower = useUnCreateFollower()

  const [selectedColor, setSelectedColor] = useState<string>()
  const [selectedSize, setSelectedSize] = useState<string>()
  const [avatar, setAvatar] = useState<string>()
  const [quantity, setQuantity] = useState<number>(1)
  const { setCart, updateQuantity } = useCartStore()
  const [slugShop, setSlugShop] = useState<string | undefined>()

  const getShop = useGetShopBySlug({ slug: slugShop })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (slugShop) {
      nProgress.start()
    }
  }, [slugShop])

  useEffect(() => {
    if (getShop?.data) {
      navigate("/shop/" + slugShop)
      nProgress.done()
    }
    if (getShop?.error) {
      toast.error("Có lỗi xảy ra! thử lại sau.")
      nProgress.done()
    }
  }, [getShop, slugShop])

  useEffect(() => {
    if (data?.data) {
      setSelectedColor(data?.data?.productDetail?.colors[0]?._id)
      setAvatar(data?.data?.productDetail?.colors[0]?.image)
      setSelectedSize(data?.data?.productDetail?.sizes[0]?.name)
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
    const formData = new FormData()
    const productId = data?.data?.productDetail._id!
    const userId = auth?.user?._id!
    const sellerId = data?.data?.sellerInfo?._id!
    const dataCreated = {
      ...values,
      productId,
      userId,
      sellerId,
    }
    if (imgs && imgs.length > 0) {
      dataCreated.imgs = imgs.map((img) => img.imgFile)
    }

    for (const key in dataCreated) {
      if (dataCreated.hasOwnProperty(key)) {
        if (key === "imgs") {
          dataCreated[key]?.forEach((img: File) => {
            formData.append("imgs", img)
          })
          continue
        } else {
          formData.append(
            key,
            dataCreated[key as unknown as keyof ReviewFormValues] as string
          )
        }
      }
    }
    toast.promise(
      createComment.mutateAsync(
        { data: formData },
        {
          onSuccess: () => {
            commentsRessponse.refetch()
            playCommentSound()
            reset()
            setImgs([])
          },
          onError: () => {
            toast.error("Có lỗi xảy ra! vui lòng thử lại.")
          },
        }
      ),
      {
        loading: "Đang gửi đánh giá...",
        success: "Đã gửi đánh giá!",
        error: "Có lỗi xảy ra! vui lòng thử lại.",
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
          commentsRessponse.refetch()
        },
        onError: () => {
          toast.error("Có lỗi xảy ra!")
        },
      }
    )
  }

  const handleClickViewDetailShop = () => {
    if (data?.data?.sellerInfo?.slug) {
      setSlugShop(data?.data?.sellerInfo?.slug)
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        const img = getImageUrlOnly(event.target.files[i])!
        setImgs((prev) => {
          return [
            ...(prev! || []),
            {
              img,
              imgFile: event.target.files ? event.target.files[i] : null,
            },
          ]
        })
      }
    }
  }

  const handleAddToCart = () => {
    if (data?.data?.productDetail) {
      const { name, price, colors, _id, brand_id, sizes } =
        data?.data?.productDetail
      const Cart: CartItem = {
        product: {
          name,
          price,
          brand: brand_id?.name,
        },
        color: colors.find((color) => color._id === selectedColor) as ColorIpi,
        size: sizes.find((size) => size.name === selectedSize) as Size,
        quantity: quantity,
        selelrId: {
          logo: data?.data?.sellerInfo?.logo,
          businessName: data?.data?.sellerInfo?.businessName,
          _id: data?.data?.sellerInfo?._id,
        },
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
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!")
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

  if (status) {
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
        <Skeleton className="h-10 w-1/3 mt-5" />
        <div className="flex flex-wrap">
          {Array.from({ length: 4 }).map((_, index) => (
            <SekeletonList />
          ))}
        </div>
        <Skeleton className="h-10 w-1/3 mt-5" />
        <div className="flex flex-wrap">
          {Array.from({ length: 8 }).map((_, index) => (
            <SekeletonList />
          ))}
        </div>
      </LayoutWapper>
    )
  }

  const handleClickFlower = () => {
    createFlower.mutate(
      {
        data: {
          userId: auth.user?._id!,
          sellerId: data?.data?.sellerInfo?._id!,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đã theo dõi")
          playCommentSound()
          refetch()
        },
        onError: () => {
          toast.error("Có lỗi xảy ra!")
        },
      }
    )
  }

  const handleClickUnFlower = () => {
    unCreateFlower.mutate(
      {
        data: {
          userId: auth.user?._id!,
          sellerId: data?.data?.sellerInfo?._id!,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đã bỏ theo dõi")
          refetch()
        },
        onError: () => {
          toast.error("Có lỗi xảy ra!")
        },
      }
    )
  }

  if (data?.data) {
    const { formatNumberToVND } = useFormatNumberToVND()

    const {
      productDetail: {
        discount,
        colors,
        brand_id,
        des,
        name,
        price,
        sizes,
        totalQuantity,
      },
      sellerInfo: {
        businessName,
        averageRating,
        totalComments,
        city,
        createdAt,
        followers,
        logo,
        totalProducts,
        _id,
      },
    } = data?.data

    const handleRemoveImage = (index: number) => {
      setImgs((prev) => {
        return prev?.filter((_, i) => i !== index)
      })
    }

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
                      src={color?.image}
                      alt={color?.name}
                      onClick={() => handleColorChange(color?._id)}
                      width={200}
                      height={150}
                      className={`h-full w-full rounded-lg object-cover object-center transition-opacity duration-300 ease-in-out hover:opacity-80 ${avatar === color.image ? "border-2 border-primary border-collapse opacity-60" : ""}`}
                      style={{ aspectRatio: "200/150", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold">{name}</h4>
              <h4 className="text-xl font-normal capitalize">
                Danh mục: {brand_id?.name}
              </h4>
              <div className="grid gap-2">
                <div className="h-auto">
                  {(discount?.length ?? 0) == 0 && (
                    <span className="text-2xl font-bold h-0">
                      {formatNumberToVND(price)}
                    </span>
                  )}

                  {(discount?.length ?? 0) > 0 && (
                    <>
                      <span className="text-2xl text-destructive font-medium h-0">
                        {discount &&
                          discount.length > 0 &&
                          formatNumberToVND(
                            calculatePercentage(
                              discount[0].discount_percentage,
                              price
                            )
                          )}
                      </span>
                      <span className="ml-2 text-gray-500 line-through">
                        {formatNumberToVND(price)}
                      </span>
                    </>
                  )}

                  {(discount?.length ?? 0) > 0 && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      -{discount?.[0]?.discount_percentage ?? 0} %
                    </span>
                  )}
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
                              src={color?.image}
                              alt={color?.name}
                              className="h-full w-full object-cover rounded"
                            />
                          </div>
                          {color?.name}
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
                          key={size?.name}
                          htmlFor={`size-${size}`}
                          className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        >
                          <RadioGroupItem
                            id={`size-${size}`}
                            value={size?.name}
                          />
                          {`${size?.name.toUpperCase()}<${size.weight}kg>`}
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
                    <span className="ml-2 font-light">
                      {totalQuantity + " sản phẩm có sẵn"}
                    </span>
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
          <div className="mt-20 max-sm:mt-10 mb-5">
            <Card className="w-full max-md:max-h-[200px] max-sm:h-auto overflow-hidden">
              <CardContent className="p-4 max-sm:p-2 flex flex-col sm:flex-row gap-4 h-full">
                <div className="flex items-start sm:items-start gap-4 sm:w-1/3">
                  <Avatar className="size-14 border">
                    <AvatarImage
                      className="size-full object-cover"
                      src={logo}
                      alt={businessName}
                    />
                    <AvatarFallback>
                      {" "}
                      {getInitials(businessName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col ">
                    <h3 className="text-lg font-semibold capitalize">
                      {businessName}
                    </h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm">
                        {averageRating.toFixed(1)} (
                        {totalComments + " đánh giá"})
                      </span>
                    </div>
                    <Button
                      onClick={handleClickViewDetailShop}
                      variant={"outline"}
                      className="mt-2"
                      size="sm"
                    >
                      Xem shop
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="hidden max-sm:flex items-end justify-end flex-1">
                    {(auth?.user?.sellerId as Seller)?._id !== _id ? (
                      followers?.find(
                        (follower) => follower._id === auth.user?._id
                      ) ? (
                        <div className="flex items-center gap-2 justify-between">
                          <span className="capitalize">Hủy Theo dõi</span>
                          <Button
                            onClick={handleClickUnFlower}
                            variant="outline"
                            size="icon"
                          >
                            <Plus />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-between">
                          <span className="capitalize">Theo dõi</span>
                          <Button
                            onClick={handleClickFlower}
                            variant="outline"
                            size="icon"
                          >
                            <Plus />
                          </Button>
                        </div>
                      )
                    ) : undefined}
                  </div>
                </div>
                <div className="flex flex-col justify-between sm:w-2/3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">
                        {totalProducts} sản phẩm
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{city.split("-")[1]}</span>
                      </div>
                      {(auth?.user?.sellerId as Seller)?._id !== _id ? (
                        followers?.find(
                          (follower) => follower._id === auth.user?._id
                        ) ? (
                          <div className="flex max-sm:hidden items-center gap-2 justify-between">
                            <span className="capitalize">Đã Theo dõi</span>
                            <Button
                              onClick={handleClickUnFlower}
                              variant="outline"
                              size="icon"
                            >
                              <Check />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex max-sm:hidden items-center gap-2 justify-between">
                            <span className="capitalize">Theo dõi</span>
                            <Button
                              onClick={handleClickFlower}
                              variant="outline"
                              size="icon"
                            >
                              <Plus />
                            </Button>
                          </div>
                        )
                      ) : undefined}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">
                        {followers?.length} người theo dõi
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {"Tham gia: " + formatDate(createdAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-7">
            <Tabs defaultValue="reviews">
              <TabsList className="mb-5">
                <TabsTrigger value="reviews">Bài đánh giá</TabsTrigger>
                <TabsTrigger value="details">Chi tiết sản phẩm</TabsTrigger>
                <TabsTrigger value="comments">Bình luận</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews">
                {(commentsRessponse?.data?.data?.length ?? 0) > 0 && (
                  <div className="flex items-center gap-3 flex-wrap mb-10">
                    <Button
                      onClick={() =>
                        setQueryKeyComments({
                          ...queryKeyComment,
                          rating: undefined,
                        })
                      }
                      variant={queryKeyComment.rating ? "outline" : "default"}
                    >
                      {"Tất cả"}
                    </Button>
                    {optionsFilterComments.map((value, index) => (
                      <Button
                        onClick={() =>
                          setQueryKeyComments({
                            ...queryKeyComment,
                            rating: value,
                          })
                        }
                        variant={
                          queryKeyComment.rating &&
                          queryKeyComment.rating === value
                            ? "default"
                            : "outline"
                        }
                      >
                        {value + " sao"}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
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
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={`${index < comment.rating ? "#fde047" : "none"} `}
                                    stroke="currentColor"
                                    key={index}
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
                            <p className="text-sm text-muted-foreground">
                              {comment.comment}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              {comment?.imgs &&
                                comment?.imgs.length > 0 &&
                                comment.imgs?.map((img, index) => (
                                  <img
                                    key={index}
                                    src={img}
                                    alt="comment"
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <EllipsisVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {comment.userId._id === auth.user?._id && (
                                <>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleBtnClickDeleteComment(comment._id)
                                    }
                                  >
                                    Xóa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleBtnClickDeleteComment(comment._id)
                                    }
                                  >
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  {comment?.imgs.length > 0 && (
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleBtnClickDeleteComment(comment._id)
                                      }
                                    >
                                      Thay đổi ảnh
                                    </DropdownMenuItem>
                                  )}
                                </>
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

                  <div className="flex justify-end mt-12">
                    {Math.ceil(
                      (commentsRessponse?.data?.total ?? 0) / limitComment
                    ) >= 2 && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              className={
                                pageComment <= 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                              onClick={() => setPageComment(pageComment - 1)}
                            />
                          </PaginationItem>
                          {Array.from({
                            length: Math.ceil(
                              commentsRessponse?.data?.total! / limitComment
                            ),
                          }).map((_, p) => (
                            <PaginationItem className="cursor-pointer" key={p}>
                              <PaginationLink
                                isActive={p + 1 === pageComment}
                                onClick={() => setPageComment(p + 1)}
                              >
                                {p + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              className={
                                pageComment ===
                                Math.ceil(
                                  commentsRessponse?.data?.total! / limitComment
                                )
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                              onClick={() => setPageComment(pageComment + 1)}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
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
                      className="grid gap-2"
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
                        <div className="flex flex-1 flex-col gap-4">
                          <Controller
                            name="commentText"
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder="Nhập đánh giá của bạn..."
                                className="min-h-[100px] w-full"
                              />
                            )}
                          />
                        </div>
                      </div>
                      {errors.commentText && (
                        <span className="text-red-400">
                          {errors.commentText.message}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <Label className="max-sm:hidden" htmlFor="rating">
                          Đánh giá của bạn:
                        </Label>
                        <Controller
                          name="rating"
                          control={control}
                          render={({ field }) => (
                            <ToggleGroup
                              type="single"
                              aria-label="Rating"
                              onValueChange={(value) => field.onChange(value)}
                              {...field}
                              defaultValue="3"
                            >
                              <ToggleGroupItem
                                value="1"
                                className="px-2 space-x-1"
                              >
                                {Array.from({ length: 1 }).map((i, j) => (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={"#fde047"}
                                    stroke="currentColor"
                                    key={j}
                                    className="size-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ))}
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="2"
                                className="px-2 space-x-1"
                              >
                                {Array.from({ length: 2 }).map((i, j) => (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={"#fde047"}
                                    stroke="currentColor"
                                    key={j}
                                    className="size-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ))}
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="3"
                                className="px-2 space-x-1"
                              >
                                {Array.from({ length: 3 }).map((i, j) => (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={"#fde047"}
                                    stroke="currentColor"
                                    key={j}
                                    className="size-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ))}
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="4"
                                className="px-2 space-x-1"
                              >
                                {Array.from({ length: 4 }).map((i, j) => (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={"#fde047"}
                                    stroke="currentColor"
                                    key={j}
                                    className="size-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ))}
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="5"
                                className="px-2 space-x-1"
                              >
                                {Array.from({ length: 5 }).map((i, j) => (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={"#fde047"}
                                    stroke="currentColor"
                                    key={j}
                                    className="size-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ))}
                              </ToggleGroupItem>
                            </ToggleGroup>
                          )}
                        />
                      </div>
                      {errors.rating && (
                        <span className="text-red-400">
                          {errors.rating.message}
                        </span>
                      )}

                      <div className="flex items-center gap-5">
                        <div className="flex">
                          <label
                            htmlFor="file-input"
                            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-secondary-foreground outline-1 border-[1px]"
                          >
                            Hình ảnh
                          </label>
                          <Input
                            onChange={(e) => handleInputChange(e)}
                            id="file-input"
                            type="file"
                            multiple
                            className="sr-only w-auto"
                          />
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {imgs &&
                            imgs.length > 0 &&
                            imgs.map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={img.img}
                                  alt={`Image ${index + 1}`}
                                  className="min-w-[90px] max-w-[90px] min-h-24 max-h-24 object-cover rounded-[8px]"
                                />
                                <X
                                  onClick={() => handleRemoveImage(index)}
                                  color="#ffff"
                                  className="p-1 bg-slate-300 rounded-full absolute top-[2px] right-[2px] cursor-pointer"
                                />
                              </div>
                            ))}
                        </div>
                      </div>

                      <Button
                        disabled={createComment.status === "pending"}
                        type="submit"
                        className="mt-4"
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
          <>
            <h2 className="text-2xl font-semibold mt-10 max-sm:text-center">
              Sản phẩm liên quan của shop
            </h2>
            <div className="flex flex-wrap">
              {data?.data?.productCurrentShops?.data?.map((product) => (
                <Product product={product} key={product._id} />
              ))}
            </div>
            <div className="flex justify-end mt-12">
              {Math.ceil(
                (data?.data?.productCurrentShops?.total ?? 0) /
                  data?.data?.productCurrentShops?.limit
              ) >= 2 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={
                          pageProductCrrentShop <= 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        onClick={() =>
                          setPageProductCurrentShop(pageProductCrrentShop - 1)
                        }
                      />
                    </PaginationItem>
                    {Array.from({
                      length: Math.ceil(
                        data?.data?.productCurrentShops?.total! /
                          data?.data?.productCurrentShops?.limit
                      ),
                    }).map((_, p) => (
                      <PaginationItem className="cursor-pointer" key={p}>
                        <PaginationLink
                          isActive={p + 1 === pageProductCrrentShop}
                          onClick={() => setPageProductCurrentShop(p + 1)}
                        >
                          {p + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className={
                          pageComment ===
                          Math.ceil(
                            data?.data?.productCurrentShops?.total! /
                              data?.data?.productCurrentShops?.limit
                          )
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        onClick={() =>
                          setPageProductCurrentShop(pageProductCrrentShop + 1)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </>
          <div className="mt-1">
            <h2 className="text-2xl font-semibold max-sm:text-center">
              Có thể bạn cũng thích
            </h2>
            <div className="flex items-center flex-wrap">
              {data?.data?.productSimilars?.data?.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
            <div className="flex justify-end mt-12">
              {Math.ceil(
                (data?.data?.productSimilars?.total ?? 0) /
                  data?.data?.productSimilars.limit
              ) >= 2 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={
                          pageProductSimilar <= 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        onClick={() =>
                          setPageProductSimilar(pageProductSimilar - 1)
                        }
                      />
                    </PaginationItem>
                    {Array.from({
                      length: Math.ceil(
                        data?.data?.productSimilars?.total! /
                          data?.data?.productSimilars?.limit
                      ),
                    }).map((_, p) => (
                      <PaginationItem className="cursor-pointer" key={p}>
                        <PaginationLink
                          isActive={p + 1 === pageProductSimilar}
                          onClick={() => setPageProductSimilar(p + 1)}
                        >
                          {p + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className={
                          pageComment ===
                          Math.ceil(
                            data?.data?.productSimilars?.total /
                              data?.data?.productSimilars?.limit
                          )
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        onClick={() =>
                          setPageProductSimilar(pageProductSimilar + 1)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
        <AlertDialog open={open}>
          <AlertDialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="min-h-[500px]"
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Cập nhật đánh giá</AlertDialogTitle>
            </AlertDialogHeader>
            <div>suaw cap nhat</div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Hủy
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </LayoutWapper>
    )
  }

  return null
}
