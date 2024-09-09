import { Button } from "@/components/ui/button"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { useCartStore } from "@/store"
import { CartItem as CartItemType } from "@/types/client"
import { X } from "lucide-react"
import toast from "react-hot-toast"

const CartItem = ({ item, id }: { id: string; item: CartItemType }) => {
  const { formatNumberToVND } = useFormatNumberToVND()
  const { removeCart } = useCartStore()

  const handleRemoveCart = (id: string) => {
    removeCart(id)
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng!")
  }

  return (
    <div className="flex items-center space-x-4 py-2">
      <img
        src={item.color.image}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold line-clamp-2">{item.product.name}</h3>
        <p className="text-sm text-muted-foreground">
          Màu: {item.color.name}, Kích thước:{" "}
          {`${item.size.name}<${item.size.weight}kg>`}
        </p>
        <p className="font-medium">{formatNumberToVND(item.product.price)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span>{item.quantity}</span>
      </div>
      <Button onClick={() => handleRemoveCart(id)} size="icon" variant="ghost">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default CartItem
