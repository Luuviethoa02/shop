import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import { oderDetailResponse } from "@/types/api"

type UseNotificationOptions = {
  oderId: string | undefined
}

export const getOderDetailByOderId = ({
  oderId,
}: {
  oderId: string | undefined
}): Promise<oderDetailResponse> => {
  return api.get(`/oder/getDetail/${oderId}`)
}

export const getNotificationQueryOptions = (
  {
    oderId,
  }: {
    oderId: string | undefined
  } = {
    oderId: undefined,
  }
) => {
  return {
    queryKey: ["get-oder-detail", oderId],
    queryFn: () => getOderDetailByOderId({ oderId: oderId }),
    enabled: !!oderId,
  }
}

export const useGetOderDetailByUserId = ({
  oderId,
}: UseNotificationOptions) => {
  return useQuery({
    ...getNotificationQueryOptions({ oderId }),
  })
}
