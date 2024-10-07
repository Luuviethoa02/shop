import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { ResponseData } from "@/types/api"
import { Seller, User } from "@/types/client"

export type UseGetAllSellersOptions = {
  page?: number
  limit?: number
  status?: string
}

export const getAllSellers = ({
  ...agrs
}: UseGetAllSellersOptions): Promise<ResponseData<Seller & { user: User }>> => {
  return api.get(`/seller/getAll`, {
    params: {
      ...agrs,
    },
  })
}

export const getAllSellersQueryOptions = ({
  ...agrs
}: UseGetAllSellersOptions) => {
  return {
    queryKey: ["get-all-sellers", { ...agrs }],
    queryFn: () => getAllSellers({ ...agrs }),
  }
}

export const useGetAllSellers = ({ ...args }: UseGetAllSellersOptions) => {
  return useQuery({
    ...getAllSellersQueryOptions({ ...args }),
  })
}
