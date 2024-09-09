import {
  BadgePercent,
  CircleDollarSign,
  Gem,
  Gift,
  Grid2X2,
  LucideProps,
  NotepadText,
  Settings,
} from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import { motion } from "framer-motion"

const categoryList: {
  lable: string
  bg: string
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
}[] = [
  {
    lable: "sản phẩm",
    bg: "#1e3a8a",
    Icon: Gift,
  },
  {
    lable: "danh mục của shop",
    bg: "#15803d",
    Icon: Grid2X2,
  },
  {
    lable: "đơn bán",
    bg: "#db2777",
    Icon: NotepadText,
  },
  {
    lable: "kênh marketing",
    bg: "#2dd4bf",
    Icon: BadgePercent,
  },
  {
    lable: "doanh thu",
    bg: "#facc15",
    Icon: CircleDollarSign,
  },
  {
    lable: "ví shopvh",
    bg: "#10b981",
    Icon: Gem,
  },
  {
    lable: "thiết lập shop",
    bg: "#64748b",
    Icon: Settings,
  },
]

const CardCicleComponent = ({
  Icon,
  bg,
  lable,
}: {
  lable: string
  bg: string
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
}) => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div
        style={{ backgroundColor: bg }}
        className="size-24 rounded-full flex items-center justify-center"
      >
        {<Icon className="text-white size-8" />}
      </div>
      <p className="leading-7 capitalize [&:not(:first-child)]:mt-6">{lable}</p>
    </div>
  )
}

const RegisterComplete = () => {
  const slideInVariant = {
    hidden: { x: "-100vw", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  }

  return (
    <motion.div
      className="w-full flex flex-col items-center max-w-3xl"
      initial="hidden"
      animate="visible"
      variants={slideInVariant}
    >
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Chào mừng bạn đến với kênh người bán
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        ShopVh - Kênh người bán là công cụ quản lý shop, giúp bạn dễ phân loại
        sản phẩm, theo dõi đơn hàng, chăm sóc khách hàng và đánh giá hoạt động
        của shop.Là chủ shop, bạn vui lòng đọc kỹ và tuân thủ
        <a
          href="#"
          className="text-primary ml-1 font-semibold blue-600 underline"
        >
          Quy chế hoạt động
        </a>
      </p>
      <div className="flex items-center justify-center flex-wrap gap-10 mt-10">
        {categoryList.map((item, index) => (
          <CardCicleComponent key={index} {...item} />
        ))}
      </div>
    </motion.div>
  )
}

export default RegisterComplete
