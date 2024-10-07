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
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { env } from "@/config/env"
import { nanoid } from "nanoid"
import { AuthResponse } from "@/types/api"
import toast from "react-hot-toast"

const GoogleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="24"
      height="24"
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  )
}

const FormLogin = () => {
  const login = useLogin()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const form = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
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

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        localStorage.setItem("accessToken", tokenResponse.access_token)
        const res = await axios.get(env.API_GOOGLE_USER_INFO, {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })
        const { email, name, picture } = res.data
        const data: User = {
          _id: nanoid(),
          admin: false,
          email,
          img: picture,
          loginGoogle: true,
          username: name,
          sellerId: null,
        }
        const response = await axios.post(
          env.API_URL + "/auth/login-google",
          data
        )

        const {
          data: dataNew,
          message,
          statusCode,
        } = response.data as AuthResponse
        if (statusCode === 401) {
          toast.error(message || "có lỗi xảy ra! vui lòng thử lại sau")
          return
        }
        if (dataNew.user && statusCode === 200) {
          setUser(dataNew.user)
          localStorage.setItem("accessToken", dataNew?.jwt?.accessToken)
          localStorage.setItem("refreshToken", dataNew?.jwt?.refreshToken)
          toast.success(message)
          navigate("/", { replace: true })
        }
      } catch (error) {
        toast.error(
          JSON.stringify(error) || "có lỗi xảy ra! vui lòng thử lại sau"
        )
      }
    },
    onError: (error) => {
      console.log("Error:", error)
    },
  })

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
          <div className="space-y-4 my-5">
            <Button
              type="button"
              variant={"secondary"}
              className="w-full flex items-center gap-2"
              onClick={() => loginWithGoogle()}
            >
              <p>Đăng nhập với Google</p> <GoogleIcon />
            </Button>
          </div>
          <Button
            disabled={login.isPending}
            className="gap-2 mt-5"
            type="submit"
          >
            {login.isPending && <SpokeSpinner size="lg" />}
            Đăng nhập
          </Button>
          <Link
            to="/auth/forgot-password"
            className="underline max-sm:text-lg ml-3"
          >
            Quên mật khẩu
          </Link>
        </form>
      </Form>

      <div className="mt-4 text-center text-sm max-sm:text-lg">
        Bạn chưa có tài khoản?{" "}
        <Link to="/auth/register" className="underline">
          Đăng ký
        </Link>
      </div>
    </>
  )
}

export default FormLogin
