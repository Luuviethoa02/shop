import { Button } from "@/components/ui/button"
import { ClockIcon } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const WaitingRoute = () => {
  return (
    <div className="w-full h-screen py-28 space-y-4 md:py-16 lg:space-y-16 px-28">
      <div className="container space-y-4 px-4 md:px-6">
        <div className="flex items-center justify-center">
          <ClockIcon className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl sm:leading-[3.5rem]">
            Tài khoản đang chờ phê duyệt
          </h1>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Tài khoản của bạn đang chờ phê duyệt. Vui lòng đợi hướng dẫn tiếp
            theo từ quản trị viên.
          </p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Tại sao tài khoản của tôi đang trong trạng thái chờ xét duyệt?
              </AccordionTrigger>
              <AccordionContent>
                Để đảm bảo an toàn và bảo mật cho cộng đồng người dùng, tài
                khoản của bạn cần được quản trị viên xem xét và phê duyệt. Quá
                trình này giúp chúng tôi kiểm tra tính xác thực của thông tin
                đăng ký và tuân thủ các quy định của trang web.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Tôi phải chờ bao lâu để tài khoản của mình được xét duyệt?
              </AccordionTrigger>
              <AccordionContent>
                Thông thường, quá trình xét duyệt tài khoản có thể mất từ 1-3
                ngày làm việc. Bạn sẽ nhận được thông báo qua email khi tài
                khoản của bạn được phê duyệt.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Tôi có thể làm gì trong khi tài khoản của tôi đang chờ xét
                duyệt?
              </AccordionTrigger>
              <AccordionContent>
                Trong khi chờ xét duyệt, bạn vẫn có thể truy cập trang web để
                duyệt sản phẩm, thêm vào giỏ hàng, và xem thông tin chi tiết.
                Tuy nhiên, bạn sẽ không thể thực hiện các giao dịch mua bán hoặc
                đăng bán sản phẩm cho đến khi tài khoản được phê duyệt.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="mx-auto max-w-sm space-y-2">
        <Link to="/" className="w-full">
          <Button className="w-full">Trở về trang chủ</Button>
        </Link>
      </div>
    </div>
  )
}
