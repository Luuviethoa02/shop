import Axios, { InternalAxiosRequestConfig } from "axios"

import { env } from "@/config/env"
import axios from "axios"
import qs from "qs"

function newAbortSignal(timeoutMs: number) {
  const abortController = new AbortController()
  setTimeout(() => abortController.abort(), timeoutMs || 0)

  return abortController.signal
}

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json"
  }

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data"
  }

  const accessToken = localStorage.getItem("accessToken")
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  config.withCredentials = true

  config.timeout = 36000
  config.signal = newAbortSignal(36000)

  config.paramsSerializer = (params: Record<string, any>) =>
    qs.stringify(params, { arrayFormat: "brackets" })

  return config
}

export const api = Axios.create({
  baseURL: env.API_URL,
})

api.interceptors.request.use(authRequestInterceptor)
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem("refreshToken")
        if (refresh) {
          const response = await axios.post(
            env.API_URL + "/auth/refresh-token",
            {
              refreshToken: refresh,
            }
          )
          const {
            user,
            jwt: { accessToken, refreshToken },
          } = response.data

          localStorage.setItem("accessToken", accessToken)
          localStorage.setItem("refreshToken", refreshToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return axios(originalRequest)
        }
      } catch (error) {
        window.location.href = "/auth/login"
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
    }

    return Promise.reject(error)
  }
)
