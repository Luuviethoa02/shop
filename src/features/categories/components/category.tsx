import { Category } from "@/types/client"

interface Iprops {
  category: Category
}

const CategoryItem = ({ category }: Iprops) => {
  return (
    <div className="flex flex-col items-center gap-3 max-h-72 min-h-72 ml-3 h-44 mb-3">
      <img
        src={category?.img_cover || ""}
        className="w-full h-[90%] block object-cover"
        alt={category.name}
      />
      <h4 className="scroll-m-20 capitalize text-lg font-semibold tracking-tight">
        People stopped telling jokes
      </h4>
    </div>
  )
}

export default CategoryItem
