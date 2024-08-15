import { configureAuth } from "react-query-auth"
import { z } from "zod"

import { api } from "./api-client"
import { AuthResponse, ResponseError } from "@/types/api"
import { User } from "@/types/client"
import toast from "react-hot-toast"
import { AxiosError, AxiosResponse } from "axios"

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features

const getUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("accessToken")
  if (!token) {
    return null
  }
  try {
    return api.get("/auth/me")
  } catch (error) {
    throw error
  }
}

const logout = (): Promise<void> => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  return api.post("/auth/logout")
}

export const loginInputSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
  password: z.string().min(5, "Required"),
})

export type LoginInput = z.infer<typeof loginInputSchema>
const loginWithEmailAndPassword = (data: LoginInput): Promise<AuthResponse> => {
  return api.post("/auth/login", data)
}

export const registerInputSchema = z.object({
  username: z.string().min(1, "Required"),
  email: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
})

export type RegisterInput = z.infer<typeof registerInputSchema>

const registerWithEmailAndPassword = (
  data: RegisterInput
): Promise<AuthResponse> => {
  return api.post("/auth/register", data)
}

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    try {
      const response = await loginWithEmailAndPassword(data)
      if (response.statusCode === 401) {
        throw new AxiosError(response?.message)
      }
      if (response.data.user && response.statusCode === 200) {
        localStorage.setItem("accessToken", response.data.jwt.accessToken)
        localStorage.setItem("refreshToken", response.data.jwt.refreshToken)
        toast.success(response.message)
        return response.data.user
      }
    } catch (error) {
      let errorMessage = "Đã xảy ra lỗi không xác định"
      if (error instanceof AxiosError) {
        if (error.message) {
          errorMessage = error.response?.data?.message
        } else {
          errorMessage = "Có lỗi xảy ra"
        }
      }
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },
  registerFn: async (data: RegisterInput) => {
    try {
      const response = await registerWithEmailAndPassword(data)
      if (response.statusCode === 400) {
        throw new AxiosError(response?.message)
      }
      if (response?.data?.user && response.statusCode === 200) {
        toast.success(response.message)
        return response?.data?.user
      }
    } catch (error) {
      let errorMessage = "Đã xảy ra lỗi không xác định"
      if (error instanceof AxiosError) {
        if (error.message) {
          errorMessage = error.message
        } else {
          errorMessage = "Có lỗi xảy ra"
        }
      }
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },
  logoutFn: logout,
}

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig)
