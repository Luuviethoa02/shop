import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MinusIcon, PlusIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react"
import LayoutWapper from "@/components/warper/layout.wrapper"

export function CartRoutes() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Cozy Blanket",
      price: 29.99,
      quantity: 2,
    },
    {
      id: 2,
      name: "Autumn Mug",
      price: 12.99,
      quantity: 1,
    },
    {
      id: 3,
      name: "Fall Fragrance Candle",
      price: 16.99,
      quantity: 1,
    },
  ])
  const handleQuantityChange = (id: number, quantity: number) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }
  const handleRemoveItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  return (
    <LayoutWapper size="medium">
      <div className="flex flex-col h-full mt-10">
        <header className="bg-primary text-primary-foreground py-4 px-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="h-6 w-6" />
              <h1 className="text-xl font-bold">Cart</h1>
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
          <div className="grid gap-8">
            <div className="grid gap-4">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <img
                      src="/placeholder.svg"
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                      style={{ aspectRatio: "80/80", objectFit: "cover" }}
                    />
                    <div className="grid gap-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <span className="font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </LayoutWapper>
  )
}
