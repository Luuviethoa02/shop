import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

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
import useFormatDateVN from "@/hooks/useFormatDateVN"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { useAuthStore } from "@/store"
import { productRespose } from "@/types/api"
import { queryKeyProducts, Seller } from "@/types/client"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useUpdateProductStatus } from "../api/update-status-product"
import { useDeleteProduct } from "../api/delete-product"
import { RefreshCcw } from "lucide-react"

const TableProduct = ({ status }: { status: "active" | "inactive" }) => {
  const { formatNumberToVND } = useFormatNumberToVND()
  const { formatDate } = useFormatDateVN()
  const [productDetail, setProductDetail] = useState<productRespose>()
  const [productDelete, setProductDelete] = useState<productRespose>()
  const [productAdd, setProductAdd] = useState<productRespose>()
  const currentUser = useAuthStore((state) => state.user)

  const [page, setPage] = useState(1)
  const [queryKey, setQueryKey] = useState<queryKeyProducts>({
    page,
    limit: LIMIT_PAE_PRODUCT_LIST,
    sellerId: (currentUser?.sellerId as Seller)._id,
    status,
  })

  const {
    data: productsApi,
    status: statusGet,
    refetch,
  } = useProductSellerId(queryKey)

  const delelteProductBin = useUpdateProductStatus(queryKey)
  const restoreDelelteProductBin = useUpdateProductStatus(queryKey)
  const delelteProductPermanetly = useDeleteProduct(queryKey)

  useEffect(() => {
    setQueryKey({
      sellerId: (currentUser?.sellerId as Seller)._id,
      page,
      limit: LIMIT_PAE_PRODUCT_LIST,
      status,
    })
  }, [
    page,
    status,
    LIMIT_PAE_PRODUCT_LIST,
    (currentUser?.sellerId as Seller)._id,
  ])

  const [showModal, setShowModalAdd] = useState(false)
  const [showModalDetail, setShowModaDetail] = useState(false)
  const [showModaDelete, setShowModaDelete] = useState(false)
  const [showModaRestore, setShowModaRestore] = useState(false)

  const handleClickDetail = (product: productRespose) => {
    setShowModaDetail(true)
    setProductDetail(product)
  }

  const handleRefetch = () => {
    refetch()
  }

  const handleClickEdit = (product: productRespose) => {
    setShowModalAdd(true)
    setProductAdd(product)
  }
  const handleClickDelete = (product: productRespose) => {
    setProductDelete(product)
    setShowModaDelete(true)
  }

  const handleClickRestore = (product: productRespose) => {
    setProductDelete(product)
    setShowModaRestore(true)
  }

  const handleClickDeleteRestore = () => {
    if (!productDelete || status === "active") {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
    }
    const data = new FormData()
    data.append("status", "active")
    toast.promise(
      restoreDelelteProductBin.mutateAsync(
        {
          data,
          productId: productDelete?._id!,
        },
        {
          onSuccess: () => {
            setShowModaRestore(false)
          },
        }
      ),
      {
        loading: "Đang xử lý...",
        success: "Khôi phục sản phẩm thành công",
        error: "Khôi phục sản phẩm thất bại",
      }
    )
  }

  const handleClickDeletePermanently = () => {
    if (!productDelete) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
    }
    if (status == "active") {
      const data = new FormData()
      data.append("status", "inactive")
      toast.promise(
        delelteProductBin.mutateAsync(
          {
            data,
            productId: productDelete?._id!,
          },
          {
            onSuccess: () => {
              setShowModaDelete(false)
            },
          }
        ),
        {
          loading: "Đang xử lý...",
          success: "Xóa sản phẩm thành công",
          error: "Xóa sản phẩm thất bại",
        }
      )
    } else {
      toast.promise(
        delelteProductPermanetly.mutateAsync(
          {
            productId: productDelete?._id!,
          },
          {
            onSuccess: () => {
              setShowModaDelete(false)
            },
          }
        ),
        {
          loading: "Đang xử lý...",
          success: "Xóa vĩnh viễn sản phẩm thành công",
          error: "Xóa vĩnh viễn sản phẩm thất bại",
        }
      )
    }
  }

  useEffect(() => {
    if (!showModal) {
      setProductAdd(undefined)
    }
  }, [showModal])

  useEffect(() => {
    if (!showModaDelete) {
      setProductDelete(undefined)
    }
  }, [showModaDelete])

  useEffect(() => {
    if (!showModaRestore) {
      setProductDelete(undefined)
    }
  }, [showModaRestore])

  if (statusGet == "success" && (productsApi?.data?.length ?? 0) === 0) {
    return (
      <div className="flex items-center flex-col min-h-full gap-7 justify-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {status === "active"
            ? "Hiện chưa có sản phẩm nào!"
            : "Hiện chưa có sản phẩm nào trong thùng rác"}
        </h2>
        {status === "active" && (
          <>
            <Button size="sm" onClick={() => setShowModalAdd(true)}>
              Thêm mới sản phẩm
            </Button>
            <ProductDialog
              queryKey={queryKey}
              product={productAdd}
              open={showModal}
              setOpen={setShowModalAdd}
            />
          </>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-0 flex min-h-full flex-col">
      <div className="flex gap-3 items-center mb-6">
        {(productsApi?.data?.length ?? 0) > 0 && status === "active" && (
          <Button size="sm" onClick={() => setShowModalAdd(true)}>
            Thêm mới sản phẩm
          </Button>
        )}
        <Button
          onClick={handleRefetch}
          className="flex items-center gap-2"
          variant="outline"
        >
          <RefreshCcw className="size-5" />
          <span>Làm mới</span>
        </Button>
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
          <tbody className="min-h-[500px]">
            {statusGet === "pending" &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition-colors"
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
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-3 font-medium flex items-center gap-4 max-w-80">
                    <img
                      src={product.colors[0].image}
                      alt={product.name}
                      className="w-16 rounded h-16 object-cover block"
                    />
                    <p className="line-clamp-2 text-gray-700">{product.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium flex items-center gap-4">
                      <img
                        src={product.brand_id.img_cover}
                        alt={product.name}
                        className="w-16 h-16 rounded object-cover block "
                      />
                      <p className="capitalize text-gray-700">
                        {product.brand_id.name}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-gray-700">
                    {formatNumberToVND(product.price)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-700">
                    {formatDate(product.createdAt)}
                  </td>
                  {status === "active" ? (
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleClickDetail(product)}
                        className="shadow-md"
                      >
                        chi tiết
                      </Button>
                      <Button
                        onClick={() => handleClickEdit(product)}
                        size="sm"
                        className="ml-2 shadow-md"
                      >
                        Sửa
                      </Button>
                      <Button
                        onClick={() => handleClickDelete(product)}
                        size="sm"
                        variant="destructive"
                        className="ml-2 shadow-md"
                      >
                        Xóa
                      </Button>
                    </td>
                  ) : (
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleClickRestore(product)}
                        className="shadow-md"
                      >
                        Khôi phục
                      </Button>
                      <Button
                        onClick={() => handleClickDelete(product)}
                        size="sm"
                        variant="destructive"
                        className="ml-2 shadow-md"
                      >
                        Xóa vĩnh viễn
                      </Button>
                    </td>
                  )}

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
      {status == "inactive" && (
        <>
          <Dialog open={showModaDelete} onOpenChange={setShowModaDelete}>
            <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
              <DialogTitle>
                <h2 className="text-2xl font-semibold">
                  Xác nhận xóa vĩnh viễn sản phẩm?
                </h2>
              </DialogTitle>
              <DialogDescription>
                Sau khi xóa vĩnh viễn, sản phẩm sẽ không thể khôi phục lại.
              </DialogDescription>
              <DialogFooter>
                <Button
                  onClick={() => setShowModaDelete(false)}
                  variant={"outline"}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleClickDeletePermanently}
                  variant={"destructive"}
                >
                  Xác nhận
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showModaRestore} onOpenChange={setShowModaRestore}>
            <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
              <DialogTitle>
                <h2 className="text-2xl font-semibold">
                  Xác nhận khôi phục lại sản phẩm?
                </h2>
              </DialogTitle>
              <DialogDescription>
                Sau khi khôi phục, sản phẩm sẽ được chuyển vào sản phẩm hoạt
                động.
              </DialogDescription>
              <DialogFooter>
                <Button
                  onClick={() => setShowModaRestore(false)}
                  variant={"outline"}
                >
                  Hủy
                </Button>
                <Button onClick={handleClickDeleteRestore} variant={"default"}>
                  Xác nhận
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {status == "active" && (
        <Dialog open={showModaDelete} onOpenChange={setShowModaDelete}>
          <DialogContent>
            <DialogTitle>
              <h2 className="text-2xl font-semibold">Xác nhận xóa sản phẩm?</h2>
            </DialogTitle>
            <DialogDescription>
              Sau khi xóa, sản phẩm sẽ được chuyển vào thùng rác.
            </DialogDescription>
            <DialogFooter>
              <Button
                onClick={() => setShowModaDelete(false)}
                variant={"outline"}
              >
                Hủy
              </Button>
              <Button
                onClick={handleClickDeletePermanently}
                variant={"destructive"}
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <ProductDialog
        queryKey={queryKey}
        product={productAdd}
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

export default TableProduct
