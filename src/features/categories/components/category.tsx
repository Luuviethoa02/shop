import { Category } from "@/types/client"
import nProgress from "nprogress"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCategoryDetail } from "../api/get-category"

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
      console.error("Failed to load product detail:", error)
      nProgress.done()
    }
  }, [response, error, slug])

  const handleCardItemClick = (slug: string) => {
    setSlug(slug)
  }

  return (
    <div
      onClick={() => handleCardItemClick(category.slug)}
      className="cursor-pointer flex flex-col items-center gap-3 max-h-72 min-h-72 ml-3 h-44 mb-3"
    >
      <img
        src={category?.img_cover || ""}
        className="w-full h-[90%] block object-cover"
        alt={category.name}
      />
      <h4 className="scroll-m-20 capitalize text-lg font-semibold tracking-tight">
        {category.name}
      </h4>
    </div>
  )
}

export default CategoryItem
