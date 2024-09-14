import LoadingMain from "@/components/share/LoadingMain"
import { Button } from "@/components/ui/button"

import { useCategories } from "@/features/categories/api/get-categories"
import DialogAdd from "@/features/categories/components/dialog-add"
import DialogDetail from "@/features/products/components/dialog-detail"
import useFormatDateVN from "@/hooks/useFormatDateVN"
import { productRespose } from "@/types/api"
import { Category } from "@/types/client"
import { useEffect, useState } from "react"

export const CategoryRoute = () => {
  const { formatDate } = useFormatDateVN()
  const [categoryEdit, setCategoryEdit] = useState<Category>()
  const [showModal, setShowModalAdd] = useState(false)

  const categorires = useCategories()

  const handleClickEdit = (category: Category) => {
    setCategoryEdit(category)
    setShowModalAdd(true)
  }

  useEffect(() => {
    if (!showModal) {
      setCategoryEdit(undefined)
    }
  }, [showModal])

  if (categorires.status === "pending") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingMain />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-0 flex min-h-full max-h-screen flex-col">
      <div className="flex justify-between items-center mb-6">
        <Button size="sm" onClick={() => setShowModalAdd(true)}>
          Thêm danh mục sản phẩm
        </Button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-background z-10">
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left">Danh mục sản phẩm</th>
              <th className="px-4 py-3 text-right">Slug</th>
              <th className="px-4 py-3 text-right">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Hành Động</th>
            </tr>
          </thead>
          <tbody className="max-h-[200px] overflow-auto">
            {categorires.status === "success" &&
              categorires?.data?.data.map((category) => (
                <tr
                  key={category._id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={category.img_cover}
                        alt={category.name}
                        className="w-16 h-16 rounded object-cover block"
                      />
                      <p className="capitalize">{category.name}</p>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    {category.slug}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      onClick={() => handleClickEdit(category)}
                      variant={"outline"}
                      size="sm"
                      className="ml-2"
                    >
                      Sửa
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <DialogAdd
        open={showModal}
        setOpen={setShowModalAdd}
        categoryEdit={categoryEdit}
      />
    </div>
  )
}
