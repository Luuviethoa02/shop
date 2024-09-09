import { env } from "@/config/env"
import { ApiResponseProvincesType, ProvincesCommonType } from "@/types/api"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

export const useFetchProvinces = (): UseQueryResult<
  ProvincesCommonType[],
  Error
> => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async (): Promise<ProvincesCommonType[]> => {
      const response = await axios.get<ApiResponseProvincesType>(
        `${env.API_SERVER_PROVINCES_URL}/1/0.htm`
      )
      if (response.data.error === 0) {
        return response.data.data
      } else {
        const message = response.data.error_text
        toast(message, { icon: "🚨" })
        throw new Error(message)
      }
    },
  })
}

export const useFetchDistricts = (
  id: string
): UseQueryResult<ProvincesCommonType[], Error> => {
  return useQuery({
    queryKey: ["districts", id],
    queryFn: async (): Promise<ApiResponseProvincesType[]> => {
      const { data } = await axios.get(
        `${env.API_SERVER_PROVINCES_URL}/2/${id}.htm`
      )
      if (data.error === 0) {
        return data.data
      } else {
        toast(data.error_text, { icon: "🚨" })
        throw new Error(data.error_text)
      }
    },
    enabled: !!id,
  })
}

export const useFetchWards = (
  id: string
): UseQueryResult<ProvincesCommonType[], Error> => {
  return useQuery({
    queryKey: ["wards", id],
    queryFn: async (): Promise<ApiResponseProvincesType[]> => {
      const { data } = await axios.get(
        `${env.API_SERVER_PROVINCES_URL}/3/${id}.htm`
      )
      if (data.error === 0) {
        return data.data
      } else {
        toast(data.error_text, { icon: "🚨" })
        throw new Error(data.error_text)
      }
    },
    enabled: !!id,
  })
}
