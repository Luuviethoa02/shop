import { queryOptions, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { QueryConfig } from "@/lib/react-query"
import { CategoryResponse } from "@/types/api"

type UseCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getCategoriesQueryOptions>
}

export const getAllCategoies = (): Promise<CategoryResponse> => {
  return api.get(`/brand`)
}

export const getCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ["all", "categories"],
    queryFn: getAllCategoies,
  })
}

export const useCategories = ({ queryConfig }: UseCategoriesOptions = {}) => {
  return useQuery({
    ...getCategoriesQueryOptions(),
    ...queryConfig,
  })
}
