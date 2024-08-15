import Slider from "react-slick"
import Category from "./category"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { cn } from "@/lib/utils"
import { settingsSlider } from "../constants"
import SampleNextArrow from "./ui/SampleNextArrow"
import SamplePrevArrow from "./ui/SamplePrevArrow"
import { useCategories } from "../api/get-categories"

const CategoryList = () => {
  const settings = {
    ...settingsSlider,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }

  const { data, isPending } = useCategories()
  if (isPending) {
    return <h3>loading....</h3>
  }
  console.log(data)

  return (
    <LayoutWapper>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Danh Mục sản phẩm
      </h2>
      {data && (
        <div className="slider-container">
          <Slider {...settings}>
            {data && data?.data?.map((_, index) => <Category key={index} />)}
          </Slider>
        </div>
      )}
    </LayoutWapper>
  )
}

export default CategoryList
