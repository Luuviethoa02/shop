import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { ResponseSuccess } from "@/types/api"

type UsehistoryOptions = {
  page?: number
  limit?: number
}

export const getTopSearch = ({
  ...args
}: UsehistoryOptions): Promise<ResponseSuccess<{ _id: string; total: number;}[]>> => {
  return api.get(`/searchHistory/topSearch`, {
    params: {
      ...args
    },
  })
}

export const getTopSearchQueryOptions = (
  {
    ...args
  }: UsehistoryOptions
) => {
  return {
    queryKey: ["get-all-top-search", { ...args }],
    queryFn: () => getTopSearch({  ...args }),
  }
}

export const useGetTopSearch= ({
  ...args
}: UsehistoryOptions) => {
  return useQuery({
    ...getTopSearchQueryOptions({ ...args }),
  })
}
