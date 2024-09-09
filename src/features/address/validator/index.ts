import { z } from "zod"

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)
export const schemaAddress = z.object({
  name: z
    .string({
      required_error: "Họ và tên là bắt buộc",
    })
    .min(5, "Họ và tên phải có ít nhất 5 ký tự"),
  phone: z
    .string({
      required_error: "Số điện thoại là bắt buộc ",
    })
    .regex(phoneRegex, "Số điện thoại không hợp lệ"),
  city: z.string({
    required_error: "Thành phố là bắt buộc",
  }),
  district: z.string({
    required_error: "Quận/Huyện là bắt buộc",
  }),
  ward: z.string({
    required_error: "Phường/Xã là bắt buộc",
  }),
  address: z
    .string({
      required_error: "Địa chỉ cụ thể là bắt buộc",
    })
    .min(10, "Địa chỉ cụ thể phải có ít nhất 10 ký tự"),
})
