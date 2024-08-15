import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { formSchemaLogin } from "../validators"
import { Link, useNavigate } from "react-router-dom"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/lib/auth"
import { SpokeSpinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/store"
import { User } from "@/types/client"

const FormLogin = () => {
  const login = useLogin()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const form = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchemaLogin>) {
    login.mutate(values, {
      onSuccess(data) {
        setUser(data as User)
        if (data?.admin) {
          navigate("/admin", { replace: true })
        } else {
          navigate("/", { replace: true })
        }
      },
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={login.isPending} className="gap-2" type="submit">
            {login.isPending && <SpokeSpinner size="lg" />}
            Đăng nhập
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Bạn chưa có tài khoản?{" "}
        <Link to="/auth/register" className="underline">
          Đăng ký
        </Link>
      </div>
    </>
  )
}

export default FormLogin
