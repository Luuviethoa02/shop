import { Category, User } from "./client"

export type ResponseSuccess<T> = {
  message: string
  statusCode: number
  data: T
}

export type ResponseError = {
  message: string
  code: number
}

export type AuthResponse = ResponseSuccess<{
  jwt: {
    accessToken: string
    refreshToken: string
  }
  user: (User & { createdAt: string; updatedAt: string }) | null
}>

export type UserResponse = ResponseSuccess<User>

export type CategoryResponse = ResponseSuccess<Category[]>
