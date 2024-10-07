import SEO from "@/components/seo"
import { motion } from "framer-motion"
import { useEffect } from "react"

export const ServiceRoute = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO title="Dịch vụ" description="This is the service page of the shop" />

      {/* Page entrance animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-blue-50 py-12"
      >
        <div className="container mx-auto px-4">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-center text-primary mb-12"
          >
            Dịch Vụ Của Chúng Tôi
          </motion.h1>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-lg text-gray-700 mb-12"
          >
            <p className="mb-6">
              Tại <span className="font-semibold">Shop VH</span>, chúng tôi
              không chỉ cung cấp sản phẩm chất lượng mà còn đem đến những dịch
              vụ tốt nhất. Với cam kết luôn làm hài lòng khách hàng, chúng tôi
              tự hào về đội ngũ tận tâm, chuyên nghiệp.
            </p>
            <p className="mb-6">
              Hãy cùng khám phá các dịch vụ của chúng tôi từ tư vấn thời trang
              cá nhân, giao hàng nhanh chóng, đến trải nghiệm mua sắm trực tuyến
              thân thiện và dễ dàng.
            </p>
          </motion.div>

          {/* Services */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 },
            }}
            transition={{ duration: 0.8 }}
          >
            {/* Service 1 */}
            <motion.div
              className="p-6 bg-white rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="https://media.istockphoto.com/id/1711123572/vi/anh/doanh-nghi%E1%BB%87p-v%E1%BB%ABa-v%C3%A0-nh%E1%BB%8F-kh%E1%BB%9Fi-nghi%E1%BB%87p-c%E1%BB%A7a-ng%C6%B0%E1%BB%9Di-ph%E1%BB%A5-n%E1%BB%AF-ch%C3%A2u-%C3%A1-t%E1%BB%B1-do-s%E1%BB%AD-d%E1%BB%A5ng-%C4%91i%E1%BB%87n-tho%E1%BA%A1i-th%C3%B4ng-minh.jpg?s=2048x2048&w=is&k=20&c=zfENzFPGwmDcUtBVx3LL_MaeulyFDKnnBkz-OfdNgjE="
                alt="service1"
                className="rounded-lg mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold mb-4 text-orange-400">
                Tư vấn thời trang cá nhân
              </h3>
              <p className="text-gray-600">
                Chúng tôi cung cấp dịch vụ tư vấn thời trang theo phong cách và
                nhu cầu cá nhân của bạn, đảm bảo bạn luôn tỏa sáng.
              </p>
            </motion.div>

            {/* Service 2 */}
            <motion.div
              className="p-6 bg-white rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="https://media.istockphoto.com/id/1365749410/vi/anh/ng%C6%B0%E1%BB%9Di-ph%E1%BB%A5-n%E1%BB%AF-tr%E1%BA%BB-ch%C3%A2u-%C3%A1-t%C6%B0%C6%A1i-c%C6%B0%E1%BB%9Di-xinh-%C4%91%E1%BA%B9p-v%E1%BB%9Bi-%C4%91i%E1%BB%87n-tho%E1%BA%A1i-th%C3%B4ng-minh-nh%E1%BA%ADn-b%C6%B0u-ki%E1%BB%87n-v%E1%BB%9Bi-d%E1%BB%8Bch-v%E1%BB%A5.jpg?s=2048x2048&w=is&k=20&c=YMi05lC9S8C410u-oVtqgWBXrufHDXIpkJtRUkxovA8="
                alt="service2"
                className="rounded-lg mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold mb-4 text-orange-400">
                Giao hàng nhanh chóng
              </h3>
              <p className="text-gray-600">
                Chúng tôi cam kết giao hàng nhanh nhất có thể với các phương
                thức vận chuyển hiện đại, đảm bảo an toàn và nhanh chóng.
              </p>
            </motion.div>

            {/* Service 3 */}
            <motion.div
              className="p-6 bg-white rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="https://plus.unsplash.com/premium_photo-1666299884107-2c2cf920ee59?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="service3"
                className="rounded-lg mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold mb-4 text-orange-400">
                Hỗ trợ 24/7
              </h3>
              <p className="text-gray-600">
                Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giải đáp
                mọi thắc mắc của bạn bất cứ lúc nào.
              </p>
            </motion.div>
          </motion.div>

          {/* Large image section */}
          <motion.div
            className="my-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 },
            }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1784&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="service large"
              className="w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>

          {/* More detailed services */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-12 text-center"
          >
            <h2 className="text-3xl font-semibold text-orange-400 mb-6">
              Trải Nghiệm Khách Hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">
                  Mua sắm trực tuyến
                </h3>
                <p>
                  Chúng tôi tối ưu hóa trải nghiệm mua sắm trực tuyến với giao
                  diện thân thiện, dễ sử dụng và nhiều tính năng tiện lợi.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">
                  Chính sách hoàn trả
                </h3>
                <p>
                  Bạn hoàn toàn yên tâm với chính sách hoàn trả dễ dàng nếu sản
                  phẩm không như mong đợi.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">
                  Hỗ trợ khách hàng
                </h3>
                <p>
                  Chúng tôi luôn ở đây để hỗ trợ bạn bất cứ lúc nào, với đội ngũ
                  chuyên nghiệp và tận tâm.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#ffcc00" }}
              transition={{ duration: 0.3 }}
              className="px-6 py-3 bg-primary text-white rounded"
            >
              Khám phá thêm
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

export default ServiceRoute
