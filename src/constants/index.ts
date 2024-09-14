import {
  Activity,
  BadgePercent,
  ChartNoAxesCombined,
  CircleUser,
  Globe,
  HomeIcon,
  LucideIcon,
  ShoppingBag,
  SlidersHorizontal,
  User,
} from "lucide-react"

export const navLinkAdmin: { path: string; Icon: LucideIcon; lable: string }[] =
  [
    {
      path: "/admin/dashboard",
      Icon: HomeIcon,
      lable: "Bảng điều khiển",
    },
    {
      path: "/admin/sellers",
      Icon: CircleUser,
      lable: "Kênh bán hàng",
    },
    {
      path: "/admin/customers",
      Icon: User,
      lable: "Khách hàng",
    },
    {
      path: "/admin/analytics",
      Icon: ChartNoAxesCombined,
      lable: "Thống kê",
    },
    {
      path: "/admin/categories",
      Icon: Globe,
      lable: "Danh mục sản phẩm",
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
    path: "/seller/sales",
    Icon: BadgePercent,
    lable: "Mã giảm giá",
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
