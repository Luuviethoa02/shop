import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { producstResponse, productDetailResponse } from "@/types/api"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import LayoutWapper from "@/components/warper/layout.wrapper"

interface Iprops {
  data: productDetailResponse | undefined
  status: "error" | "success" | "pending"
}


export const ProductDetail = ({ data, status }: Iprops) => {

  if (status === 'pending') {
    return <h3>loading....</h3>
  }


  const [selectedColor, setSelectedColor] = useState("black")
  const [selectedSize, setSelectedSize] = useState("m")
  const [quantity, setQuantity] = useState(1)
  const product = {
    name: "Acme Hoodie",
    description: "A cozy and stylish hoodie made from premium materials.",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Gray", hex: "#808080" },
    ],
    sizes: ["s", "m", "l", "xl"],
    pricing: {
      black: {
        s: 59.99,
        m: 59.99,
        l: 59.99,
        xl: 59.99,
      },
      navy: {
        s: 59.99,
        m: 59.99,
        l: 59.99,
        xl: 59.99,
      },
      gray: {
        s: 59.99,
        m: 59.99,
        l: 59.99,
        xl: 59.99,
      },
    },
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }
  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
  }

  if (data?.data) {
    const { formatNumberToVND } = useFormatNumberToVND()

    const { productDetail: { colors, brand_id, des, name, price, sizes } } = data?.data
    return (
      <LayoutWapper>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
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
                  <button className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={color.image}
                      alt={color.name}
                      width={200}
                      height={150}
                      className="h-full w-full object-cover object-center transition-opacity duration-300 ease-in-out hover:opacity-80"
                      style={{ aspectRatio: "200/150", objectFit: "cover" }}
                    />
                  </button>))}
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
                  <span className="text-2xl font-bold">{formatNumberToVND(price)}</span>
                  <span className="ml-2 text-gray-500 line-through">$59.99</span>
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
                      onValueChange={handleColorChange}
                      className="flex items-center gap-2 flex-wrap"
                    >
                      {colors.map((color) => (
                        <Label
                          key={color.name}
                          htmlFor={`color-${color.name.toLowerCase()}`}
                          className="border cursor-pointer rounded-md p-1 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        >
                          <RadioGroupItem
                            id={`color-${color.name.toLowerCase()}`}
                            value={color.name.toLowerCase()}
                          />
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
                      onValueChange={handleSizeChange}
                      className="flex items-center gap-2"
                    >
                      {sizes.map((size) => (
                        <Label
                          key={size.name}
                          htmlFor={`size-${size}`}
                          className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        >
                          <RadioGroupItem id={`size-${size}`} value={size.name} />
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
                <Button size="lg" className="w-full">
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
                  <p>
                    {des}
                  </p>
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
                        now, and it's quickly become one of my favorite tees. The
                        fabric is incredibly soft and comfortable, and the unique
                        design really sets it apart from other basic t-shirts.
                        Highly recommend!
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
                        The Acme Prism T-Shirt is a great addition to my wardrobe.
                        The quality is top-notch, and the fit is perfect. I love the
                        unique design, and it's become a go-to for me when I want to
                        look stylish but still be comfortable. Definitely worth the
                        investment.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="comments">
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-medium">Emily Parker</h4>
                        <span className="text-sm text-muted-foreground">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        I just received my Acme Prism T-Shirt and I'm in love! The
                        fabric is so soft and comfortable, and the design is
                        absolutely stunning. I can't wait to wear it out this
                        weekend.
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
                        <h4 className="text-base font-medium">Michael Johnson</h4>
                        <span className="text-sm text-muted-foreground">
                          1 week ago
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        I was a bit hesitant about the Acme Prism T-Shirt at first,
                        but after seeing it in person, I'm so glad I decided to give
                        it a try. The quality is amazing, and the fit is perfect.
                        Definitely a new favorite in my wardrobe!
                      </p>
                    </div>
                  </div>
                </div>
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
