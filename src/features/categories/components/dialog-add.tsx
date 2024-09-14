import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getImageUrl } from "@/lib/utils"
import { Category } from "@/types/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTitle } from "@radix-ui/react-dialog"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { schemaCreateCategories } from "../validators"
import { useCreateCategory } from "../api/create-categories"
import { useUpdateCategory } from "../api/update-categories"

interface Iprops {
  open: boolean
  setOpen: (value: boolean) => void
  categoryEdit: Category | undefined
}

const DialogAdd = ({ open, setOpen, categoryEdit }: Iprops) => {
  const [image, setImage] = useState<string | undefined>()
  getImageUrl

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  const form = useForm<z.infer<ReturnType<typeof schemaCreateCategories>>>({
    resolver: zodResolver(schemaCreateCategories(!!categoryEdit)),
  })

  useEffect(() => {
    if (categoryEdit) {
      form.setValue("name", categoryEdit.name)
      form.setValue("img_cover", categoryEdit.img_cover)
      setImage(categoryEdit.img_cover)
    } else {
      form.reset()
      setImage(undefined)
    }
  }, [open])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const file = event.target.files
    if (file) {
      const image = getImageUrl(file)!
      setImage(image)
      field.onChange(file)
    }
  }

  const onSubmit = (
    values: z.infer<ReturnType<typeof schemaCreateCategories>>
  ) => {
    if (!categoryEdit) {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("img_cover", values.img_cover[0])
      toast.promise(
        createCategory.mutateAsync(
          {
            data: formData,
          },
          {
            onSuccess: () => {
              setOpen(false)
            },
          }
        ),
        {
          loading: "Đang thêm danh mục...",
          success: "Thêm danh mục thành công",
          error: "Thêm danh mục thất bại",
        }
      )
    } else {
      const formData = new FormData()
      if (values.name == categoryEdit.name && image == categoryEdit.img_cover) {
        toast.error("Không có gì thay đổi")
        return
      }
      if (values.name != categoryEdit.name) {
        formData.append("name", values.name)
      }
      if (image !== categoryEdit.img_cover) {
        formData.append("img_cover", values.img_cover[0])
      }
      toast.promise(
        updateCategory.mutateAsync(
          {
            data: formData,
            categoryId: categoryEdit._id,
          },
          {
            onSuccess: () => {
              setOpen(false)
            },
          }
        ),
        {
          loading: "Đang sửa danh mục...",
          success: "Sửa danh mục thành công",
          error: "Sửa danh mục thất bại",
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
        className="max-w-xl"
      >
        <DialogTitle>
          {categoryEdit ? "Sửa danh mục" : " Tạo danh mục"}
        </DialogTitle>
        <FormProvider {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập tên danh mục"
                  className="w-full"
                />
              )}
            />
            <span className="text-red-500">
              {form.formState.errors.name?.message}
            </span>
            <FormField
              control={form.control}
              name="img_cover"
              render={({ field }) => (
                <Input
                  onChange={(e) => handleInputChange(e, field)}
                  type="file"
                />
              )}
            />
            <span className="text-red-500">
              {form.formState.errors.img_cover?.message?.toString()}
            </span>

            {image && (
              <img
                className="size-20 object-cover block rounded aspect-square"
                src={image}
                alt=""
              />
            )}
            <Button
              // disabled={updateQuantity.status === "pending"}
              className="block"
              type="submit"
            >
              {categoryEdit ? "Sửa" : "Tạo"}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default DialogAdd
