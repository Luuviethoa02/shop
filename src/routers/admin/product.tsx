import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination } from "@/components/ui/pagination"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FilePenIcon, Table, Trash2Icon } from "lucide-react"
import { useState } from "react"

export const ProductRoute = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Cozy Sweater",
      brand: "Acme Apparel",
      color: ["black", "gray", "burgundy"],
      size: ["S", "M", "L", "XL"],
      price: 59.99,
      images: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
    },
    {
      id: 2,
      name: "Outdoor Jacket",
      brand: "Trailblazer",
      color: ["olive", "navy", "charcoal"],
      size: ["XS", "S", "M", "L", "XL"],
      price: 99.99,
      images: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
    },
    {
      id: 3,
      name: "Leather Backpack",
      brand: "Rugged Gear",
      color: ["brown", "black"],
      size: ["one size"],
      price: 149.99,
      images: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
    },
    {
      id: 4,
      name: "Cotton T-Shirt",
      brand: "Comfort Classics",
      color: ["white", "navy", "heather gray"],
      size: ["S", "M", "L", "XL", "XXL"],
      price: 24.99,
      images: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
    },
    {
      id: 5,
      name: "Denim Jeans",
      brand: "Timeless Threads",
      color: ["indigo", "black", "light wash"],
      size: ["28", "30", "32", "34", "36"],
      price: 69.99,
      images: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
    },
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(5)
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber)
  }
  const handleViewDetails = (product: any) => {
    setSelectedProduct(product)
    setShowModal(true)
  }
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
  }
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button size="sm" onClick={() => setShowModal(true)}>
          Add New Product
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Color</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{product.brand}</td>
                <td className="px-4 py-3">
                  {product.color.map((color, index) => (
                    <span
                      key={index}
                      className={`inline-block w-4 h-4 rounded-full mr-1 ${
                        color === "black"
                          ? "bg-black"
                          : color === "gray"
                            ? "bg-gray-500"
                            : color === "burgundy"
                              ? "bg-[#800020]"
                              : color === "olive"
                                ? "bg-[#808000]"
                                : color === "navy"
                                  ? "bg-[#000080]"
                                  : color === "charcoal"
                                    ? "bg-[#36454F]"
                                    : color === "brown"
                                      ? "bg-[#A52A2A]"
                                      : color === "white"
                                        ? "bg-white border"
                                        : color === "heather gray"
                                          ? "bg-[#DCDCDC]"
                                          : color === "indigo"
                                            ? "bg-[#4B0082]"
                                            : color === "light wash"
                                              ? "bg-[#ADD8E6]"
                                              : ""
                      }`}
                    />
                  ))}
                </td>
                <td className="px-4 py-3">
                  {product.size.map((size, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 mr-1 bg-muted rounded-md"
                    >
                      {size}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(product)}
                  >
                    View Details
                  </Button>
                  <Button size="sm" variant="secondary" className="ml-2">
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="secondary" className="ml-2">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <Pagination />
      </div>
    </div>
  )
}
