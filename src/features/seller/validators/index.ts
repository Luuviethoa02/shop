import { z } from "zod"

export const phoneRegex = new RegExp(
  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
)

export const schemaSeller = z.object({
  userId: z.string().optional(),
  businessName: z
    .string({
      required_error: "Tên Shop là bắt buộc nhập",
    })
    .min(5, "Tên Shop phải ít nhất 5 ký tự"),
  email: z
    .string({
      required_error: "Email là bắt buộc nhập",
    })
    .email("Email không hợp lệ")
    .min(1, "Email là bắt buộc nhập"),
  phone: z
    .string({
      required_error: "Số điện thoại là bắt buộc nhập",
    })
    .regex(phoneRegex, "Số điện thoại không hợp lệ."),
  businessType: z.enum(["personal", "company", "business"], {
    required_error: "Loại hình kinh doanh là bắt buộc chọn",
  }),
  username: z
    .string({
      required_error: "Họ & Tên là bắt buộc nhập",
    })
    .min(5, "Họ & Tên phải ít nhất 5 ký tự"),
  city: z.string({
    required_error: "Thành phố là bắt buộc chọn",
  }),
  district: z.string({
    required_error: "Quận/Huyện là bắt buộc chọn",
  }),
  ward: z.string({
    required_error: "Phường/Xã là bắt buộc chọn",
  }),
  addressDetail: z
    .string({
      required_error: "Địa chỉ chi tiết là bắt buộc nhập",
    })
    .min(10, "Địa chỉ chi tiết phải ít nhất 10 ký tự"),
  express: z.boolean(),
  fast: z.boolean(),
  economical: z.boolean(),
  bulkyGoods: z.boolean(),
})
