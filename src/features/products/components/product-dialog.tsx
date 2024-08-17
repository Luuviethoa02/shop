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
import { Color, Size } from "@/types/client"
import { useRef, useState } from "react"
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
import { useCreateProduct } from "../api/create-product"
import { SpokeSpinner } from "@/components/ui/spinner"
import toast from "react-hot-toast"
import { useCategories } from "@/features/categories/api/get-categories"

interface Iprops {
  open: boolean
  setOpen: (value: boolean) => void
}

export const ProductDialog = ({ open, setOpen }: Iprops) => {
  const { data: categories } = useCategories()

  const [colors, setColors] = useState<Color[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const productAdd = useCreateProduct()

  const [sizeModalAdd, setSizeModalAdd] = useState(false)
  const [colorModalAdd, setColorModalAdd] = useState(false)

  const formColor = useForm<z.infer<typeof formColorSchema>>({
    resolver: zodResolver(formColorSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  })

  const formWeight = useForm<z.infer<typeof formWeightSchema>>({
    resolver: zodResolver(formWeightSchema),
    defaultValues: {
      name: "",
      weight: "",
    },
  })

  const formProduct = useForm<z.infer<typeof formProductSchema>>({
    resolver: zodResolver(formProductSchema),
    defaultValues: {
      name: "",
      brand_id: "",
      price: "",
      sizes: sizes,
      colors: colors,
      des: "",
      publish: false,
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

  const onSubmitProduct = (values: z.infer<typeof formProductSchema>) => {
    const form = new FormData() as unknown as globalThis.FormData

    for (const key in values) {
      if (key === "sizes" || key === "colors") {
        const items = Array.isArray(values[key]) ? values[key] : [values[key]]
        items.forEach((item, index) => {
          if ("image" in item) {
            form.append(`${key}[${index}].name`, item.name)
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
        error: "Có lỗi <x></x>ảy ra.",
      }
    )
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
                        <FormLabel>Gía sản phẩm</FormLabel>
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
                          Thêm màu sắc
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
                          onClick={() => setSizeModalAdd(true)}
                        >
                          Thêm kích cỡ
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
                        <Textarea placeholder="Nhập tên sản phẩm" {...field} />
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
                        <div className="flex items-center space-x-2">
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
                  {productAdd.status === "pending"
                    ? "Đang thêm"
                    : "Thêm sản phẩm"}
                </Button>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={colorModalAdd} onOpenChange={setColorModalAdd}>
        <DialogContent className="sm:max-w-[600px]">
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
        </DialogContent>
      </Dialog>

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
