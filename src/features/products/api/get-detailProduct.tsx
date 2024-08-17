import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { producstResponse } from "@/types/api"

type UseProductOptions = {
  slug: string
  queryConfig?: QueryConfig<typeof getProductDetailQueryOptions>
}

export const getDetailProduct = (slug: string): Promise<producstResponse> => {
  return api.get(`/product/detail/${slug}`)
}

export const getProductDetailQueryOptions = (slug: string) => {
  return {
    queryKey: ["productDetail", slug],
    queryFn: () => getDetailProduct(slug),
  }
}

export const useDetailProduct = ({ slug, queryConfig }: UseProductOptions) => {
  return useQuery({
    ...getProductDetailQueryOptions(slug),
    ...queryConfig,
    placeholderData: keepPreviousData,
  })
}
