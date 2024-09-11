import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Color, Seller, Size } from "@/types/client"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormData from "form-data"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  formColorSchema,
  formProductSchema,
  formWeightSchema,
} from "../validators"
import { ColorImage } from "./color-image"
import { SizeProduct } from "./product-size"
import { Switch } from "@/components/ui/switch"
import { SpokeSpinner } from "@/components/ui/spinner"
import toast from "react-hot-toast"
import { useCategories } from "@/features/categories/api/get-categories"
import { useAuthStore } from "@/store"
import { LIMIT_PAE_PRODUCT_LIST } from "../constants"
import { ColorIpi, productRespose } from "@/types/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { useUpdateColor } from "@/features/products/api/update-color-img"
import { useCreateProduct } from "@/features/products/api/create-product"

interface Iprops {
  open: boolean
  setOpen: (value: boolean) => void
  product: productRespose | undefined
}

export const ProductDialog = ({ open, setOpen, product }: Iprops) => {
  const updateColor = useUpdateColor({
    page: 1,
    limit: LIMIT_PAE_PRODUCT_LIST,
    sellerId: (useAuthStore()?.user?.sellerId as Seller)._id,
  })

  const [colorEdits, setColorEdits] = useState<ColorIpi[]>()
  const [colorActive, setColorActive] = useState<{
    _id: string
    name: string
    image: FileList
  }>()

  useEffect(() => {
    setColorEdits(product?.colors)
  }, [product])

  const handleEditColor = (e: ChangeEvent<HTMLInputElement>, _id: string) => {
    if (e.target?.files) {
      const img = getImageUrl(e.target.files)!
      const colorUpdate = colorEdits?.map((color) => {
        if (color._id == _id) {
          const colorActive = {
            ...color,
            image: img,
          }
          setColorActive({ ...colorActive, image: e.target.files! })
          return colorActive
        }
        return color
      })
      setColorEdits(colorUpdate)
    }
  }

  const handleBtnClickUpdateColor = () => {
    if (colorActive) {
      console.log(colorActive)

      const formData = new FormData() as unknown as globalThis.FormData
      formData.append("img", colorActive.image[0])
      formData.append("productId", product?._id!)
      toast.promise(
        updateColor.mutateAsync(
          { data: formData, colorEditId: colorActive._id },
          {
            onSuccess: () => {
              console.log("success")
            },
            onError: () => {
              console.log("error")
            },
          }
        ),
        {
          loading: "Đang cập nhật ảnh sản phẩm...",
          success: "Cập nhật ảnh sản phẩm thành công!",
          error: "Có lỗi xảy ra.",
        }
      )
    }
  }

  const { data: categories } = useCategories()
  const currentUser = useAuthStore()

  const [colors, setColors] = useState<Color[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const productAdd = useCreateProduct({
    sellerId: (currentUser?.user?.sellerId as Seller)?._id,
    limit: LIMIT_PAE_PRODUCT_LIST,
    page: 1,
  })

  const [sizeModalAdd, setSizeModalAdd] = useState(false)
  const [colorModalAdd, setColorModalAdd] = useState(false)

  const formColor = useForm<z.infer<typeof formColorSchema>>({
    resolver: zodResolver(formColorSchema),
  })

  const formWeight = useForm<z.infer<typeof formWeightSchema>>({
    resolver: zodResolver(formWeightSchema),
  })

  const formProduct = useForm<z.infer<typeof formProductSchema>>({
    resolver: zodResolver(formProductSchema),
    defaultValues: {
      ...product,
      brand_id: "",
      sizes: sizes,
      colors: colors,
    },
  })

  const onSubmit = (values: z.infer<typeof formColorSchema>) => {
    setColors((colors) => [...colors, values])
    formProduct.setValue("colors", [...colors, values])
    formColor.reset()
    setColorModalAdd(false)
  }

  const onSubmitWeight = (values: z.infer<typeof formWeightSchema>) => {
    setSizes((sizes) => [...sizes, values])
    formProduct.setValue("sizes", [...sizes, values])
    setSizeModalAdd(false)
    formWeight.reset()
  }

  useEffect(() => {
    if (product) {
      console.log(product)
      formProduct.setValue("name", product.name)
      formProduct.setValue("brand_id", product.brand_id._id)
      formProduct.setValue("des", product.des)
      formProduct.setValue("price", product.price.toString())
      formProduct.setValue("publish", product.publish)
    }
  }, [open])

  const onSubmitProduct = (values: z.infer<typeof formProductSchema>) => {
    const form = new FormData() as unknown as globalThis.FormData

    for (const key in values) {
      if (key === "sizes" || key === "colors") {
        const items = Array.isArray(values[key]) ? values[key] : [values[key]]
        items.forEach((item, index) => {
          if ("image" in item) {
            form.append(`${key}[${index}].name`, item.name)
            form.append(`${key}[${index}].quantity`, item.quantity.toString())
            if (item.image instanceof FileList) {
              form.append(`${key}[${index}].image`, item.image[0])
            }
          } else if ("weight" in item) {
            form.append(`${key}[${index}].name`, item.name)
            form.append(`${key}[${index}].weight`, item.weight)
          }
        })
      } else {
        form.append(key, values[key as keyof typeof values] as string)
      }
    }

    form.append("sellerId", (currentUser?.user?.sellerId as Seller)?._id)

    toast.promise(
      productAdd.mutateAsync(
        { data: form },
        {
          onSuccess: () => {
            setOpen(false)
            formProduct.reset()
            setColors([])
            setSizes([])
          },
        }
      ),
      {
        loading: "Đang Thêm sản phẩm...",
        success: "Thêm sản phẩm thành công!",
        error: "Có lỗi xảy ra.",
      }
    )
  }

  function getImageUrl(file: FileList | undefined): string | null {
    if (!file) return null

    return URL.createObjectURL(file[0])
  }

  const handleReset = () => {
    formColor.reset({ name: "", image: undefined })
    if (fileInputRef.current) {
      fileInputRef.current.value = null!
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <Form {...formProduct}>
            <form
              onSubmit={formProduct.handleSubmit(onSubmitProduct)}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="grid gap-2">
                  <FormField
                    control={formProduct.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên sản phẩm</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên sản phẩm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={formProduct.control}
                    name="brand_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục sản phẩm</FormLabel>

                        <FormControl>
                          <Select
                            disabled={!categories}
                            {...field}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục sản phẩm" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories &&
                                categories?.data?.map((category) => (
                                  <SelectItem
                                    className="capitalize"
                                    value={category._id}
                                    key={category._id}
                                  >
                                    {category?.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={formProduct.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          giá sản phẩm
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập giá sản phẩm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <FormField
                  control={formProduct.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">Màu sắc</FormLabel>
                      <FormControl>
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => setColorModalAdd(true)}
                        >
                          {product ? "Sửa màu sắc" : "  Thêm màu sắc"}
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-center">
                <ColorImage setColors={setColors} colors={colors} />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={formProduct.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">Kích cỡ</FormLabel>
                      <FormControl>
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => setSizeModalAdd(true)}
                        >
                          {product ? "Sửa kích cỡ" : "  Thêm kích cỡ"}
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-center">
                <SizeProduct sizes={sizes} />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={formProduct.control}
                  name="des"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chi tiết sản phẩm</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-44"
                          placeholder="Nhập tên sản phẩm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={formProduct.control}
                  name="publish"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center mt-3 space-x-2">
                          <Switch
                            {...field}
                            defaultChecked={formProduct.watch("publish")}
                            checked={formProduct.watch("publish")}
                            onCheckedChange={(value) => {
                              formProduct.setValue("publish", value as boolean)
                              field.onChange(value as boolean)
                            }}
                            value={
                              formProduct.watch("publish") ? "true" : "false"
                            }
                          />
                          <Label htmlFor="public">Công khai</Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-end pr-1 gap-2">
                <Button
                  disabled={productAdd.status === "pending"}
                  type="submit"
                >
                  {productAdd.status === "pending" && (
                    <SpokeSpinner size="lg" />
                  )}
                  {product
                    ? productAdd.status === "pending"
                      ? "Đang sửa"
                      : "Sửa sản phẩm"
                    : productAdd.status === "pending"
                      ? "Đang thêm"
                      : "Thêm sản phẩm"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={colorModalAdd} onOpenChange={setColorModalAdd}>
        <AlertDialogContent className="max-w-2xl overflow-hidden">
          {!product && (
            <Form {...formColor}>
              <form
                onSubmit={formColor.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={formColor.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên màu sắc</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên màu sắc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formColor.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={50000}
                          placeholder="Nhập số lượng"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formColor.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình ảnh</FormLabel>
                      <FormControl>
                        <Input
                          ref={fileInputRef}
                          onChange={(e) => field.onChange(e?.target?.files)}
                          type="file"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Thêm màu sắc</Button>
                <Button
                  type="button"
                  className="ml-2"
                  onClick={handleReset}
                  variant="outline"
                >
                  Hủy
                </Button>
              </form>
            </Form>
          )}

          {product && (
            <>
              <div className="">
                <h1 className="text-2xl font-bold mb-4">Danh sách màu</h1>
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full max-w-4xl overflow-hidden"
                >
                  <CarouselContent className="-mr-20">
                    {colorEdits &&
                      colorEdits.map((card, index) => (
                        <CarouselItem
                          key={card._id}
                          className="md:basis-1/2 lg:basis-1/3"
                        >
                          <Card className="w-full">
                            <CardContent className="pt-6">
                              <div className="w-full relative size-44 rounded-md mb-4">
                                <img
                                  src={card.image}
                                  alt={card.name}
                                  className="w-full h-full object-cover rounded-md"
                                />
                                <Input
                                  type="file"
                                  onChange={(e) => handleEditColor(e, card._id)}
                                  className="size-10 absolute right-2 bottom-1 bg-transparent text-transparent opacity-0 z-10 cursor-pointer"
                                />
                                <ImageIcon className="absolute right-2 bottom-1 text-white cursor-pointer" />
                              </div>
                              <Button
                                onClick={handleBtnClickUpdateColor}
                                disabled={
                                  card._id !== colorActive?._id ||
                                  updateColor.status == "pending"
                                }
                                className="mt-3 w-full"
                              >
                                Thay đổi ảnh
                              </Button>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-4">
                              <div className="w-full">
                                <Label htmlFor={`name-${card._id}`}>Tên</Label>
                                <Input
                                  id={`name-${card._id}`}
                                  type="text"
                                  value={card.name}
                                  className="w-full"
                                />
                              </div>
                              <div className="w-full">
                                <Label htmlFor={`imageUrl-${card._id}`}>
                                  Đườn dẫn ảnh
                                </Label>
                                <Input
                                  id={`imageUrl-${card._id}`}
                                  type="text"
                                  value={card.image}
                                  disabled
                                  className="w-full"
                                />
                              </div>
                              <Button disabled className="w-full">
                                Cập nhật
                              </Button>
                              <Button
                                variant={"destructive"}
                                className="w-full"
                              >
                                Xóa
                              </Button>
                            </CardFooter>
                          </Card>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={sizeModalAdd} onOpenChange={setSizeModalAdd}>
        <DialogContent className="sm:max-w-[600px]">
          <Form {...formWeight}>
            <form
              onSubmit={formWeight.handleSubmit(onSubmitWeight)}
              className="space-y-5"
            >
              <FormField
                control={formWeight.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại kích cỡ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập Loại kích cỡ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formWeight.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cân nặng</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        {...field}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn cân nặng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="18-25">18-25</SelectItem>
                            <SelectItem value="26-35">26-35</SelectItem>
                            <SelectItem value="36-45">36-45</SelectItem>
                            <SelectItem value="46-55">46-55</SelectItem>
                            <SelectItem value="56-65">56-65</SelectItem>
                            <SelectItem value="66+">66+</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Thêm cân nặng</Button>
              <Button
                type="button"
                className="ml-2"
                onClick={() => formWeight.reset({ name: "", weight: "" })}
                variant="outline"
              >
                Hủy
              </Button>
            </form>
          </Form>
          <div></div>
        </DialogContent>
      </Dialog>
    </>
  )
}
