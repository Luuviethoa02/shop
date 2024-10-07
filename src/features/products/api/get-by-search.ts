import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { producstResponse } from "@/types/api"
export const getProductsByCategory = (
  text: string | undefined,
  page: number | undefined,
  limit: number | undefined,
  minPrice: string | undefined,
  maxPrice: string | undefined,
  color: string | undefined,
  size: string | undefined
): Promise<producstResponse> => {
  const params: Record<string, string | number | undefined> = {
    page,
    limit,
    minPrice,
    maxPrice,
    color,
    size,
  }

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value)
  )

  return api.get(`/search/${text}`, {
    params: filteredParams,
  })
}

export const getProductsQueryOptions = (
  {
    page,
    limit,
    text,
    minPrice,
    maxPrice,
    color,
    size,
  }: {
    text: string | undefined
    page: number | undefined
    limit: number | undefined
    minPrice: string | undefined
    maxPrice: string | undefined
    color: string | undefined
    size: string | undefined
  } = {
    page: undefined,
    limit: undefined,
    text: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    color: undefined,
    size: undefined,
  }
) => {
  return {
    queryKey: ["get-products-by-search", text, page, limit],
    queryFn: () =>
      getProductsByCategory(text, page, limit, minPrice, maxPrice, color, size),
    enabled: !!text,
  }
}

export const useGetProductBySearch = (
  {
    page,
    limit,
    text,
    minPrice,
    maxPrice,
    color,
    size,
  }: {
    text: string | undefined
    page: number | undefined
    limit: number | undefined
    minPrice: string | undefined
    maxPrice: string | undefined
    color: string | undefined
    size: string | undefined
  } = {
    page: undefined,
    limit: undefined,
    text: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    color: undefined,
    size: undefined,
  }
) => {
  return useQuery({
    ...getProductsQueryOptions({
      page,
      limit,
      text,
      minPrice,
      maxPrice,
      color,
      size,
    }),
    placeholderData: keepPreviousData,
  })
}
