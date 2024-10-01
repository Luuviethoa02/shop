import { Button } from "@/components/ui/button"
import { useCheckStatusOderWithMomo } from "@/features/oder/api/check-status-oder"
import { CheckCircle } from "lucide-react"
import { useEffect } from "react"
import { Link, useLocation, useParams } from "react-router-dom"

export const OderSuccessfullyRoute = () => {
    const location = useLocation();

    // Parse the query string
    const queryParams = new URLSearchParams(location.search);
    const updateStatusPay = useCheckStatusOderWithMomo()

    // Get the orderId
    const orderId = queryParams.get('orderId');

    useEffect(() => {
        if (orderId) {
            updateStatusPay.mutate({ data: { orderId: orderId } },{
                onSuccess: (data) => {
                    console.log(data)
                }
            })
        }
    }, [orderId])



    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
            <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h1 className="mb-4 text-3xl font-bold text-gray-900">Đặt hàng thành công!</h1>
                <p className="mb-8 text-lg text-gray-600">
                    Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xử lý thành công.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <Link to={`/profile/purchase`} className="w-full">
                        <Button variant="outline" className="w-full">Xem đơn hàng</Button>
                    </Link>
                    <Link to={`/`} className="w-full">
                        <Button variant="outline" className="w-full">Trở về trang chủ</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
