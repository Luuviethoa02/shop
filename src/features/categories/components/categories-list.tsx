import Slider from "react-slick"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { settingsSlider } from "../constants"
import { useCategories } from "../api/get-categories"
import CategoryItem from "./category"
import { Skeleton } from "@/components/ui/skeleton"

const CategoryList = () => {
  const settings = {
    ...settingsSlider,
  }
  const { data, isLoading } = useCategories()

  return (
    <LayoutWapper>
      <h2 className="scroll-m-20 mb-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Danh Mục sản phẩm
      </h2>
      <div className="slider-container">
        <Slider {...settings}>
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="max-h-44 min-h-44 ml-1"></Skeleton>
              </div>
            ))}

          {data &&
            !isLoading &&
            data?.data?.map((category, index) => (
              <CategoryItem category={category} key={index} />
            ))}
        </Slider>
      </div>
    </LayoutWapper>
  )
}

export default CategoryList
