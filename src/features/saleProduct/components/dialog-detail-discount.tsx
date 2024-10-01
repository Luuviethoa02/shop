import { Dialog, DialogContent } from "@/components/ui/dialog"

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
import { productRespose } from "@/types/api"

import { Discount, queryKeyProducts } from "@/types/client"

import { DialogTitle } from "@radix-ui/react-dialog"
import useFormatNumberToVND from "@/hooks/useFormatNumberToVND"
import { useEffect, useState } from "react"
import LoadingMain from "@/components/share/LoadingMain"
import { TIME_LOADING } from "../constants"
import { calculatePercentage } from "@/lib/utils"

interface Iprops {
  open: boolean
  setOpen: (value: boolean) => void
  queryKey: queryKeyProducts | undefined
  productApply: productRespose[] | undefined
  currentDiscount: Discount | undefined
}

export default function DialogDetailDiscount({
  open,
  setOpen,
  queryKey,
  productApply,
  currentDiscount,
}: Iprops) {
  const { formatNumberToVND } = useFormatNumberToVND()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const id = setTimeout(() => {
      setLoading(false)
    }, TIME_LOADING)

    return () => {
      clearTimeout(id)
    }
  }, [productApply, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
        className="max-w-4xl"
      >
        <DialogTitle>Danh sách sản phẩm áp dụng mã khuyến mãi</DialogTitle>
        <div className="w-full max-w-4xl mx-auto p">
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[160px]">Hình ảnh</TableHead>
                  <TableHead className="max-w-[290px] text-center min-w-[290px]">
                    Tên sản phẩm
                  </TableHead>
                  <TableHead className="capitalize">giá gốc</TableHead>
                  <TableHead className="capitalize ">giảm còn</TableHead>
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
                      {productApply?.length == 0 && (
                        <div className="flex w-full items-center justify-center pt-20">
                          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                            Hiện chưa có sản phẩm có nào!
                          </h2>
                        </div>
                      )}

                      {productApply &&
                        productApply.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              <img
                                src={product.colors[0].image}
                                alt={product.name}
                                className="rounded-md size-16"
                              />
                            </TableCell>
                            <TableCell className="font-medium line-clamp-3 text-center max-w-96 min-w-96">
                              {product.name}
                            </TableCell>

                            <TableCell className="text-right line-through">
                              {formatNumberToVND(product.price)}
                            </TableCell>

                            <TableCell className="text-right text-destructive">
                              {formatNumberToVND(
                                calculatePercentage(
                                  currentDiscount?.discount_percentage!,
                                  product?.price
                                )
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="space-x-2">
                                <Button variant="destructive" size="sm">
                                  Hủy áp dụng
                                </Button>
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
      </DialogContent>
    </Dialog>
  )
}
