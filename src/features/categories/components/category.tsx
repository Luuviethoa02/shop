import { Category } from "@/types/client"
import nProgress from "nprogress"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useGetProductByCategory } from "@/features/products/api/get-by-category"
import { LIMIT_PAE_PRODUCT_LIST } from "@/features/products/constants"

interface Iprops {
  category: Category
}

const CategoryItem = ({ category }: Iprops) => {
  const [slug, setSlug] = useState<string | undefined>(undefined)
  const navigate = useNavigate()
  const { data: response, error } = useGetProductByCategory({
    slugCategory: slug,
    is_discount: false
  })

  useEffect(() => {
    if (slug) {
      nProgress.start()
    }
  }, [slug])

  useEffect(() => {
    if (response) {
      navigate(`/category/${slug}`, { state: { response } })
      nProgress.done()
    }
    if (error) {
      toast.error("Đã xảy ra lỗi!, thử lại sau")
      nProgress.done()
    }
  }, [response, error, slug])

  const handleCardItemClick = (slug: string) => {
    setSlug(slug)
  }

  return (
    <div className="relative border border-solid group grid [grid-template-areas:stack] overflow-hidden min-w-full p-3">
      <div className="w-full flex items-center justify-center">
        <div onClick={() => handleCardItemClick(category?.slug)} className="min-w-20 max-w-20 group min-h-20 flex items-center justify-center max-h-20 cursor-pointer">
          <img
            src={category?.img_cover}
            alt={category?.name}
            className="[grid-area:stack] group-hover:scale-110 transition-all duration-75 mx-auto min-w-full max-w-full min-h-full max-h-full object-cover w-full aspect-square"
          />
        </div>
      </div>
      <p
        onClick={() => handleCardItemClick(category?.slug)}
        className="font-normal block mt-4 transition-all hover:text-primary cursor-pointer capitalize text-xs tracking-tight text-center"
      >
        {category?.name}
      </p>
    </div>
  )
}

export default CategoryItem
