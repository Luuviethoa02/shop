import { AlertTriangle, CheckCircle, LucideProps, XCircle } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export const ObjectStatusDiscount: {
  [key in "active" | "inactive" | "expired"]: {
    variant: string
    text: string
    cn: string | undefined
    Icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >
  }
} = {
  active: {
    variant: "default",
    text: "Đang áp dụng",
    cn: "bg-primary hover:bg-green-600 text-white",
    Icon: CheckCircle,
  },
  inactive: {
    variant: "outline",
    text: "Chưa áp dụng",
    cn: "border-yellow-500 text-yellow-500",
    Icon: AlertTriangle,
  },
  expired: {
    variant: "destructive",
    text: "Đã hết hạn",
    cn: undefined,
    Icon: XCircle,
  },
}

export const TIME_LOADING = 2500
