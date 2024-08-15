import SEO from "@/components/seo"
import { Link } from "react-router-dom"

export const NotFoundRoute = () => {
  return (
    <main>
      <SEO title="404 Not Found" description="404 Not Found in Shop" />
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-indigo-600 font-semibold">404 Lỗi !!!!</h3>
          <p className="text-gray-800 text-4xl font-semibold sm:text-5xl">
            Không tìm thấy trang
          </p>
          <p className="text-gray-600">
            Xin lỗi, trang bạn đang tìm kiếm không thể tìm thấy hoặc đã bị xóa.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Trở lại trang chủ
            </Link>
            <a
              href="javascript:void(0)"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 font-medium duration-150 active:bg-gray-100 border rounded-lg"
            >
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
