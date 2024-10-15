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

const chartData = [
  { month: "January", desktop: 1806 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
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
      revenueProducts,
    } = data?.data?.data

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
              <CardTitle>Khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">50</div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full flex items-center mb-96">
          <Card className="h-[600px] min-w-full">
            <CardHeader>
              <CardTitle>Thống kê doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="max-h-[500px] min-w-full"
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
                    dataKey="desktop"
                    fill="var(--color-desktop)"
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
