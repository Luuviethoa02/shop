import { z } from "zod"

export const formSchemaLogin = z.object({
  email: z
    .string({
      required_error: "Email không được để trống",
    })
    .email("Email không hợp lệ."),
  password: z
    .string({
      required_error: "Mật khẩu không được để trống",
    })
    .min(6, {
      message: "Mật khẩu phải chứa ít nhất 6 ký tự.",
    }),
})

export const formSchemaforgotPassword = z.object({
  email: z
    .string({
      required_error: "Email không được để trống",
    })
    .email("Email không hợp lệ"),
})

export const formSchemaRegister = z.object({
  username: z
    .string({
      required_error: "Tên không được để trống",
    })
    .min(5, {
      message: "Tên phải chứa ít nhất 5 ký tự.",
    }),
  email: z
    .string({
      required_error: "Email không được để trống",
    })
    .email("Email không hợp lệ."),
  password: z
    .string({
      required_error: "Mật khẩu không được để trống",
    })
    .min(6, {
      message: "Mật khẩu phải chứa ít nhất 6 ký tự.",
    }),
})
