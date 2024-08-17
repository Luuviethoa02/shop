import Axios, { InternalAxiosRequestConfig } from "axios"

import { env } from "@/config/env"
import axios from "axios"

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
      }
    }

    return Promise.reject(error)
  }
)
