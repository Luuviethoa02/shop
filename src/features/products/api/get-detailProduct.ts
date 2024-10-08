import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { productDetailResponse } from "@/types/api"

type UseProductOptions = {
  slug: string | undefined
  queryConfig?: QueryConfig<typeof getProductDetailQueryOptions>
}

export const getDetailProduct = (
  slug: string
): Promise<productDetailResponse> => {
  return api.get(`/product/detail/${slug}`)
}

export const getProductDetailQueryOptions = (slug: string | undefined) => {
  return {
    queryKey: ["productDetail", slug],
    queryFn: () => getDetailProduct(slug as string),
    enabled: !!slug,
  }
}

export const useDetailProduct = ({ slug, queryConfig }: UseProductOptions) => {
  return useQuery({
    ...getProductDetailQueryOptions(slug),
    ...queryConfig,
  })
}
