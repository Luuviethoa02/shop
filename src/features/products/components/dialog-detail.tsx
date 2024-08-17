import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { productRespose } from "@/types/api"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"

interface Iprops {
  open: boolean
  setOpen: (value: boolean) => void
  productDetail: productRespose | undefined
}

export default function DialogDetail({ open, setOpen, productDetail }: Iprops) {
  const { formatNumberToVND } = useFormatNumberToVND()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <div className="grid md:grid-cols-2 gap-2 lg:gap-12 items-start">
          <div className="grid gap-4">
            <div className="max-h-60 max-w-60">
              <img
                src={productDetail?.colors[0].image}
                alt="Product Image"
                width={300}
                height={300}
                className="aspect-square w-full rounded-lg object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {productDetail?.colors.map((color) => (
                <button className="border hover:border-primary rounded-lg overflow-hidden">
                  <img
                    src={color.image}
                    alt={`this is a image color ${color.name}`}
                    width={70}
                    height={70}
                    className="aspect-square w-full object-cover"
                  />
                  <span className="sr-only">{color.image}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <h1 className="text-2xl font-bold">{productDetail?.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm capitalize">
                  {productDetail?.brand_id.name}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  In Stock
                </Badge>
                <Badge variant="outline" className="text-sm">
                  20% Off
                </Badge>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold">
                  {formatNumberToVND(productDetail?.price)}
                </div>
                <div className="text-2xl font-bold line-through text-muted-foreground">
                  {formatNumberToVND(productDetail?.price)}
                </div>
              </div>
              <p className="text-muted-foreground line-clamp-6">
                {productDetail?.des}
              </p>
            </div>
            <form className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="color" className="text-base">
                  Màu
                </Label>
                <RadioGroup
                  id="color"
                  defaultChecked={false}
                  disabled
                  className="flex items-center gap-2"
                >
                  <Label
                    htmlFor="color-black"
                    className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                  >
                    <RadioGroupItem id="color-black" value="black" />
                    Black
                  </Label>
                  <Label
                    htmlFor="color-white"
                    className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                  >
                    <RadioGroupItem id="color-white" value="white" />
                    White
                  </Label>
                  <Label
                    htmlFor="color-blue"
                    className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                  >
                    <RadioGroupItem id="color-blue" value="blue" />
                    Blue
                  </Label>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size" className="text-base">
                  Kích cỡ
                </Label>
                <RadioGroup
                  id="size"
                  defaultValue="m"
                  className="flex items-center gap-2"
                >
                  {productDetail?.sizes.map((size) => (
                    <Label
                      htmlFor="size-xs"
                      className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                    >
                      <RadioGroupItem
                        id="size-xs"
                        className="flex items-center gap-1"
                        value="xs"
                      />
                      <span className="uppercase">{size.name}</span>
                      <span className="text-nowrap">{`<${size.weight}>`}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity" className="text-base">
                  Quantity
                </Label>
                <Select defaultValue="1">
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="grid gap-4 text-sm leading-loose">
          <p>
            Introducing the Acme Prism T-Shirt, a perfect blend of style and
            comfort for the modern individual. This tee is crafted with a
            meticulous composition of 60% combed ringspun cotton and 40%
            polyester jersey, ensuring a soft and breathable fabric that feels
            gentle against the skin.
          </p>
          <p>
            The design of the Acme Prism T-Shirt is as striking as it is
            comfortable. The shirt features a unique prism-inspired pattern that
            adds a modern and eye-catching touch to your ensemble.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
