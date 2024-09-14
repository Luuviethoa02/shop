import { Button } from "@/components/ui/button"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductSellerId } from "@/features/products/api/get-sellerIdProduct"
import DialogStock from "@/features/products/components/dialog-stock"
import { LIMIT_PAE_PRODUCT_LIST } from "@/features/products/constants"
import useFormatDateVN from "@/hooks/useFormatDateVN"
import { useAuthStore } from "@/store"
import { ColorIpi, productRespose } from "@/types/api"
import { queryKeyProducts, Seller, Size } from "@/types/client"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const StockRoute = () => {
  const { formatDate } = useFormatDateVN()
  const [productStock, setProductStock] = useState<ColorIpi[]>()
  const [sizeStock, setSizeStock] = useState<Size[]>()
  const [productId, setProductId] = useState<string>()
  const currentUser = useAuthStore((state) => state.user)
  const [queryKey, setQueryKey] = useState<queryKeyProducts>()

  const [page, setPage] = useState(1)

  const { data: productsApi, status: statusGet } = useProductSellerId({
    page,
    limit: LIMIT_PAE_PRODUCT_LIST,
    sellerId: (currentUser?.sellerId as Seller)._id,
    status: "active",
  })

  const [showModal, setShowModalAdd] = useState(false)
  const [showModalDetail, setShowModaDetail] = useState(false)

  const handleClickDetail = (
    productId: string,
    product: ColorIpi[],
    sizes: Size[]
  ) => {
    setShowModaDetail(true)
    setProductStock(product)
    setSizeStock(sizes)
    setProductId(productId)
  }

  const totalProducts = (colors: ColorIpi[]) => {
    const total = colors.reduce(
      (acc, curentValue) => acc + Number(curentValue.quantity),
      0
    )
    return total
  }

  useEffect(() => {
    if (!showModal) {
      setProductStock(undefined)
      setSizeStock(undefined)
      setProductId(undefined)
    }
  }, [showModal])

  useEffect(() => {
    setQueryKey({
      page,
      limit: LIMIT_PAE_PRODUCT_LIST,
      sellerId: (currentUser?.sellerId as Seller)._id,
      status: "active",
    })
  }, [page, LIMIT_PAE_PRODUCT_LIST, (currentUser?.sellerId as Seller)._id])

  if (statusGet == "success" && (productsApi?.data?.length ?? 0) === 0) {
    return (
      <div className="flex items-center flex-col min-h-full gap-7 justify-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Hiện chưa có sản phẩm nào!
        </h2>
        <Link to={"/seller/products"}>Thêm mới sản phẩm</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-0 flex min-h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kho sản phẩm</h1>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left">Sản phẩm</th>
              <th className="px-4 py-3 text-left">Danh mục</th>
              <th className="px-4 py-3 text-right">Tổng số lượng sản phẩm</th>
              <th className="px-4 py-3 text-right">Cập nhật gần nhất</th>
              <th className="px-4 py-3 text-right">Hành Động</th>
              <th className="px-4 py-3 text-right"></th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {statusGet === "pending" &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div>
                        <Skeleton className="h-5 w-40" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-4 py-5">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-4 py-5">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-4 ml-10 py-5 text-right">
                    <Skeleton className="h-5 w-16 ml-3" />
                  </td>
                  <td className="px-4 py-5 text-right">
                    <Skeleton className="h-5 w-16" />
                  </td>
                </tr>
              ))}

            {statusGet === "success" &&
              productsApi?.data?.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium flex items-center gap-4 max-w-80">
                    <img
                      src={product.colors[0].image}
                      alt={product.name}
                      className="w-16 rounded h-16 object-cover block"
                    />
                    <p className="line-clamp-2">{product.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.brand_id.img_cover}
                        alt={product.name}
                        className="w-16 h-16 rounded object-cover block"
                      />
                      <p className="capitalize">{product.brand_id.name}</p>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center font-medium">
                    {totalProducts(product.colors)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatDate(product.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleClickDetail(
                          product._id,
                          product.colors,
                          product.sizes
                        )
                      }
                    >
                      Nhập hàng
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-right font-medium"></td>
                  <td className="px-4 py-3 text-right font-medium"></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        {(productsApi?.data?.length ?? 0) > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={() => setPage(page - 1)}
                />
              </PaginationItem>
              {Array.from({
                length: Math.ceil(productsApi?.total! / LIMIT_PAE_PRODUCT_LIST),
              }).map((_, p) => (
                <PaginationItem className="cursor-pointer" key={p}>
                  <PaginationLink
                    isActive={p + 1 === page}
                    onClick={() => setPage(p + 1)}
                  >
                    {p + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className={
                    page ===
                    Math.ceil(productsApi?.total! / LIMIT_PAE_PRODUCT_LIST)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={() => setPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <DialogStock
        productStock={productStock}
        queryKey={queryKey}
        productId={productId}
        sizes={sizeStock}
        open={showModalDetail}
        setOpen={setShowModaDetail}
      />
    </div>
  )
}
