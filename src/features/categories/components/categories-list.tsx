import Slider from "react-slick"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { settingsSlider } from "../constants"
import SampleNextArrow from "./ui/SampleNextArrow"
import SamplePrevArrow from "./ui/SamplePrevArrow"
import { useCategories } from "../api/get-categories"
import CategoryItem from "./category"

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

  return (
    <LayoutWapper>
      <h2 className="scroll-m-20 mb-5 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Danh Mục sản phẩm
      </h2>
      {data && (
        <div className="slider-container">
          <Slider {...settings}>
            {data &&
              data?.data?.map((category, index) => (
                <CategoryItem category={category} key={index} />
              ))}
          </Slider>
        </div>
      )}
    </LayoutWapper>
  )
}

export default CategoryList
