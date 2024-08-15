import {
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
