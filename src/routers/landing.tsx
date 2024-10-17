import { Banner } from "@/components/sections"
import SEO from "@/components/seo"
import { InfiniteMovingCards } from "@/components/share/infinite-moving-cards"
import LayoutWapper from "@/components/warper/layout.wrapper"
import CategoryList from "@/features/categories/components/categories-list"
import ProductList from "@/features/products/components/product-list"
import ShopsList from "@/features/seller/components/shopsList"

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
          <ShopsList />
          <ProductList />
        </div>
      </LayoutWapper>
    </>
  )
}
