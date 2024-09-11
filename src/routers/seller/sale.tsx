

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
import DialogDetail from "@/features/products/components/dialog-detail"
import { ProductDialog } from "@/features/products/components/product-dialog"
import { LIMIT_PAE_PRODUCT_LIST } from "@/features/products/constants"
import { useDiscountSellerId } from "@/features/saleProduct/api/get-discount-sellerId"
import DialogAddDiscount from "@/features/saleProduct/components/dialog-add-discount"
import useFormatDateVN from "@/hooks/useFormatDateVN"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { useAuthStore } from "@/store"
import { productRespose } from "@/types/api"
import { Seller } from "@/types/client"
import { useEffect, useState } from "react"

export const SaleRoute = () => {
  const { formatNumberToVND } = useFormatNumberToVND()
  const { formatDate } = useFormatDateVN()
  const [productDetail, setProductDetail] = useState<productRespose>()
  const [productAdd, setProductAdd] = useState<productRespose>()
  const currentUser = useAuthStore((state) => state.user)

  const [page, setPage] = useState(1)

  const { data: productsApi, status: statusGet } = useDiscountSellerId({
    page,
    limit: LIMIT_PAE_PRODUCT_LIST,
    sellerId: (currentUser?.sellerId as Seller)._id,
  })

  const [showModal, setShowModalAdd] = useState(false)
  const [showModalDetail, setShowModaDetail] = useState(false)

  const handleClickDetail = (product: productRespose) => {
    setShowModaDetail(true)
    setProductDetail(product)
  }

  const handleClickEdit = (product: productRespose) => {
    setShowModalAdd(true)
    setProductAdd(product)
  }

  useEffect(() => {
    if (!showModal) {
      setProductAdd(undefined)
    }
  }, [showModal])

  if (statusGet == "success" && (productsApi?.data?.length ?? 0) === 0) {
    return (
      <div className="flex items-center flex-col min-h-full gap-7 justify-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Hiện chưa có mã giảm giá nào!
        </h2>
        <Button size="sm" onClick={() => setShowModalAdd(true)}>
          Thêm mới mã giảm giá
        </Button>
        <DialogAddDiscount
          open={showModal}
          setOpen={setShowModalAdd}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 flex min-h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
        {(productsApi?.data?.length ?? 0) > 0 && (
          <Button size="sm" onClick={() => setShowModalAdd(true)}>
            Thêm mới mã giảm giá
          </Button>
        )}
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left">Sản phẩm</th>
              <th className="px-4 py-3 text-left">Danh mục</th>
              <th className="px-4 py-3 text-right">Giá</th>
              <th className="px-4 py-3 text-right">Ngày tạo</th>
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

                  <td className="px-4 py-3 text-right font-medium">
                    {formatNumberToVND(product.price)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleClickDetail(product)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      onClick={() => handleClickEdit(product)}
                      size="sm"
                      className="ml-2"
                    >
                      Sửa
                    </Button>
                    <Button size="sm" variant="destructive" className="ml-2">
                      Xóa
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
      <DialogAddDiscount
        open={showModal}
        setOpen={setShowModalAdd}
      />
      <DialogDetail
        productDetail={productDetail}
        open={showModalDetail}
        setOpen={setShowModaDetail}
      />
    </div>
  )
}
