import SEO from "@/components/seo"
import { motion } from "framer-motion"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { useEffect } from "react"

export const UsRoute = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <LayoutWapper>
      <SEO title="Về chúng tôi" description="this is the us page of the shop" />
      <div className="min-h-screen py-2">
        <div className="container mx-auto px-4">
          {/* Tiêu đề */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-center text-pink-500 mb-12"
          >
            Về Shop vh
          </motion.h1>

          {/* Phần nội dung */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-lg text-gray-700 mb-8"
          >
            <p className="mb-6">
              Chào mừng bạn đến với{" "}
              <span className="font-semibold">Shop VH</span>! Chúng tôi chuyên
              cung cấp các sản phẩm thời trang đáng yêu, phù hợp với mọi phong
              cách của bạn. Với tiêu chí mang đến sự hài hòa và niềm vui trong
              từng sản phẩm, chúng tôi tự hào là lựa chọn số 1 của các tín đồ
              thời trang.
            </p>
            <p className="mb-6">
              Đội ngũ của chúng tôi luôn cố gắng tạo ra trải nghiệm mua sắm
              tuyệt vời nhất với các sản phẩm chất lượng cao và dịch vụ khách
              hàng tận tâm. Hãy khám phá và cùng chúng tôi trở thành phiên bản
              tuyệt vời nhất của bạn!
            </p>
          </motion.div>

          {/* Hình ảnh minh họa */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 },
            }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              src="https://images.unsplash.com/photo-1688561808434-886a6dd97b8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="shop1"
              className="rounded-lg shadow-lg"
            />
            <motion.img
              whileHover={{ scale: 1.1 }}
              src="https://plus.unsplash.com/premium_photo-1661596880120-68dcf206ec51?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="shop2"
              className="rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Phần dịch vụ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-12 text-center"
          >
            <h2 className="text-3xl font-semibold text-pink-500 mb-6">
              Dịch vụ của chúng tôi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">
                  Giao hàng nhanh chóng
                </h3>
                <p>
                  Chúng tôi cam kết giao hàng đúng hẹn với các phương thức vận
                  chuyển an toàn, nhanh chóng.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">
                  Sản phẩm chất lượng
                </h3>
                <p>
                  Tất cả sản phẩm đều được kiểm định nghiêm ngặt trước khi đưa
                  đến tay khách hàng.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Hỗ trợ tận tình</h3>
                <p>
                  Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ mọi lúc bạn
                  cần.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hiệu ứng cuộn */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-600">
              Cảm ơn bạn đã đồng hành cùng{" "}
              <span className="font-semibold">Shop VH</span>. Chúng tôi luôn nỗ
              lực mang đến sản phẩm và dịch vụ tốt nhất!
            </p>
          </motion.div>
        </div>
      </div>
    </LayoutWapper>
  )
}
