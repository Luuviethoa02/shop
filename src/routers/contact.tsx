import SEO from "@/components/seo"
import { convertToVietnamesePhone } from "@/lib/utils"
import { motion } from "framer-motion"
import { useEffect } from "react"

export const ContactRoute = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <SEO
                title="Liên hệ"
                description="this is the contact page of the shop"
            />
            <div className="min-h-screen bg-pink-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Tiêu đề */}
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-bold text-center text-pink-600 mb-12"
                    >
                        Liên Hệ Với Chúng Tôi
                    </motion.h1>

                    {/* Đoạn giới thiệu */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="text-lg text-gray-700 text-center mb-12"
                    >
                        Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi. Đội ngũ của <span className="font-semibold">Shop VH</span> luôn sẵn sàng hỗ trợ bạn!
                    </motion.p>

                    {/* Phần hình ảnh */}
                    <motion.div
                        className="flex justify-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: { opacity: 1, y: 0 },
                            hidden: { opacity: 0, y: 50 }
                        }}
                        transition={{ duration: 1 }}
                    >
                        <motion.img
                            src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Contact Us"
                            className="rounded-lg shadow-lg max-w-[800px] max-h-[400px]"
                            whileHover={{ scale: 1.05 }}
                        />
                    </motion.div>

                    {/* Form liên hệ */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto"
                    >
                        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-8">
                            Gửi tin nhắn cho chúng tôi
                        </h2>
                        <form>
                            {/* Tên */}
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Nhập họ và tên"
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                    Địa chỉ Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div className="mb-6">
                                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            {/* Tin nhắn */}
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                                    Tin nhắn
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Nhập tin nhắn của bạn"
                                />
                            </div>

                            {/* Nút gửi */}
                            <div className="text-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    Gửi tin nhắn
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Thông tin liên hệ */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="mt-16 text-center"
                    >
                        <h3 className="text-2xl font-semibold text-pink-600 mb-4">Thông tin liên hệ</h3>
                        <p className="text-lg text-gray-700 mb-2 capitalize">
                            Địa chỉ: 256 Đường quang trung, Quận gò, Thành phố Hồ Chí Minh
                        </p>
                        <p className="text-lg text-gray-700 mb-2">Số điện thoại: {convertToVietnamesePhone("0977545454")}</p>
                        <p className="text-lg text-gray-700">Email: lienhe@shopvh.com</p>
                    </motion.div>
                </div>
            </div>
        </>
    )
}
