import { useQuery, UseQueryResult } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { ResponseSuccess } from "@/types/api"
import toast from "react-hot-toast"

type UseGetTextSearchOptions = {
  text: string | undefined
}

export const getNotificationByUserId = ({
  text,
}: {
  text: string | undefined
}): Promise<ResponseSuccess<string[]>> => {
  return api.get(`/search/${text}`)
}

export const getTextSearchQueryOptions = ({
  text,
}: {
  text: string | undefined
}) => {
  return {
    queryKey: ["search-for", text],
    queryFn: () => getNotificationByUserId({ text }),
    enabled: !!text,
  }
}

export const useGetTextSearch = ({ text }: UseGetTextSearchOptions) => {
  return useQuery({
    ...getTextSearchQueryOptions({ text }),
  })
}

export const useFetchSearchForText = (
  text: string
): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: ["research-for", text],
    queryFn: async (): Promise<ResponseSuccess<string[]>> => {
      if (!text) {
        return {
          statusCode: 200,
          message: "tìm kiêm không có dữ liệu",
          data: [],
        }
      }
      const data: ResponseSuccess<string[]> = await api.get(`/search/${text}`)
      if (data.statusCode === 200) {
        return data
      }
      toast(data.message, { icon: "🚨" })
      throw new Error(data.message)
    },
    enabled: !!text,
  })
}
