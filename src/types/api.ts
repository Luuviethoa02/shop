import {
  Category,
  Comments,
  Notification,
  Product,
  Seller,
  User,
} from "./client"

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

export type RegisterResponse = ResponseSuccess<{
  username: string
  email: string
  password: string
  img: string
  admin: boolean
  loginGoogle: boolean
  sellerId: string | null
  _id: string
  createdAt: string
  updatedAt: string
}>

export type UserResponse = ResponseSuccess<User>

export type CategoryResponse = ResponseSuccess<Category[]>

export type ColorIpi = {
  _id: string
  name: string
  image: string
  quantity: string
}

export type productRespose = Omit<Product, "brand_id" | "colors"> & {
  colors: ColorIpi[]
  brand_id: { _id: string; img_cover: string; name: string; slug: string }
  createdAt: string,
  updatedAt: string
}

export type producstResponse = ResponseData<productRespose>

export type productDetailResponse = ResponseSuccess<{
  productDetail: productRespose
}>

export type sellerResponse = ResponseSuccess<{
  seller: Seller
  user: User
}>

export type addressResponse = ResponseSuccess<
  {
    _id: string
    name: string
    phone: string
    city: string
    district: string
    ward: string
    address: string
    user_id: string
  }[]
>

export type commentsResponse = ResponseData<Comments>

export type notifiedUserResponse = ResponseData<Notification>

export type ProvincesCommonType = {
  id: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  latitude: string
  longitude: string
}

export type ApiResponseProvincesType = {
  error: number
  error_text: string
  data_name: string
  data: ProvincesCommonType[]
}
