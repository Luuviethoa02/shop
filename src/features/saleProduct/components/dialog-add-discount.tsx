import { Dialog, DialogContent } from "@/components/ui/dialog"

import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useUpdateColorText } from "@/features/products/api/update.color"
import toast from "react-hot-toast"
import { QueryKey } from "@/types/client"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"

interface Iprops {
    open: boolean
    setOpen: (value: boolean) => void
}

const schemaUpdateColorQuantities = z.object({
    quantity: z.string()
})

export default function DialogAddDiscount({ open, setOpen }: Iprops) {
    const updateQuantity = useUpdateColorText()
    const [startDate, setStartDate] = useState(new Date());

    const form = useForm<z.infer<typeof schemaUpdateColorQuantities>>({
        resolver: zodResolver(schemaUpdateColorQuantities)
    })

    useEffect(() => {
        if (!open) {
            form.reset()
        }

    }, [open])

    const onSubmit = (values: z.infer<typeof schemaUpdateColorQuantities>) => {
        console.log(values);

        // const formData = new FormData()
        // formData.append("quantity", values.quantity)
        // formData.append("productId", colorEdit?.productId!)

        // toast.promise(updateQuantity.mutateAsync({
        //     data: formData,
        //     colorEditId: colorEdit?.colorId as string
        // }, {
        //     onSuccess: () => {
        //         setOpen(false)
        //         setDialogDetail(false)
        //     }
        // }),
        //     {
        //         loading: "Đang cập nhật số lượng...",
        //         success: "Cập nhật số lượng thành công",
        //         error: "Cập nhật số lượng thất bại"
        //     })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
                <DialogTitle>Cập nhật số lượng sản phẩm</DialogTitle>
                <FormProvider {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <Input
                                    min={1}
                                    {...field}
                                    type="number"
                                    placeholder="Nhập số lượng mới"
                                    className="w-full"
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date!)} />
                            )}
                        />
                        <Button disabled={updateQuantity.status === 'pending'} className="block" type="submit">Cập nhật</Button>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
