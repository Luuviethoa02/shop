import { AuthLayout } from "@/components/layouts"
import SEO from "@/components/seo"
import FormForgotPassword from "@/features/auth/components/form-forgot-password"

export const ForgotPasswordRoute = () => {
  return (
    <>
      <AuthLayout title="Quên mật khẩu">
        <SEO
          title="Quên mật khẩu | Shopvh"
          description="Lấy lại mật khẩu vào hệ thống"
        />
        <FormForgotPassword />
      </AuthLayout>
    </>
  )
}
