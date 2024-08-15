import { AuthLayout } from "@/components/layouts"
import SEO from "@/components/seo"
import FormLogin from "@/features/auth/components/form-login"

export const LoginRoute = () => {
  return (
    <AuthLayout title="Đăng nhập">
      <SEO title="Đăng nhập | Shop" description="Đăng nhập vào hệ thống" />
      <FormLogin />
    </AuthLayout>
  )
}
