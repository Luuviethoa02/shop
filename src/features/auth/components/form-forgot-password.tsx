import React from "react"
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
import { SpokeSpinner } from "@/components/ui/spinner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchemaforgotPassword } from "../validators"
import { z } from "zod"
import { Link } from "react-router-dom"
import { useCreateMail } from "../api/send-mail"
import toast from "react-hot-toast"

const FormForgotPassword = () => {
  const sendMail = useCreateMail()

  const form = useForm<z.infer<typeof formSchemaforgotPassword>>({
    resolver: zodResolver(formSchemaforgotPassword),
  })

  function onSubmit(values: z.infer<typeof formSchemaforgotPassword>) {
    console.log(values)
    toast.promise(
      sendMail.mutateAsync({
        data: values,
      }),
      {
        loading: "Đang gửi email...",
        success: "Gửi email thành công",
        error: "Gửi email thất bại",
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Nhập email của bạn..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={sendMail.status === "pending"}
          className="gap-2"
          type="submit"
        >
          {sendMail.status === "pending" && <SpokeSpinner size="lg" />}
          Gửi
        </Button>
        <Link className="underline ml-4" to={"/auth/login"}>
          Đăng nhập
        </Link>
      </form>
    </Form>
  )
}

export default FormForgotPassword
