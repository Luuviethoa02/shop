import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { StarIcon } from "lucide-react"
import { useEffect } from "react"
import LayoutWapper from "@/components/warper/layout.wrapper"
import Product from "@/features/products/components/product"

export const CategoriesRoute = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <LayoutWapper size="small">
      <div className="grid grid-cols-[300px_1fr] gap-6 p-6">
        <div className="bg-background rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Color</h3>
              <div className="grid grid-cols-3 gap-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <div className="w-5 h-5 rounded-full bg-red-500" />
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <div className="w-5 h-5 rounded-full bg-green-500" />
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <div className="w-5 h-5 rounded-full bg-blue-500" />
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <div className="w-5 h-5 rounded-full bg-yellow-500" />
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <div className="w-5 h-5 rounded-full bg-purple-500" />
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <div className="w-5 h-5 rounded-full bg-gray-500" />
                </Label>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Price Range</h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="min-price" className="font-medium">
                    Min
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    min="0"
                    max="1000"
                    step="10"
                    className="w-24 px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="max-price" className="font-medium">
                    Max
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    min="0"
                    max="1000"
                    step="10"
                    className="w-24 px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Discounts</h3>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span>10% or more</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span>20% or more</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span>30% or more</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span>40% or more</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span>50% or more</span>
                </Label>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Sort By</h3>
              <Select defaultValue="latest">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest Arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Services & Promotions
              </h3>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span>Free Shipping</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span>Buy One, Get One Free</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span>Exclusive Offers</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span>Limited-Time Sales</span>
                </Label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index}>{index}</div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </LayoutWapper>
  )
}
