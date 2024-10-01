import { ColorIpi } from "./api"

export type User = {
  _id?: string
  username: string
  email: string
  img: string
  admin: boolean
  loginGoogle: boolean
  sellerId: null | Seller | string
  createdAt?: string
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

export type OdersProduct = {
  oder: {
    user_id: string;
    address_id: Omit<address, 'user_id' | '_id' | 'default'>;
    type_pay: 'cash' | 'momo';
    totalPrice: number
  }
  oderDetails: {
    product: string
    sellerId: string;
    price: number;
    vouchers: {
      discount_code: string
      discount_percentage: number
      discount_amount: number
      description: string
    }[];
    quantity: number;
    color: Omit<ColorIpi, 'quantity'>;
    size?: Size;
    type_tranfer: {
      name: 'save' | 'fast'
      fee: number
    }
  }
}


export type CartItem = {
  product: {
    name: string
    price: string
    brand: string
  }
  selelrId: {
    logo: string
    businessName: string
    _id: string
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

export type OrderNotification = {
  _id: string;
  userId: {
    _id: string;
    username: string;
    img: string;
  };
  sellerId: string;
  orderDetailId: {
    color: {
      _id: string,
      name: string,
      image: string
    },
    _id: string
    quantity: number;
  };
  isRead: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  relativeTime: string;
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

export type address = {
  _id: string
  name: string
  phone: string
  city: string
  district: string
  ward: string
  address: string
  user_id: string
  default: boolean
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
    vouchers:
    | {
      discount_code: string
      discount_percentage: number
      discount_amount: number
      description: string
    }[]
    | []
    type_tranfer: "fast" | "save"
    totalPrice: number
  }
}

export type oderDetail = OdersProduct['oderDetails'] & {
  sellerId: {
    businessName: string;
    logo: string
  }
  status_oder: {
    pending: {
      status: boolean
      created_at: string
    }
    shipping: {
      status: boolean
      created_at?: string
    }
    success: {
      status: boolean
      created_at?: string
    }
    canceled: {
      message?: string,
      status: boolean
      created_at?: string
      created_by?: {
        infoId:string | null,
        shopper:'seller' | 'user' | null
      }
    }
  }
  _id: string,
  oder_id: OdersProduct['oder'] & {
    user_id: {
      username: string
      img: string
      email: string
    }
    address_id: {
      name: string
      phone: string
      city: string
      district: string
      ward: string
      address: string
    },
    status_pay: {
      status: 'wait' | 'success' | 'failure'
      messages?: string
      oderId?: string
      payUrl?: string
    }
    type_pay: 'cash' | 'momo'
  }

}

export type orderNotification = {
  orderDetail: string;
  product: Product;
  user: User
}

export type Filters = {
  text: string;
  page: number;
  limit: number;
  categoris: string[];
  minPrice?: number;
  maxPrice?: number;
  color?: string[];
  province?: string[];
  rating?: number;
  is_discount: boolean;
}