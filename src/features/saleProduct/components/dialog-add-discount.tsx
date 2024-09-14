import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FormProvider, useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useUpdateColorText } from "@/features/products/api/update.color"
import toast from "react-hot-toast"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateDiscount } from "../api/create-discount"
import { queryKeyProducts } from "@/types/client"
import LoadingMain from "@/components/share/LoadingMain"

interface Iprops {
  open: boolean
  setOpen: (value: boolean) => void
  queryKey: queryKeyProducts | undefined
}

export const schemaCreateDiscount = z.object({
  start_date: z.string().nonempty("Thời gian bắt đầu không được để trống"),
  end_date: z.string().nonempty("Thời gian kết thúc không được để trống"),
  discount_percentage: z
    .string()
    .nonempty("Phần trăm giảm giá không được để trống"),
  description: z.string().optional(),
})

export default function DialogAddDiscount({ open, setOpen, queryKey }: Iprops) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [hoursStart, setHoursStart] = useState("12")
  const [minutesStart, setMinutesStart] = useState("00")
  const [secondsStart, setSecondsStart] = useState("00")
  const [hoursEnd, setHoursEnd] = useState("13")
  const [minutesEnd, setMinutesEnd] = useState("00")
  const [secondsEnd, setSecondsEnd] = useState("00")

  const createDiscount = useCreateDiscount({ ...queryKey! })

  const form = useForm<z.infer<typeof schemaCreateDiscount>>({
    resolver: zodResolver(schemaCreateDiscount),
  })

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open])

  const formatDateTime = (
    date: Date | null,
    hours: string,
    minutes: string,
    seconds: string
  ) => {
    if (!date) return "Chọn thời gian"
    const formattedDate = format(date, "PPP")
    return `${formattedDate} ${hours}:${minutes}:${seconds}`
  }

  const onSubmit = (values: z.infer<typeof schemaCreateDiscount>) => {
    const start_date = formatDateTime(
      values.start_date as unknown as Date,
      hoursStart,
      minutesStart,
      secondsStart
    )
    const end_date = formatDateTime(
      values.end_date as unknown as Date,
      hoursEnd,
      minutesEnd,
      secondsEnd
    )

    const data = {
      ...values,
      start_date,
      end_date,
      sellerId: queryKey?.sellerId!,
    }
    toast.promise(
      createDiscount.mutateAsync(
        {
          data,
        },
        {
          onSuccess: () => {
            setOpen(false)
            form.reset()
          },
        }
      ),
      {
        loading: "Đang tạo mã giảm giá...",
        success: "Tạo mã giảm giá thành công",
        error: "Tạo mã giảm giá thất bại",
      }
    )
  }

  if (createDiscount.status == "pending") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onOpenAutoFocus={(e: Event) => e.preventDefault()}
          className="max-w-xl"
        >
          <div className="flex items-center justify-center">
            <LoadingMain />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogTitle>Tạo mã giảm giá</DialogTitle>
        <FormProvider {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center gap-3">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <div className="flex flex-col gap-3 w-1/2">
                    <FormLabel className="block">Thời gian bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDateTime(
                            startDate,
                            hoursStart,
                            minutesStart,
                            secondsStart
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate || undefined}
                          onSelect={(date) => {
                            setStartDate(date!)
                            field.onChange(date ? date.toISOString() : "")
                          }}
                          initialFocus
                        />
                        <div className="border-t border-border p-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Select
                              value={hoursStart}
                              onValueChange={setHoursStart}
                            >
                              <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={i.toString().padStart(2, "0")}
                                  >
                                    {i.toString().padStart(2, "0")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>:</span>
                            <Select
                              value={minutesStart}
                              onValueChange={setMinutesStart}
                            >
                              <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 60 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={i.toString().padStart(2, "0")}
                                  >
                                    {i.toString().padStart(2, "0")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>:</span>
                            <Select
                              value={secondsStart}
                              onValueChange={setSecondsStart}
                            >
                              <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="SS" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 60 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={i.toString().padStart(2, "0")}
                                  >
                                    {i.toString().padStart(2, "0")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <div className="flex flex-col gap-3 w-1/2">
                    <FormLabel className="block">Thời gian kết thúc</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDateTime(
                            endDate,
                            hoursEnd,
                            minutesEnd,
                            secondsEnd
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate || undefined}
                          onSelect={(date) => {
                            setEndDate(date!)
                            field.onChange(date ? date.toISOString() : "")
                          }}
                          initialFocus
                        />
                        <div className="border-t border-border p-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Select
                              value={hoursEnd}
                              onValueChange={setHoursEnd}
                            >
                              <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={i.toString().padStart(2, "0")}
                                  >
                                    {i.toString().padStart(2, "0")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>:</span>
                            <Select
                              value={minutesEnd}
                              onValueChange={setMinutesEnd}
                            >
                              <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 60 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={i.toString().padStart(2, "0")}
                                  >
                                    {i.toString().padStart(2, "0")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>:</span>
                            <Select
                              value={secondsEnd}
                              onValueChange={setSecondsEnd}
                            >
                              <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="SS" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 60 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={i.toString().padStart(2, "0")}
                                  >
                                    {i.toString().padStart(2, "0")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="discount_percentage"
              render={({ field }) => (
                <>
                  <FormLabel className="block">Phần trăm giảm giá</FormLabel>
                  <Input
                    {...field}
                    min={1}
                    max={100}
                    type="number"
                    placeholder="Phần trăm giảm giá"
                  />
                </>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <>
                  <FormLabel className="block">Mô tả</FormLabel>
                  <Textarea {...field} placeholder="Mô tả" />
                </>
              )}
            />
            <Button className="block" type="submit">
              Tạo mã giảm giá
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
