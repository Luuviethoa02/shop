import { ColorIpi } from "./api"

export type User = {
  _id?: string
  username: string
  email: string
  img: string
  admin: boolean
  loginGoogle: boolean
  sellerId: null | Seller | string
}

export type Category = {
  _id: string
  name: string
  img_cover: string
  slug: string
  createdAt: string
  updatedAt: string
}

export type Product = {
  _id: string
  name: string
  brand_id: string | Category
  price: string
  sizes: Size[]
  colors: Color[]
  des: string
  publish: boolean
  slug: string
}

export type Color = {
  name: string
  image: FileList
  quantity: string
}

export type Size = {
  name: string
  weight?: string
}

export type CartItem = {
  product: {
    name: string
    price: string
    brand: string
  }
  selelrId:{ 
    logo:string
    businessName:string
    _id:string
  }
  color: ColorIpi
  size: Size
  quantity: number
}

export type Discount = {
  _id: string
  discount_percentage: number
  discount_code: string
  start_date: string
  end_date: string
  description: string
  productIds: {
    _id: string
    name: string
    slug: string
  }[]
  is_active: "active" | "inactive" | "expired"
  createdAt: string
  updatedAt: string
}

export type Notification = {
  _id: string
  productId: {
    _id: string
    name: string
    slug: string
  }
  comment: string
  rating: number
  notifications: {
    notifiedUserId: {
      _id: string
      username: string
      img: string
    }
    isRead: boolean
    _id: string
    createdAt: string
  }[]
  createdAt: string
}

export type Comments = {
  _id: string
  userId: {
    _id: string
    username: string
    img: string
  }
  comment: string
  rating: number
  createdAt: string
  __v: number
  relativeTime: string
}

export type CommentsNotification = Comments & {
  productId: {
    name: string
    colors: ColorIpi[]
  }
}

export type Seller = {
  _id: string
  logo: string
  img_cover: string
  follower: number
  following: number
  slug: string
  status: "wait" | "finished" | "rejected"
  businessName: string
  email: string
  phone: string
  businessType: "personal" | "company" | "business"
  username: string
  city: string
  district: string
  ward: string
  addressDetail: string
  express: boolean
  fast: boolean
  economical: boolean
  bulkyGoods: boolean
  createdAt: string
  updatedAt: string
}

export type queryKeyProducts = {
  page: number
  limit: number
  sellerId: string
  status: string
}

export type stateOderItemType = {
  [key: string]: {
    vouchers: {
      discount_code: string;
      discount_percentage: number;
      discount_amount: number;
      description: string;
    }[] | undefined
    type_tranfer: "fast" | "save";
    totalPrice: number;
  }
}