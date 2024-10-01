import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { producstResponse } from "@/types/api"

type UseProductOptions = {
  slugCategory: string | undefined
  page?: number,
  limit?: number,
  minPrice?: number,
  maxPrice?: number,
  color?: string[],
  categories?: string[]
  province?: string[],
  rating?: number,
  is_discount: boolean,
}

export const getProductsByCategory = (
  {
    slugCategory, ...args
  }: {
    slugCategory: string | undefined
  }): Promise<producstResponse> => {

  return api.get(`/product/category/${slugCategory}`, {
    params: { ...args }
  })
}

export const getProductsQueryOptions = (
  {
    slugCategory,
    ...args
  }: UseProductOptions
) => {
  return {
    queryKey: ["get-products-by-category", slugCategory, { ...args }],
    queryFn: () => getProductsByCategory({ slugCategory, ...args }),
    enabled: !!slugCategory,
  }
}

export const useGetProductByCategory = ({
  slugCategory,
  ...args
}: UseProductOptions) => {
  return useQuery({
    ...getProductsQueryOptions({ slugCategory, ...args }),
    placeholderData: keepPreviousData,
  })
}
