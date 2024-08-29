import { Category, Product, User } from "./client"

export type ResponseSuccess<T> = {
  message: string
  statusCode: number
  data: T
}

export type ResponseData<T> = {
  page: number
  limit: number
  total: number
  data: T[]
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

export type ColorIpi = {
  _id: string
  name: string
  image: string
}

export type productRespose = Omit<Product, "brand_id" | "colors"> & {
  colors: ColorIpi[]
  brand_id: { _id: string; img_cover: string; name: string; slug: string }
  createdAt: string
}

export type producstResponse = ResponseData<productRespose>

export type productDetailResponse = ResponseSuccess<{
  productDetail: productRespose
  productSimilars: productRespose[]
}>
