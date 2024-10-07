import { ProfileLayout } from "@/components/layouts"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { Controller, useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"

// Define Zod schema
const schema = z
  .object({
    currentPassword: z.string().min(1, "Current Password is required"),
    newPassword: z
      .string()
      .min(6, "New Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const ChangePasswordRoute = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data)
    // Handle form submission
  }

  return (
    <LayoutWapper size="small">
      <ProfileLayout>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Change Password</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Controller
                    name="currentPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="currentPassword"
                        placeholder="Enter your current password"
                        type="password"
                        {...field}
                      />
                    )}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500">{`${errors.currentPassword.message}`}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="newPassword"
                        placeholder="Enter your new password"
                        type="password"
                        {...field}
                      />
                    )}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500">{`${errors.newPassword.message}`}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="confirmPassword"
                        placeholder="Confirm your new password"
                        type="password"
                        {...field}
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Button type="submit">Thay đổi</Button>
            </div>
          </form>
        </FormProvider>
      </ProfileLayout>
    </LayoutWapper>
  )
}
