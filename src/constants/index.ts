import {
  Activity,
  ChartNoAxesCombined,
  CircleUser,
  Globe,
  HomeIcon,
  LucideIcon,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react"

export const navLinkAdmin: { path: string; Icon: LucideIcon; lable: string }[] =
  [
    {
      path: "/admin/dashboard",
      Icon: HomeIcon,
      lable: "Bảng điều khiển",
    },
    {
      path: "/admin/products",
      Icon: Globe,
      lable: "Sản phẩm",
    },
    {
      path: "/admin/oders",
      Icon: ShoppingBag,
      lable: "Đơn hàng",
    },
    {
      path: "/admin/customers",
      Icon: CircleUser,
      lable: "Khách hàng",
    },
    {
      path: "/admin/analytics",
      Icon: ChartNoAxesCombined,
      lable: "Thống kê",
    },
    {
      path: "/admin/settings",
      Icon: SlidersHorizontal,
      lable: "Cài đặt",
    },
  ]

export const navLinkSeller: {
  path: string
  Icon: LucideIcon
  lable: string
}[] = [
  {
    path: "/seller/dashboard",
    Icon: HomeIcon,
    lable: "Bảng điều khiển",
  },
  {
    path: "/seller/products",
    Icon: Globe,
    lable: "Sản phẩm",
  },
  {
    path: "/seller/stocks",
    Icon: Activity,
    lable: "Kho hàng",
  },
  {
    path: "/seller/oders",
    Icon: ShoppingBag,
    lable: "Đơn hàng",
  },
  {
    path: "/seller/customers",
    Icon: CircleUser,
    lable: "Khách hàng",
  },
  {
    path: "/seller/analytics",
    Icon: ChartNoAxesCombined,
    lable: "Thống kê",
  },
  {
    path: "/seller/profile",
    Icon: SlidersHorizontal,
    lable: "Tài khoản",
  },
]
