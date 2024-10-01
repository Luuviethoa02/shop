import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SHIPPING_UNIT } from "../constants"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { stateOderItemType } from "@/types/client"
import { Dispatch, SetStateAction } from "react"

interface Iprops {
  open: boolean
  setOpen: (value: boolean) => void
  shippingActive: string | undefined
  stateOder: stateOderItemType
  setStateOder: Dispatch<SetStateAction<stateOderItemType>>
}

const DialogShippingUnit = ({
  open,
  setOpen,
  setStateOder,
  shippingActive,
  stateOder,
}: Iprops) => {
  const { formatNumberToVND } = useFormatNumberToVND()

  const handleValueChange = (value: "fast" | "save") => {
    if (shippingActive) {
      setStateOder({
        ...stateOder,
        [shippingActive]: {
          ...stateOder[shippingActive],
          totalPrice:
            stateOder[shippingActive].totalPrice -
            SHIPPING_UNIT[stateOder[shippingActive].type_tranfer]
              .price_shipped +
            SHIPPING_UNIT[value].price_shipped,
          type_tranfer: value,
        },
      })
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogTitle>Chọn phương thức vận chuyển</DialogTitle>
        <RadioGroup
          onValueChange={handleValueChange}
          defaultValue="comfortable"
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              checked={
                (shippingActive &&
                  stateOder[shippingActive]?.type_tranfer === "fast") ||
                false
              }
              value="fast"
              id="r3"
            />
            <Label htmlFor={`address-${2}`} className="flex-grow">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-gray-500 capitalize">
                  {SHIPPING_UNIT["fast"].lable}
                </p>
                <div className="text-sm text-destructive">
                  {formatNumberToVND(SHIPPING_UNIT["fast"].price_shipped)}
                </div>
              </div>

              <div className="font-normal">
                {"Nhận hàng vào: " +
                  SHIPPING_UNIT["fast"].day[0] +
                  " - " +
                  SHIPPING_UNIT["fast"].day[1]}
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              checked={
                (shippingActive &&
                  stateOder[shippingActive]?.type_tranfer === "save") ||
                false
              }
              value="save"
              id="r3"
            />
            <Label htmlFor={`address-${2}`} className="flex-grow">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-gray-500 capitalize">
                  {SHIPPING_UNIT["save"].lable}
                </p>
                <div className="text-sm text-destructive">
                  {formatNumberToVND(SHIPPING_UNIT["save"].price_shipped)}
                </div>
              </div>

              <div className="font-normal">
                {"Nhận hàng vào: " +
                  SHIPPING_UNIT["save"].day[0] +
                  " - " +
                  SHIPPING_UNIT["save"].day[1]}
              </div>
            </Label>
          </div>
        </RadioGroup>
      </DialogContent>
    </Dialog>
  )
}

export default DialogShippingUnit
