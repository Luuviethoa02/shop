import { z } from "zod"

export const formSchemaLogin = z.object({
  email: z
    .string()
    .min(6, {
      message: "Email phải chứa ít nhất 6 ký tự.",
    })
    .email("Email không hợp lệ."),
  password: z.string().min(2, {
    message: "Mật khẩu phải chứa ít nhất 2 ký tự.",
  }),
})

export const formSchemaRegister = z.object({
  username: z.string().min(2, {
    message: "Tên phải chứa ít nhất 2 ký tự.",
  }),
  email: z
    .string()
    .min(2, {
      message: "Email phải chứa ít nhất 2 ký tự.",
    })
    .email("Email không hợp lệ."),
  password: z.string().min(6, {
    message: "Mật khẩu phải chứa ít nhất 6 ký tự.",
  }),
})
