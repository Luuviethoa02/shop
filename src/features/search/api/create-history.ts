import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { api } from "@/lib/api-client"

import { productRespose } from "@/types/api"
import { getHistoryQueryOptions } from "@/features/search/api/get-history"

export const createHistory = ({
  data,
}: {
  data: {
    keyWords: string;
    userId: string
  }
}): Promise<{ keyWords: string; create_by: string; validateTime: string }> => {
  return api.post(`/searchHistory/add`, data)
}

export const useCreateHistory = ({ page, limit, userId }: {
  page: number | undefined;
  limit: number | undefined;
  userId: string | undefined;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getHistoryQueryOptions({ page, limit, userId }).queryKey,
      })
    },
    mutationFn: createHistory,
  })
}
