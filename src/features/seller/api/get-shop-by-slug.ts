import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { Comments, Seller, User } from "@/types/client"
import { productRespose, ResponseSuccess } from "@/types/api"

export type UseGetShopBySlugOptions = {
  slug?: string
  page?: number
  limit?: number
  status?: string
}

export type shopInfoType = Seller & {
  user: User
  followers: { _id: string; createdAt: string }
  totalProducts: number
  topSellingProducts: {
    _id: string
    quantity: number
    product: productRespose
  }[]
  commentRecents: Comments[]
  productDiscountRecents: productRespose[]
  totalComments: number
  averageRating: number
}

export const getShopBySlug = ({
  slug,
  ...agrs
}: UseGetShopBySlugOptions): Promise<ResponseSuccess<shopInfoType>> => {
  return api.get(`/seller/getinfo/${slug}`, {
    params: {
      ...agrs,
    },
  })
}

export const getShopQueryOptions = ({
  slug,
  ...agrs
}: UseGetShopBySlugOptions) => {
  return {
    queryKey: ["get-shop-by-slug", slug, { ...agrs }],
    queryFn: () => getShopBySlug({ slug, ...agrs }),
    enabled: !!slug,
  }
}

export const useGetShopBySlug = ({
  slug,
  ...args
}: UseGetShopBySlugOptions) => {
  return useQuery({
    ...getShopQueryOptions({ slug, ...args }),
  })
}
