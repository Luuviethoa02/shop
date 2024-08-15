import { AuthLayout } from "@/components/layouts"
import SEO from "@/components/seo"
import FormRegister from "@/features/auth/components/form-register"

export const RegisterRoute = () => {
  return (
    <AuthLayout title="Đăng ký">
      <SEO
        title="Đăng ký | Shop"
        description="Đăng ký tài khoản vào hệ thống"
      />
      <FormRegister />
    </AuthLayout>
  )
}
