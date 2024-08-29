import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { useAuthStore } from "@/store"

// Define the schema using zod
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  currentPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
})

export const ProfileRoute = () => {
  const user = useAuthStore((state) => state.user)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
    // Handle form submission
  }

  return (
    <LayoutWapper>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-4 py-20 space-y-6 md:px-6"
      >
        <header className="space-y-1.5">
          <div className="flex items-center space-x-4">
            <img
              src={user?.img}
              alt={user?.username}
              width="96"
              height="96"
              className="border rounded-full"
              style={{ aspectRatio: "96/96", objectFit: "cover" }}
            />
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold capitalize">
                {user?.username}
              </h1>
            </div>
          </div>
        </header>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="username"
                      placeholder="Enter your name"
                      {...field}
                    />
                  )}
                />
                {errors.username && <p>{errors.username.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  )}
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="phone"
                      placeholder="Enter your phone"
                      type="tel"
                      {...field}
                    />
                  )}
                />
                {errors.phone && <p>{errors.phone.message}</p>}
              </div>
            </div>
          </div>
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
                  <p>{errors.currentPassword.message}</p>
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
                {errors.newPassword && <p>{errors.newPassword.message}</p>}
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
                  <p>{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Button size="lg" type="submit">
            Save
          </Button>
        </div>
      </form>
    </LayoutWapper>
  )
}
