import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { productDetailResponse } from "@/types/api"

type UseProductOptions = {
  slug?: string
  params?: { [key: string]: number }
}

export const getDetailProduct = ({
  slug,
  params,
}: UseProductOptions): Promise<productDetailResponse> => {
  return api.get(`/product/detail/${slug}`, {
    params,
  })
}

export const getProductDetailQueryOptions = ({
  slug,
  params,
}: UseProductOptions) => {
  return {
    queryKey: ["productDetail", slug, params],
    queryFn: () => getDetailProduct({ slug, params }),
    enabled: !!slug,
  }
}

export const useDetailProduct = ({ slug, params }: UseProductOptions) => {
  return useQuery({
    ...getProductDetailQueryOptions({ slug, params }),
  })
}
