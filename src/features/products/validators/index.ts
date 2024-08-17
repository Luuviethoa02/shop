import { z } from "zod"

const MAX_FILE_SIZE = 1000000
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export const formColorSchema = z.object({
  name: z.string().nonempty("Tên màu sắc không được để trống."),
  image: z
    .instanceof(FileList)
    .refine((files) => files?.length == 1, "Hình ảnh là bắt buộc.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `dung lượng tối đa là 10MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png và .webp là các định dạng hình ảnh hợp lệ."
    ),
})

export const formWeightSchema = z.object({
  name: z.string().nonempty("Tên màu sắc không được để trống."),
  weight: z.string().nonempty("Cân nặng không được để trống."),
})

export const formProductSchema = z.object({
  name: z.string().nonempty("Tên màu sắc không được để trống."),
  brand_id: z.string().nonempty("Danh mục không được để trống."),
  price: z.string().nonempty("Giá không được để trống."),
  sizes: z.union([
    formWeightSchema,
    z.array(formWeightSchema).min(1, "Thêm kích thước sản phẩm"),
  ]),
  colors: z.union([
    formColorSchema,
    z.array(formColorSchema).min(1, "Thêm màu sắc sản phẩm"),
  ]),
  des: z
    .string()
    .nonempty("Môt tả không được để trống.")
    .min(10, "Mô tả phải có ít nhất 10 ký tự."),
  publish: z.boolean().default(false),
})
