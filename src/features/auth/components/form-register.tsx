import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { formSchemaRegister } from '../validators'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const ForRegister = () => {

  const form = useForm<z.infer<typeof formSchemaRegister>>({
    resolver: zodResolver(formSchemaRegister),
    defaultValues: {
      username:'',
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchemaRegister>) {
    console.log(values)
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
                  <Input {...field} />
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
          <Button type="submit">Đăng ký</Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Bạn đã có tài khoản?{' '}
        <Link to="/auth/login" className="underline">
          Đăng nhập
        </Link>
      </div>
    </>
  )

}

export default ForRegister
