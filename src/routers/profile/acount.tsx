import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { useAuthStore } from "@/store"
import { ProfileLayout } from "@/components/layouts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, getImageUrl, getInitials } from "@/lib/utils"
import { ChangeEvent, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useUpdateAvartarUser } from "@/features/auth/api/update.avatar"

// Define the schema using zod
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  createdAt: z.string().optional(),
})

export const AccountRoute = () => {
  const user = useAuthStore((state) => state.user)!
  const { setUser } = useAuthStore()

  const [avatar, setAvatar] = useState<{
    img: string
    imgFile: FileList | null
  }>()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const updateAvatar = useUpdateAvartarUser()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      createdAt: formatDate(user?.createdAt!) || "",
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
    // Handle form submission
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const img = getImageUrl(event.target.files)!
      setAvatar({
        img,
        imgFile: event.target.files!,
      })
    }
  }

  const handleClickUpdateAvatar = () => {
    if (avatar?.imgFile) {
      const formData = new FormData()
      formData.append("img", avatar.imgFile[0])
      toast.promise(
        updateAvatar.mutateAsync(
          {
            data: formData,
            userId: user?._id!,
          },
          {
            onSuccess(data, variables, context) {
              setUser(data.data)
            },
          }
        ),
        {
          loading: "Đang cập nhật ảnh",
          success: "Cập nhật ảnh thành công",
          error: "Có lỗi xảy ra, vui lòng thử lại sau!",
        }
      )
    } else {
      toast.error("Có lỗi xảy ra vui lòng thủ lại!")
    }
  }

  useEffect(() => {
    if (user) {
      setAvatar({
        img: user.img,
        imgFile: null,
      })
    }
  }, [user])

  return (
    <LayoutWapper size="small">
      <ProfileLayout>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-4 space-y-6 md:px-6"
        >
          <header className="space-y-4 flex flex-col justify-center">
            <div className="flex items-center space-x-4">
              <Avatar className="size-24 border">
                <AvatarImage src={avatar?.img} alt={user?.username} />
                <AvatarFallback className="text-2xl">
                  {getInitials(user?.username)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex">
              <label
                htmlFor="file-input"
                className="inline-flex items-center rounded-md  px-4 py-2 text-sm font-medium text-secondary-foreground outline-1 border-[1px]"
              >
                {"Chọn ảnh"}
              </label>
              <input
                onChange={handleInputChange}
                id="file-input"
                type="file"
                className="sr-only"
              />
              {avatar?.imgFile && (
                <Button onClick={handleClickUpdateAvatar} className="ml-3">
                  Cập nhật ảnh
                </Button>
              )}
            </div>
          </header>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="username"
                        placeholder="Tên đăng nhập"
                        {...field}
                      />
                    )}
                  />
                  {errors.username && <p>{errors.username.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="email"
                        placeholder="Email"
                        type="email"
                        {...field}
                      />
                    )}
                  />
                  {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createdAt">Ngày tham gia</Label>
                  <Controller
                    name="createdAt"
                    control={control}
                    render={({ field }) => (
                      <Input
                        disabled
                        id="createdAt"
                        placeholder="Ngày tham gia"
                        type="tel"
                        {...field}
                      />
                    )}
                  />
                  {errors.createdAt && <p>{errors.createdAt.message}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Button size="lg" type="submit">
              Thay đổi
            </Button>
          </div>
        </form>
      </ProfileLayout>
    </LayoutWapper>
  )
}
