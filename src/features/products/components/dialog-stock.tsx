import { Dialog, DialogContent } from "@/components/ui/dialog"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ColorIpi } from "@/types/api"

import { QueryKey, Size } from "@/types/client"

import DialogUpdateQuantity from "@/features/products/components/dialog-update-quantity"

interface Iprops {
    open: boolean
    setOpen: (value: boolean) => void
    productStock: ColorIpi[] | undefined
    sizes: Size[] | undefined
    productId: string | undefined
    queryKey:QueryKey | undefined
}

export default function DialogStock({ open, setOpen,queryKey, productStock, sizes, productId }: Iprops) {
    const [dialogUpdate, setDialogUpdate] = useState(false)
    const [colorEdit, setColorEdit] = useState<{ colorId: string, productId: string }>()

    const textSize = useMemo(() => {
        return sizes?.map((size) => `${size.name} <${size.weight} kg>`).join(", ")
    }, [sizes])

    const handleBtnclickUpdate = (colorId: string) => {
        setDialogUpdate(true)
        setColorEdit({ colorId, productId: productId! })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl">
                <div className="container mx-auto py-10">
                    <h1 className="text-2xl font-bold mb-4">Chi tiết kho hàng sản phẩm</h1>
                    <ScrollArea className="h-[400px] border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Hình ảnh</TableHead>
                                    <TableHead>Tên</TableHead>
                                    <TableHead>Kích cỡ</TableHead>
                                    <TableHead>Kho hiện có</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productStock?.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                        </TableCell>
                                        <TableCell className="font-medium capitalize">{item.name}</TableCell>
                                        <TableCell>{textSize}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>

                                        <TableCell className="text-right">
                                            <Button onClick={() => handleBtnclickUpdate(item._id)}>Cập nhật</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </DialogContent>
            <DialogUpdateQuantity
            colorEdit={colorEdit}
            open={dialogUpdate}
            queryKey={queryKey}
            setDialogDetail={setOpen}
            setOpen={setDialogUpdate} />
        </Dialog>
    )
}
