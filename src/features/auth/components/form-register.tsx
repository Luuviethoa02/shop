import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { formSchemaRegister } from "../validators"
import { z } from "zod"
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
import { Link, useNavigate } from "react-router-dom"
import { useRegister } from "@/lib/auth"
import { SpokeSpinner } from "@/components/ui/spinner"

const ForRegister = () => {
  const register = useRegister()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchemaRegister>>({
    resolver: zodResolver(formSchemaRegister),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchemaRegister>) {
    register.mutate(values, {
      onSuccess(data, variables, context) {
        navigate("/auth/login", { replace: true })
      },
      onError(error, variables, context) {
        console.log(error)

        // console.log('Error', error)
      },
    })
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên hiển thị</FormLabel>
                <FormControl>
                  <Input placeholder="Tên đăng nhập" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
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
                  <Input placeholder="Mật khẩu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={register.isPending} className="gap-2" type="submit">
            {register.isPending && <SpokeSpinner size="lg" />}
            Đăng ký
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm max-sm:text-lg">
        Bạn đã có tài khoản?{" "}
        <Link to="/auth/login" className="underline max-sm:text-lg">
          Đăng nhập
        </Link>
      </div>
    </>
  )
}

export default ForRegister
