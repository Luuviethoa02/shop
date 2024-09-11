import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Discount, QueryKey } from "@/types/client"

import { DialogTitle } from "@radix-ui/react-dialog"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import LoadingMain from "@/components/share/LoadingMain"
import { TIME_LOADING } from "../constants"
import { Checkbox } from "@/components/ui/checkbox"
import { productRespose } from "@/types/api"
import { useUpdateDiscount } from "../api/update-apply-product"
import toast from "react-hot-toast"

interface Iprops {
  open: boolean
  setOpen: (value: boolean) => void
  queryKey: QueryKey | undefined
  productAdd: productRespose[] | undefined
  currentDiscount: Discount | undefined
}

export default function DialogAddProductDiscount({
  open,
  setOpen,
  queryKey,
  productAdd,
  currentDiscount,
}: Iprops) {
  const { formatNumberToVND } = useFormatNumberToVND()
  const [loading, setLoading] = useState<boolean>(true)
  const [productIds, setProductIds] = useState<string[]>([])
  const updateDiscount = useUpdateDiscount({ ...queryKey! })

  const handleClickApply = () => {
    toast.promise(
      updateDiscount.mutateAsync(
        {
          data: {
            productIds,
          },
          discountId: currentDiscount?._id!,
        },
        {
          onSuccess: () => {
            setOpen(false)
            setProductIds([])
          },
        }
      ),
      {
        loading: "Đang áp dụng sản phẩm...",
        success: "Áp dụng sản phẩm thành công",
        error: "Áp dụng sản phẩm thất bại",
      }
    )
  }

  const handleInputChange = (productId: string) => {
    if (productIds.includes(productId)) {
      setProductIds(productIds.filter((id) => id !== productId))
    } else {
      setProductIds([...productIds, productId])
    }
  }

  useEffect(() => {
    if (!open) {
      setProductIds([])
    }
  }, [open])

  useEffect(() => {
    const id = setTimeout(() => {
      setLoading(false)
    }, TIME_LOADING)

    return () => {
      setLoading(true)
      clearTimeout(id)
    }
  }, [productAdd?.length])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
        className="max-w-4xl"
      >
        <DialogTitle>Thêm sản phẩm áp dụng mã khuyến mãi</DialogTitle>
        <div className="w-full max-w-4xl mx-auto p">
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[160px]">Hình ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="capitalize">giá gốc</TableHead>
                  <TableHead className="capitalize">giảm còn</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableBody>
                  {loading && (
                    <div className="flex w-full items-center justify-center pt-20">
                      <LoadingMain />
                    </div>
                  )}

                  {!loading && (
                    <>
                      {productAdd?.length == 0 && (
                        <div className="flex w-full items-center justify-center pt-20">
                          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                            Hiện chưa có sản phẩm có nào!
                          </h2>
                        </div>
                      )}
                      {productAdd &&
                        productAdd.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              <img
                                src={product?.colors[0].image}
                                alt={product?.name}
                                className="rounded-md size-16"
                              />
                            </TableCell>
                            <TableCell className="font-medium line-clamp-2 text-left max-w-44">
                              {product?.name}
                            </TableCell>

                            <TableCell className="text-left">
                              {formatNumberToVND(product?.price)}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-left">
                              {formatNumberToVND(product?.price)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  onCheckedChange={() =>
                                    handleInputChange(product._id)
                                  }
                                  checked={productIds.includes(product._id)}
                                  id="terms"
                                />
                                <label
                                  htmlFor="terms"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Chọn
                                </label>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
        {!loading && productAdd && productAdd?.length > 0 && (
          <DialogFooter>
            <Button
              onClick={() => setProductIds([])}
              type="button"
              variant={"destructive"}
              disabled={productIds.length == 0}
            >
              Bỏ chọn({productIds.length})
            </Button>
            <Button
              onClick={handleClickApply}
              type="button"
              disabled={productIds.length == 0}
            >
              Áp dụng({productIds.length})
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
