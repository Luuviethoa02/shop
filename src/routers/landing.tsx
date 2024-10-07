import { Banner } from "@/components/sections"
import SEO from "@/components/seo"
import LayoutWapper from "@/components/warper/layout.wrapper"
import CategoryList from "@/features/categories/components/categories-list"
import ProductList from "@/features/products/components/product-list"

export const LandingRoute = () => {
  return (
    <>
      <SEO
        title="Trang chủ"
        description="this is the landing page of the shop"
      />
      <LayoutWapper>
        <div className="space-y-10">
          <Banner />
          <CategoryList />
          <ProductList />
        </div>
      </LayoutWapper>
    </>
  )
}
