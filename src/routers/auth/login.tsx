import { AuthLayout } from '@/components/layouts'
import FormLogin from '@/features/auth/components/form-login'

export const LoginRoute = () => {
  return (
    <AuthLayout title="Đăng nhập">
      <FormLogin />
    </AuthLayout>
  )
}
