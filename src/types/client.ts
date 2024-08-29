import { ColorIpi, producstResponse } from "./api"

export type User = {
  _id: string
  username: string
  email: string
  img: string
  admin: boolean
}

export type Category = {
  _id: string
  name: string
  img_cover: string
  slug: string
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
}

export type Size = {
  name: string
  weight: string
}

export type CartItem = {
  product: {
    name: string
    price: string
    brand: string
  }
  color: ColorIpi
  size: Size
  quantity: number
}
