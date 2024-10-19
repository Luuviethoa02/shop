import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useAuthStore } from "@/store"
import { Seller } from "@/types/client"
import { useGetAnalysticsBySellerId } from "@/features/seller/api/get-analystics"
import { Skeleton } from "@/components/ui/skeleton"
export const description = "A bar chart"

const chartConfig = {
  pending: {
    label: "Chờ xác nhận",
    color: "hsl(var(--chart-3))",
  },
  shipping: {
    label: "Vận chuyển",
    color: "hsl(var(--chart-2))",
  },
  success: {
    label: "Thành công",
    color: "hsl(var(--chart-1))",
  },
  canceled: {
    label: "Đã hủy",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export const DashboardRoute = () => {
  const user = useAuthStore((state) => state.user)
  const data = useGetAnalysticsBySellerId({
    sellerId: (user?.sellerId as Seller)._id!,
  })

  if (data.isLoading) {
    return (
      <>
        <div className="flex items-center gap-5">
          <Skeleton className="w-1/4 h-36 rounded-lg" />
          <Skeleton className="w-1/4 h-36 rounded-lg" />
          <Skeleton className="w-1/4 h-36 rounded-lg" />
          <Skeleton className="w-1/4 h-36 rounded-lg" />
        </div>
        <div className="w-full mt-10">
          <Skeleton className="w-full h-[450px] rounded-lg" />
        </div>
      </>
    )
  }

  if (data?.data?.data) {
    const {
      totalOrders,
      totalProducts,
      totalComments,
      totalFollowers,
      statistics,
    } = data?.data?.data

    const chartData = Object.keys(statistics).map((month) => ({
      month,
      ...statistics[month],
    }))

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tổng Số lượt theo dõi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalFollowers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tổng số đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {totalOrders.totalOrdersPending +
                  totalOrders.totalOrdersShipping +
                  totalOrders.totalOrdersSuccess +
                  totalOrders.totalOrdersCanceled}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tổng số lượt đánh giá</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalComments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tổng sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full flex items-center mb-96">
          <Card className="h-[600px] min-w-full">
            <CardHeader>
              <CardTitle>Thống kê đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="max-h-[400px] min-w-full"
                config={chartConfig}
              >
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="pending"
                    fill="var(--color-pending)"
                    radius={8}
                  />
                  <Bar
                    dataKey="shipping"
                    fill="var(--color-shipping)"
                    radius={8}
                  />
                  <Bar
                    dataKey="success"
                    fill="var(--color-success)"
                    radius={8}
                  />
                  <Bar
                    dataKey="canceled"
                    fill="var(--color-canceled)"
                    radius={8}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}
