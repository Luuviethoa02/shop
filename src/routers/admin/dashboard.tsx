import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

export const DashboardRoute = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tổng doanh thu</CardTitle>
          <CardDescription>
            Doanh thu toàn thời gian trên cửa hàng của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">$125,456</div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpIcon className="h-4 w-4 fill-green-500" />
            <span>+12% so với tháng trước</span>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Đơn hàng mới</CardTitle>
          <CardDescription>
            Đơn hàng nhận được trong 30 ngày qua.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">124</div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpIcon className="h-4 w-4 fill-green-500" />
            <span>+8% so với tháng trước</span>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Mức tồn kho</CardTitle>
          <CardDescription>Số lượng sản phẩm còn trong kho.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">1,230</div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowDownIcon className="h-4 w-4 fill-red-500" />
            <span>-5% so với tháng trước</span>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Khách hàng</CardTitle>
          <CardDescription>
            Số lượng khách hàng mới trong 30 ngày qua.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">50</div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpIcon className="h-4 w-4 fill-green-500" />
            <span>+15% so với tháng trước</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
