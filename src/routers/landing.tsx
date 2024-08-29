import { MainLayout } from "@/components/layouts"
import { Banner } from "@/components/sections"
import SEO from "@/components/seo"
import CategoryList from "@/features/categories/components/categories-list"
import ProductList from "@/features/products/components/product-list"

export const LandingRoute = () => {
  return (
    <>
      <SEO
        title="Shop Landing Page"
        description="this is the landing page of the shop"
      />
      <div className="space-y-14">
        <Banner />
        <CategoryList />
        <ProductList />
      </div>
    </>
  )
}
