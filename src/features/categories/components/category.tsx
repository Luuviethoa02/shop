import { Category } from "@/types/client"
import nProgress from "nprogress"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCategoryDetail } from "../api/get-category"
import toast from "react-hot-toast"

interface Iprops {
  category: Category
}

const CategoryItem = ({ category }: Iprops) => {
  const [slug, setSlug] = useState<string | undefined>(undefined)
  const navigate = useNavigate()
  const { data: response, error } = useCategoryDetail({ slug })

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
    <div className="relative mx-4 group grid [grid-template-areas:stack] overflow-hidden rounded-lg">
      <img
        src={category?.img_cover}
        alt={category?._id}
        width={300}
        height={200}
        className="[grid-area:stack] object-cover w-full aspect-square"
      />
      <div className="flex-1 [grid-area:stack] bg-black/40 text-destructive-foreground group-hover:opacity-90 transition-opacity p-6 pb-2 justify-end flex flex-col gap-2">
        <h3
          onClick={() => handleCardItemClick(category?.slug)}
          className="font-semibold hover:text-secondary-foreground transition-all cursor-pointer capitalize text-lg tracking-tight text-center"
        >
          {category?.name}
        </h3>
      </div>
    </div>
  )
}

export default CategoryItem
