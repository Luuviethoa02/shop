import { AuthLayout } from "@/components/layouts"
import FormRegister from "@/features/auth/components/form-register"

export const RegisterRoute = () => {
  return (
    <AuthLayout title="Đăng ký">
      <FormRegister />
    </AuthLayout>
  )
}
