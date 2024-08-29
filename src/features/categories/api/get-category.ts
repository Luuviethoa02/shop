import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { productDetailResponse } from "@/types/api"

type UseBrandOptions = {
  slug: string | undefined
  queryConfig?: QueryConfig<typeof getCategoryDetailQueryOptions>
}

export const getDetailBrand = (
  slug: string
): Promise<productDetailResponse> => {
  return api.get(`/brand/detail/${slug}`)
}

export const getCategoryDetailQueryOptions = (slug: string | undefined) => {
  return {
    queryKey: ["category-Detail", slug],
    queryFn: () => getDetailBrand(slug as string),
    enabled: !!slug,
  }
}

export const useCategoryDetail = ({ slug, queryConfig }: UseBrandOptions) => {
  return useQuery({
    ...getCategoryDetailQueryOptions(slug),
    ...queryConfig,
  })
}
