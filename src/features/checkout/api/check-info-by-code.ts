import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"
import { Discount } from "@/types/client"

const checkInfoCodeSchema = z.object({
  discountCode: z
    .string({
      required_error: "Mã giảm giá không được để trống",
    })
    .length(8, {
      message: "Mã giảm giá phải có 8 ký tự",
    }),
})

export const checkInfoCode = ({
  data,
  sellerId,
}: {
  data: z.infer<typeof checkInfoCodeSchema>
  sellerId: string
}): Promise<{
  statusCode: number
  message: string
  data: null | Discount
}> => {
  return api.post(`/discountCode/info/${sellerId}`, data)
}

export const useCheckInfoCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-info-code"],
      })
    },
    mutationFn: checkInfoCode,
  })
}
