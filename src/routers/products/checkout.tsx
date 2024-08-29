import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CreditCardIcon, WalletCardsIcon } from "lucide-react"

export function CheckoutRoute() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto py-8 px-4">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg"
                    alt="Product Image"
                    width={64}
                    height={64}
                    className="rounded-md"
                    style={{ aspectRatio: "64/64", objectFit: "cover" }}
                  />
                  <div>
                    <h3 className="font-medium">Acme Hoodie</h3>
                    <p className="text-muted-foreground text-sm">
                      Size: M, Color: Black
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$49.99</p>
                  <p className="text-muted-foreground text-sm">Qty: 1</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg"
                    alt="Product Image"
                    width={64}
                    height={64}
                    className="rounded-md"
                    style={{ aspectRatio: "64/64", objectFit: "cover" }}
                  />
                  <div>
                    <h3 className="font-medium">Acme T-Shirt</h3>
                    <p className="text-muted-foreground text-sm">
                      Size: L, Color: White
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$29.99</p>
                  <p className="text-muted-foreground text-sm">Qty: 2</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p className="font-medium">$109.97</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter your address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Enter your city" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="Enter your state" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input id="zip" placeholder="Enter your zip code" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="Enter your country" />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="card" className="grid gap-4">
              <div>
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex items-center gap-3 rounded-md border border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCardIcon className="h-6 w-6" />
                  <span>Credit Card</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="paypal"
                  id="paypal"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="paypal"
                  className="flex items-center gap-3 rounded-md border border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <WalletCardsIcon className="h-6 w-6" />
                  <span>PayPal</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <p>Subtotal</p>
                <p className="font-medium">$109.97</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Shipping</p>
                <p className="font-medium">$5.00</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Tax</p>
                <p className="font-medium">$9.00</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="font-medium">Total</p>
                <p className="font-medium">$123.97</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Place Order</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
