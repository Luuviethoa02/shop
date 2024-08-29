import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ColorIpi, producstResponse, productDetailResponse } from "@/types/api"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { CartItem, Size } from "@/types/client"
import cartStore from "@/store/cart.store"
import toast from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup } from "@radix-ui/react-toggle-group"
import { ToggleGroupItem } from "@/components/ui/toggle-group"
import { generRateCartdId } from "@/lib/utils"
import io from "socket.io-client"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/store"
import { socket } from "@/lib/api-io"
import { commentSchema } from "@/features/comments/validators"
import { useCreateComment } from "@/features/comments/api/create-comment"

interface Iprops {
  data: productDetailResponse | undefined
  status: "error" | "success" | "pending"
}

type ReviewFormValues = z.infer<typeof commentSchema>

export const ProductDetail = ({ data, status }: Iprops) => {
  if (status === "pending") {
    return <h3>loading....</h3>
  }

  const [selectedColor, setSelectedColor] = useState<string>()
  const [selectedSize, setSelectedSize] = useState<string>()
  const [quantity, setQuantity] = useState<number>(1)
  const { setCart, updateQuantity } = cartStore()
  const [comments, setComments] = useState<
    (
      | string
      | {
          text: string
          user: string | undefined
          productId: string | undefined
        }
    )[]
  >([])
  const auth = useAuthStore()
  const createComment = useCreateComment()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (data?.data) {
      setSelectedColor(data.data.productDetail.colors[0]._id)
      setSelectedSize(data.data.productDetail.sizes[0].name)
    }
  }, [data?.data])

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }
  const handleSizeChange = (name: string) => {
    setSelectedSize(name)
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      commentText: "",
      rating: "3",
    },
  })

  const onSubmit = (values: ReviewFormValues) => {
    const productId = data?.data?.productDetail._id!
    const userId = auth.user?._id!

    // Gửi bình luận mới lên server
    createComment.mutate(
      { data: { ...values, productId, userId } },
      {
        onSuccess: () => {
          toast.success("Bình luận của bạn đã được gửi thành công!")
        },
      }
    )
  }

  const handleAddToCart = () => {
    if (data?.data.productDetail) {
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
      if (cartStore.getState().carts[cartId]) {
        updateQuantity(
          cartId,
          quantity + cartStore.getState().carts[cartId].quantity
        )
      } else {
        setCart(Cart, cartId)
      }
      toast.success("Sản phẩm đã đươc thêm vào giỏ hàng!")
    }
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
                  src={colors[0].image}
                  alt="Product image"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out hover:scale-105"
                  style={{ aspectRatio: "800/600", objectFit: "cover" }}
                />
              </div>
              <div className="grid grid-cols-4 gap-5 mt-5">
                {colors.map((color) => (
                  <button
                    key={color._id}
                    className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100"
                  >
                    <img
                      src={color.image}
                      alt={color.name}
                      width={200}
                      height={150}
                      className="h-full w-full object-cover object-center transition-opacity duration-300 ease-in-out hover:opacity-80"
                      style={{ aspectRatio: "200/150", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid ">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {name}
              </h4>
              <p className="text-xl text-muted-foreground">
                Danh mục: {brand_id.name}
              </p>
              <div className="grid gap-4">
                <div>
                  <span className="text-2xl font-bold">
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
                      {colors.map((color) => (
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
                      {sizes.map((size) => (
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
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Chi tiết sản phẩm</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                <TabsTrigger value="comments">Bình luận</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="prose max-w-none">
                  <h2>Thông tin chi tiết về sản phảm</h2>
                  <p>{des}</p>
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-medium">Sarah Johnson</h4>
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-5 w-5 fill-primary" />
                          <StarIcon className="h-5 w-5 fill-primary" />
                          <StarIcon className="h-5 w-5 fill-primary" />
                          <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                          <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        I've been wearing the Acme Prism T-Shirt for a few weeks
                        now, and it's quickly become one of my favorite tees.
                        The fabric is incredibly soft and comfortable, and the
                        unique design really sets it apart from other basic
                        t-shirts. Highly recommend!
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-medium">Alex Smith</h4>
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-5 w-5 fill-primary" />
                          <StarIcon className="h-5 w-5 fill-primary" />
                          <StarIcon className="h-5 w-5 fill-primary" />
                          <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                          <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The Acme Prism T-Shirt is a great addition to my
                        wardrobe. The quality is top-notch, and the fit is
                        perfect. I love the unique design, and it's become a
                        go-to for me when I want to look stylish but still be
                        comfortable. Definitely worth the investment.
                      </p>
                    </div>
                  </div>
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

                      <Button type="submit">Gửi</Button>
                    </form>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="@shadcn"
                          />
                          <AvatarFallback>AC</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">Sarah Johnson</div>
                            <div className="flex items-center gap-0.5">
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                            </div>
                          </div>
                          <div className="text-muted-foreground">
                            I really love the design and functionality of this
                            product. It's been a great addition to my home.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="@shadcn"
                          />
                          <AvatarFallback>AC</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">Alex Smith</div>
                            <div className="flex items-center gap-0.5">
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                            </div>
                          </div>
                          <div className="text-muted-foreground">
                            This product exceeded my expectations. The quality
                            is outstanding, and it's been a game-changer in my
                            daily routine.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="@shadcn"
                          />
                          <AvatarFallback>AC</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">Emily Parker</div>
                            <div className="flex items-center gap-0.5">
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-primary" />
                              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                            </div>
                          </div>
                          <div className="text-muted-foreground">
                            The product is decent, but I was hoping for a bit
                            more. It's still a good value for the price.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </LayoutWapper>
    )
  }
}

function MinusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  )
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
