import { z } from "zod"

const MAX_FILE_SIZE = 1000000
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export const schemaCreateCategories = (isEditing: boolean) =>
  z.object({
    name: z.string().min(1, "Tên danh mục là bắt buộc"),
    img_cover: z
      .any()
      .refine(
        (file) => isEditing || (file && file.length > 0),
        "Ảnh bìa là bắt buộc khi tạo mới"
      ),
  })
