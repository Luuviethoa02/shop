import { z } from "zod"

const MAX_FILE_SIZE = 1000000
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export const formColorSchema = z.object({
  name: z
    .string({
      required_error: "Tên màu sắc không được để trống",
    })
    .nonempty("Tên màu sắc không được để trống."),
  quantity: z
    .string({
      required_error: "Số lượng không được để trống",
    })
    .min(1, {
      message: "Số lượng phải lớn hơn 0",
    }),
  image: z
    .any()
    .refine((files) => files instanceof FileList, {
      message: "Định dạng tệp không hợp lệ, vui lòng chọn lại tệp hình ảnh.",
    })
    .refine((files) => files?.length == 1, "Hình ảnh là bắt buộc.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Dung lượng tối đa là 10MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png và .webp là các định dạng hình ảnh hợp lệ."
    ),
})

export const formWeightSchema = (statusWeight: boolean) =>
  z.object({
    name: z.string().nonempty("Tên màu sắc không được để trống"),
    weight: statusWeight
      ? z.string().nonempty("Cân nặng không được để trống")
      : z.string().nonempty("Cân nặng không được để trống").optional(),
  })

export const formProductSchema = (
  statusSize: boolean,
  productEdit: boolean,
  statusWeight: boolean
) => {
  console.log(productEdit)

  return z.object({
    name: z.string({
      required_error: "Tên sản phẩm không được để trống",
    }),
    brand_id: z.string().nonempty("Danh mục không được để trống"),
    price: z.string({
      required_error: "Giá không được để trống",
    }),

    sizes: statusSize
      ? z.union([
          formWeightSchema(statusWeight),
          z
            .array(formWeightSchema(statusWeight))
            .min(1, "Thêm kích thước sản phẩm"),
        ])
      : z
          .union([
            formWeightSchema(statusWeight),
            z
              .array(formWeightSchema(statusWeight))
              .min(1, "Thêm kích thước sản phẩm"),
          ])
          .optional(),

    colors: productEdit
      ? z.union([formColorSchema, z.array(formColorSchema)]).optional()
      : z.union([
          formColorSchema,
          z.array(formColorSchema).min(1, "Thêm màu sắc sản phẩm"),
        ]),

    des: z
      .string({
        required_error: "Mô tả không được để trống",
      })
      .nonempty("Môt tả không được để trống")
      .min(10, "Mô tả phải có ít nhất 10 ký tự"),
    publish: z.boolean().default(false),
  })
}
