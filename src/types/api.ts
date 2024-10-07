import {
  address,
  Category,
  Comments,
  Discount,
  Notification,
  oderDetail,
  OdersProduct,
  OrderNotification,
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
  total: number
  sellerId: {
    _id: string
    city: string
  }
  average_rating: number
  discount?: number

  createdAt: string
  updatedAt: string
}

export type producstResponse = ResponseData<productRespose>
export type historyResponse = ResponseData<{
  keyWorks: string
  create_by: string
  validateTime: string
}>

export type discountResponse = ResponseData<Discount>

export type productDetailResponse = ResponseSuccess<{
  productDetail: productRespose
  productSimilars: productRespose
  sellerInfo: Seller & {
    totalProducts: number
    totalComments: number
    averageRating: number
  }
}>

export type sellerResponse = ResponseSuccess<{
  seller: Seller
  user: User
}>

export type addressResponse = ResponseSuccess<address[]>
export type updateUserResponse = ResponseSuccess<User>

export type commentsResponse = ResponseData<Comments>

export type notifiedUserResponse = ResponseData<Notification>
export type orderNotifiCationResponse = ResponseData<OrderNotification>

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

export type oderResponse = ResponseData<{
  _id: string
  user_id: {
    _id: string
    username: string
    img: string
  }
  address_id: Omit<address, "user_id" | "_id" | "default">
  type_pay: "cash" | "momo"
  status_pay: {
    status: "wait" | "success" | "failure"
    messages?: string
    oderId?: string
    payUrl?: string
  }
  totalPrice: number
  createdAt: string
}>

export type oderDetailResponse = ResponseSuccess<oderDetail[]>
export type oderDetailSellerResponse = ResponseData<oderDetail>
