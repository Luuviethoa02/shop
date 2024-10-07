import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { ResponseData, productRespose } from "@/types/api"

type UseGetTextSearchOptions = {
  text?: string
  page?: number
  limit?: number
  minPrice?: number
  maxPrice?: number
  color?: string[]
  categories?: string[]
  province?: string[]
  rating?: number
  is_discount: boolean
}

export const getSearchFilterProductbyId = ({
  text,
  ...args
}: {
  text: string | undefined
}): Promise<ResponseData<productRespose>> => {
  return api.get(`/search/product/${text}`, {
    params: { ...args },
  })
}

export const getTextSearchQueryOptions = ({
  text,
  ...args
}: UseGetTextSearchOptions) => {
  return {
    queryKey: ["search-product-for", text, { ...args }],
    queryFn: () => getSearchFilterProductbyId({ text, ...args }),
    enabled: !!text,
  }
}

export const useGetTextSearch = ({
  text,
  ...args
}: UseGetTextSearchOptions) => {
  return useQuery({
    ...getTextSearchQueryOptions({ text, ...args }),
  })
}
