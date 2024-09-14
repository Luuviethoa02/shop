import { Dialog, DialogContent } from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
            <div className="max-h-60 min-h-60 max-w-full">
              <img
                src={productDetail?.colors[0]?.image}
                alt="Product Image"
                width={300}
                height={300}
                className="aspect-square w-full rounded-lg object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-[6.25rem]">
              {productDetail?.colors?.map((color) => (
                <button
                  key={color._id}
                  className="border hover:border-primary rounded-lg overflow-hidden"
                >
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
            </div>
            <form className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="color" className="text-base">
                  Màu sắc
                </Label>
                <RadioGroup
                  id="color"
                  className="flex items-center gap-2 flex-wrap"
                >
                  {productDetail?.colors?.map((color) => (
                    <Label
                      key={color._id}
                      htmlFor={color._id}
                      className="border rounded-md p-1 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                    >
                      <RadioGroupItem
                        disabled
                        id={color._id}
                        value={color._id}
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
              {(productDetail?.sizes?.length ?? 0) > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="size" className="text-base">
                    Kích thước
                  </Label>
                  <RadioGroup id="size" className="flex items-center gap-2">
                    {productDetail?.sizes?.map((size) => (
                      <Label
                        key={size.name}
                        htmlFor={`size-${size}`}
                        className="border rounded-md p-2 flex flex-wrap items-center gap-2 [&:has(:checked)]:bg-muted"
                      >
                        <RadioGroupItem
                          id={`size-${size}`}
                          disabled
                          value={size.name}
                        />
                        <p className="text-nowrap">{`${size.name.toUpperCase()}<${size.weight}kg>`}</p>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </form>
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-6">
          {productDetail?.des}
        </p>
      </DialogContent>
    </Dialog>
  )
}
